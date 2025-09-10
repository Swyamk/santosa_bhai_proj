const express = require('express');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const { getFirestore } = require('../lib/firebaseAdmin');
const { generateMultipleSignedUrls } = require('../lib/signedUrl');
const { sendEmailWithNodemailer, sendEmailDevelopment } = require('../lib/nodemailerService');
const { 
  sendWhatsAppWithGreenAPI, 
  sendWhatsAppWithWati, 
  sendWhatsAppDevelopment 
} = require('../lib/whatsappService');
const seedData = require('../seed/seed.json');

const router = express.Router();

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Twilio
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * POST /api/deliver
 * Accepts: { 
 *   studentId: string, 
 *   materialIds: string[], 
 *   method: "email"|"whatsapp", 
 *   contact: string 
 * }
 * Returns: { status: "queued"|"sent", details: object }
 */
router.post('/deliver', async (req, res) => {
  try {
    const { studentId, materialIds, method, contact } = req.body;

    // Validate input
    if (!studentId || !materialIds || !Array.isArray(materialIds) || !method || !contact) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: studentId, materialIds, method, contact'
      });
    }

    if (!['email', 'whatsapp'].includes(method)) {
      return res.status(400).json({
        success: false,
        error: 'Method must be either "email" or "whatsapp"'
      });
    }

    // Get student data
    let student = null;
    try {
      const db = getFirestore();
      const studentDoc = await db.collection('students').doc(studentId).get();
      if (studentDoc.exists) {
        student = { id: studentDoc.id, ...studentDoc.data() };
      }
    } catch (error) {
      console.log('Using seed data for student lookup');
    }

    if (!student) {
      student = seedData.students.find(s => s.id === studentId);
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Get materials data
    let materials = [];
    try {
      const db = getFirestore();
      const materialsPromises = materialIds.map(id => 
        db.collection('materials').doc(id).get()
      );
      const materialDocs = await Promise.all(materialsPromises);
      
      materials = materialDocs
        .filter(doc => doc.exists)
        .map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.log('Using seed data for materials lookup');
      materials = seedData.materials.filter(m => materialIds.includes(m.id));
    }

    if (materials.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No materials found'
      });
    }

    // Generate signed URLs for materials
    const filePaths = materials.map(m => m.filePath);
    const signedUrls = await generateMultipleSignedUrls(filePaths, 10); // 10 minutes expiry

    // Add signed URLs to materials
    const materialsWithUrls = materials.map(material => ({
      ...material,
      downloadUrl: signedUrls[material.filePath]
    }));

    // Send via requested method
    let deliveryResult = null;

    if (method === 'email') {
      deliveryResult = await sendEmailDelivery(student, materialsWithUrls, contact);
    } else if (method === 'whatsapp') {
      deliveryResult = await sendWhatsAppDelivery(student, materialsWithUrls, contact);
    }

    // Log delivery to Firestore (if available)
    try {
      const db = getFirestore();
      await db.collection('deliveries').add({
        studentId,
        materialIds,
        method,
        contact,
        deliveredAt: new Date().toISOString(),
        status: deliveryResult.status,
        details: deliveryResult.details
      });
    } catch (error) {
      console.log('Could not log delivery to Firestore:', error.message);
    }

    res.json({
      success: true,
      status: deliveryResult.status,
      details: deliveryResult.details,
      materials: materialsWithUrls.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        course: m.course
      }))
    });

  } catch (error) {
    console.error('Error in delivery route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Send materials via email - Multiple service support
 */
async function sendEmailDelivery(student, materials, emailAddress) {
  try {
    // Priority order: Nodemailer -> SendGrid -> Development Mode
    
    // Try Nodemailer first (Gmail/Outlook/SMTP)
    if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      console.log('📧 Using Nodemailer service...');
      return await sendEmailWithNodemailer(student, materials, emailAddress);
    }
    
    // Try SendGrid as backup
    if (process.env.SENDGRID_API_KEY) {
      console.log('📧 Using SendGrid service...');
      return await sendEmailWithSendGrid(student, materials, emailAddress);
    }
    
    // Development mode fallback
    console.log('📧 Using Development mode (no email service configured)...');
    return await sendEmailDevelopment(student, materials, emailAddress);

  } catch (error) {
    console.error('Email delivery error:', error);
    return {
      status: 'failed',
      details: {
        message: 'Failed to send email',
        error: error.message
      }
    };
  }
}

/**
 * SendGrid email service
 */
async function sendEmailWithSendGrid(student, materials, emailAddress) {
  try {

    const coursesText = [...new Set(materials.map(m => m.course))].join(', ');
    
    const materialsList = materials.map(material => 
      `• ${material.title} (${material.type.toUpperCase()}) - ${material.course}\n  Download: ${material.downloadUrl}`
    ).join('\n\n');

    const emailContent = {
      to: emailAddress,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@studyplatform.com',
      subject: `Your requested study materials for ${coursesText}`,
      text: `Dear ${student.name},

Here are your requested study materials:

${materialsList}

Important: These download links will expire in 10 minutes for security purposes.

Best regards,
Study Platform Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Study Materials</h2>
          <p>Dear ${student.name},</p>
          <p>Here are your requested study materials for <strong>${coursesText}</strong>:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${materials.map(material => `
              <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #007bff;">
                <strong>${material.title}</strong><br>
                <small>Course: ${material.course} | Type: ${material.type.toUpperCase()} | Size: ${material.size}</small><br>
                <a href="${material.downloadUrl}" style="color: #007bff; text-decoration: none;">📁 Download</a>
              </div>
            `).join('')}
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffeaa7;">
            <strong>⚠️ Important:</strong> These download links will expire in 10 minutes for security purposes.
          </div>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Study Platform Team</strong>
          </p>
        </div>
      `
    };

    await sgMail.send(emailContent);

    return {
      status: 'sent',
      details: {
        message: 'Email sent successfully via SendGrid',
        recipient: emailAddress,
        materialCount: materials.length
      }
    };

  } catch (error) {
    console.error('SendGrid delivery error:', error);
    throw error;
  }
}

/**
 * Send materials via WhatsApp
 */
/**
 * Send materials via WhatsApp - Multiple service support
 */
async function sendWhatsAppDelivery(student, materials, phoneNumber) {
  try {
    // Priority order: Green API -> Wati.io -> Twilio -> Development Mode
    
    // Try Green API first (affordable alternative)
    if (process.env.GREEN_API_ID_INSTANCE && process.env.GREEN_API_TOKEN) {
      console.log('📱 Using Green API service...');
      return await sendWhatsAppWithGreenAPI(student, materials, phoneNumber);
    }
    
    // Try Wati.io as second option
    if (process.env.WATI_API_KEY && process.env.WATI_BASE_URL) {
      console.log('📱 Using Wati.io service...');
      return await sendWhatsAppWithWati(student, materials, phoneNumber);
    }
    
    // Try Twilio as third option
    if (twilioClient) {
      console.log('📱 Using Twilio service...');
      return await sendWhatsAppWithTwilio(student, materials, phoneNumber);
    }
    
    // Development mode fallback
    console.log('📱 Using Development mode (no WhatsApp service configured)...');
    return await sendWhatsAppDevelopment(student, materials, phoneNumber);

  } catch (error) {
    console.error('WhatsApp delivery error:', error);
    return {
      status: 'failed',
      details: {
        message: 'Failed to send WhatsApp message',
        error: error.message
      }
    };
  }
}

/**
 * Twilio WhatsApp service
 */
async function sendWhatsAppWithTwilio(student, materials, phoneNumber) {
  try {
    const coursesText = [...new Set(materials.map(m => m.course))].join(', ');
    
    const materialsList = materials.map((material, index) => 
      `${index + 1}. *${material.title}* (${material.type.toUpperCase()}) - ${material.course}\n📁 ${material.downloadUrl}`
    ).join('\n\n');

    const messageText = `🎓 *Study Materials for ${student.name}*

📚 Course(s): *${coursesText}*

${materialsList}

⚠️ *Important:* Download links expire in 10 minutes.

Best regards,
Study Platform Team`;

    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
      to: `whatsapp:${phoneNumber}`,
      body: messageText
    });

    return {
      status: 'sent',
      details: {
        message: 'WhatsApp message sent successfully via Twilio',
        recipient: phoneNumber,
        messageId: message.sid,
        materialCount: materials.length
      }
    };

  } catch (error) {
    console.error('Twilio WhatsApp error:', error);
    throw error;
  }
}

module.exports = router;
