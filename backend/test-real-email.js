/**
 * Test real email delivery with Resend
 */

require('dotenv').config();
const { sendEmailWithResend } = require('./lib/resendService');

// Test data
const testStudent = {
  id: 'S101',
  name: 'John Doe',
  email: 'john.doe@example.com',
  course: 'Computer Science'
};

const testMaterials = [
  {
    id: 'M001',
    title: 'Introduction to Programming',
    type: 'pdf',
    course: 'Computer Science',
    size: '2.5 MB',
    downloadUrl: 'https://example.com/download/intro-programming.pdf'
  }
];

async function testRealEmail() {
  console.log('🧪 TESTING REAL EMAIL DELIVERY');
  console.log('==============================');
  
  // Use your actual Gmail address as recipient
  const realEmail = 'swyamk.facts@gmail.com';
  
  try {
    console.log(`📧 Sending email to: ${realEmail}`);
    console.log(`📤 From: ${process.env.RESEND_FROM_EMAIL}`);
    
    const result = await sendEmailWithResend(testStudent, testMaterials, realEmail);
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    console.log('\n📨 CHECK YOUR INBOX:');
    console.log(`- Check ${realEmail}`);
    console.log('- Check spam/junk folder');
    console.log('- Look for email from "onboarding@resend.dev"');
    
  } catch (error) {
    console.log('❌ EMAIL FAILED!');
    console.log('🔍 Error:', error.message);
  }
}

testRealEmail().catch(console.error);
