const nodemailer = require('nodemailer');

/**
 * Alternative email service using Nodemailer
 * Can work with Gmail, Outlook, Yahoo, or any SMTP server
 */

// Create transporter based on email service
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || process.env.GMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
      }
    });
  } else if (emailService === 'outlook') {
    return nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER || process.env.OUTLOOK_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.OUTLOOK_PASSWORD
      }
    });
  } else if (emailService === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } else {
    throw new Error('Unsupported email service');
  }
};

/**
 * Send email using Nodemailer
 * @param {Object} student - Student information
 * @param {Array} materials - Array of materials
 * @param {string} toEmail - Recipient email
 * @returns {Promise} - Email sending result
 */
const sendEmailWithNodemailer = async (student, materials, toEmail) => {
  try {
    const transporter = createTransporter();
    
    const coursesText = [...new Set(materials.map(m => m.course))].join(', ');
    
    const materialsList = materials.map(material => 
      `• ${material.title} (${material.type.toUpperCase()}) - ${material.course}\n  Download: ${material.downloadUrl}`
    ).join('\n\n');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Your Study Materials</h2>
        <p>Dear ${student.name},</p>
        <p>Here are your requested study materials for <strong>${coursesText}</strong>:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${materials.map(material => `
            <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #2563eb;">
              <strong>${material.title}</strong><br>
              <small>Course: ${material.course} | Type: ${material.type.toUpperCase()} | Size: ${material.size}</small><br>
              <a href="${material.downloadUrl}" style="color: #2563eb; text-decoration: none;">📁 Download</a>
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
    `;

    const textContent = `Dear ${student.name},

Here are your requested study materials for ${coursesText}:

${materialsList}

Important: These download links will expire in 10 minutes for security purposes.

Best regards,
Study Platform Team`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
      to: toEmail,
      subject: `Your requested study materials for ${coursesText}`,
      text: textContent,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    
    return {
      status: 'sent',
      details: {
        message: 'Email sent successfully via Nodemailer',
        messageId: result.messageId,
        recipient: toEmail,
        materialCount: materials.length
      }
    };

  } catch (error) {
    console.error('Nodemailer email error:', error);
    return {
      status: 'failed',
      details: {
        message: 'Failed to send email via Nodemailer',
        error: error.message
      }
    };
  }
};

/**
 * Development mode email simulation
 */
const sendEmailDevelopment = (student, materials, toEmail) => {
  console.log('=== EMAIL DELIVERY (Nodemailer Development Mode) ===');
  console.log(`To: ${toEmail}`);
  console.log(`Student: ${student.name} (${student.id})`);
  console.log('Materials:');
  materials.forEach(material => {
    console.log(`- ${material.title} (${material.type.toUpperCase()})`);
    console.log(`  Course: ${material.course}`);
    console.log(`  Download: ${material.downloadUrl}`);
  });
  console.log('=== END EMAIL ===');
  
  return {
    status: 'sent',
    details: { 
      message: 'Email logged in development mode (Nodemailer)',
      recipient: toEmail,
      materialCount: materials.length
    }
  };
};

module.exports = {
  sendEmailWithNodemailer,
  sendEmailDevelopment
};
