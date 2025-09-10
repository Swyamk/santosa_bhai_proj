/**
 * Resend Email Service
 * Modern alternative to SendGrid with better developer experience
 */

const { Resend } = require('resend');

/**
 * Send email using Resend service
 */
async function sendEmailWithResend(student, materials, emailAddress) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const coursesText = [...new Set(materials.map(m => m.course))].join(', ');
    
    const materialsList = materials.map(material => 
      `• ${material.title} (${material.type.toUpperCase()}) - ${material.course}\n  Download: ${material.downloadUrl}`
    ).join('\n\n');

    const emailContent = {
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: emailAddress,
      subject: `Your requested study materials for ${coursesText}`,
      text: `Dear ${student.name},

Here are your requested study materials:

${materialsList}

Important: These download links will expire in 10 minutes for security purposes.

Best regards,
Study Platform Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📚 Study Materials</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Delivered via Resend</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">Dear <strong>${student.name}</strong>,</p>
            <p style="font-size: 16px; color: #555; margin-bottom: 25px;">Here are your requested study materials for <strong style="color: #667eea;">${coursesText}</strong>:</p>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
              ${materials.map(material => `
                <div style="margin-bottom: 20px; padding: 20px; border-left: 4px solid #667eea; background: white; border-radius: 0 8px 8px 0;">
                  <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${material.title}</h3>
                  <div style="margin-bottom: 15px;">
                    <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px;">📚 ${material.course}</span>
                    <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px;">📋 ${material.type.toUpperCase()}</span>
                    <span style="background: #e8f5e8; color: #388e3c; padding: 4px 8px; border-radius: 4px; font-size: 12px;">💾 ${material.size}</span>
                  </div>
                  <a href="${material.downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">📁 Download Now</a>
                </div>
              `).join('')}
            </div>
            
            <div style="background: linear-gradient(90deg, #ff9a56 0%, #ff6b6b 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: white; margin: 0; font-weight: bold; font-size: 16px;">⚠️ Important Security Notice</p>
              <p style="color: #fff; margin: 10px 0 0 0; font-size: 14px;">These download links will expire in <strong>10 minutes</strong> for your security and privacy.</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
              <p style="margin: 0; color: #777; font-size: 16px;">Happy studying! 🎓</p>
              <p style="margin: 10px 0 0 0; font-weight: bold; color: #333; font-size: 18px;">Study Platform Team</p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">Powered by Resend</p>
            </div>
          </div>
        </div>
      `
    };

    const result = await resend.emails.send(emailContent);

    return {
      status: 'sent',
      details: {
        message: 'Email sent successfully via Resend',
        recipient: emailAddress,
        materialCount: materials.length,
        messageId: result.data?.id || 'unknown'
      }
    };

  } catch (error) {
    console.error('Resend email error:', error);
    throw error;
  }
}

module.exports = {
  sendEmailWithResend
};
