/**
 * WhatsApp Service Alternatives
 * Supports multiple WhatsApp API providers
 */

const axios = require('axios');

/**
 * Send WhatsApp message using Green API (affordable alternative to Twilio)
 */
async function sendWhatsAppWithGreenAPI(student, materials, phoneNumber) {
  try {
    if (!process.env.GREEN_API_ID_INSTANCE || !process.env.GREEN_API_TOKEN) {
      throw new Error('Green API credentials not configured');
    }

    const coursesText = [...new Set(materials.map(m => m.course))].join(', ');
    
    const materialsList = materials.map(material => 
      `📖 *${material.title}*\n📝 Course: ${material.course}\n📋 Type: ${material.type.toUpperCase()}\n📁 Download: ${material.downloadUrl}`
    ).join('\n\n');

    const message = `🎓 *Your Study Materials*

Hi ${student.name}! 👋

Here are your requested materials for *${coursesText}*:

${materialsList}

⚠️ *Important:* Download links expire in 10 minutes for security.

📚 Happy studying!
- Study Platform Team`;

    const url = `https://api.green-api.com/waInstance${process.env.GREEN_API_ID_INSTANCE}/sendMessage/${process.env.GREEN_API_TOKEN}`;
    
    const response = await axios.post(url, {
      chatId: `${phoneNumber}@c.us`,
      message: message
    });

    return {
      status: 'sent',
      details: {
        message: 'WhatsApp sent successfully via Green API',
        recipient: phoneNumber,
        materialCount: materials.length,
        messageId: response.data.idMessage
      }
    };

  } catch (error) {
    console.error('Green API WhatsApp error:', error);
    throw error;
  }
}

/**
 * Send WhatsApp message using Wati.io (business-focused)
 */
async function sendWhatsAppWithWati(student, materials, phoneNumber) {
  try {
    if (!process.env.WATI_API_KEY || !process.env.WATI_BASE_URL) {
      throw new Error('Wati.io credentials not configured');
    }

    const coursesText = [...new Set(materials.map(m => m.course))].join(', ');
    
    const materialsList = materials.map(material => 
      `📖 ${material.title}\n📝 ${material.course} | ${material.type.toUpperCase()}\n📁 ${material.downloadUrl}`
    ).join('\n\n');

    const message = `🎓 Study Materials for ${student.name}

Materials for ${coursesText}:

${materialsList}

⚠️ Links expire in 10 minutes.

📚 Study Platform Team`;

    const url = `${process.env.WATI_BASE_URL}/api/v1/sendSessionMessage/${phoneNumber}`;
    
    const response = await axios.post(url, {
      messageText: message
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      status: 'sent',
      details: {
        message: 'WhatsApp sent successfully via Wati.io',
        recipient: phoneNumber,
        materialCount: materials.length,
        messageId: response.data.messageId
      }
    };

  } catch (error) {
    console.error('Wati.io WhatsApp error:', error);
    throw error;
  }
}

/**
 * Development mode WhatsApp delivery (logs to console)
 */
async function sendWhatsAppDevelopment(student, materials, phoneNumber) {
  console.log('=== WHATSAPP DELIVERY (Development Mode) ===');
  console.log(`To: ${phoneNumber}`);
  console.log(`Student: ${student.name} (${student.id})`);
  console.log('Materials:');
  materials.forEach(material => {
    console.log(`- ${material.title} (${material.type.toUpperCase()})`);
    console.log(`  Course: ${material.course}`);
    console.log(`  Download: ${material.downloadUrl}`);
  });
  console.log('=== END WHATSAPP ===');
  
  return {
    status: 'sent',
    details: { 
      message: 'WhatsApp logged in development mode',
      recipient: phoneNumber,
      materialCount: materials.length
    }
  };
}

/**
 * Send WhatsApp using Baileys (unofficial WhatsApp Web API)
 * Note: This requires a phone number and QR code scanning
 */
async function sendWhatsAppWithBaileys(student, materials, phoneNumber) {
  // This would require the Baileys library and is more complex
  // For now, fall back to development mode
  console.log('Baileys WhatsApp integration would go here');
  return await sendWhatsAppDevelopment(student, materials, phoneNumber);
}

module.exports = {
  sendWhatsAppWithGreenAPI,
  sendWhatsAppWithWati,
  sendWhatsAppDevelopment,
  sendWhatsAppWithBaileys
};
