/**
 * Test Resend Email Service
 * Run with: node test-resend.js
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
  },
  {
    id: 'M002',
    title: 'Data Structures Notes',
    type: 'pdf',
    course: 'Computer Science',
    size: '1.8 MB',
    downloadUrl: 'https://example.com/download/data-structures.pdf'
  }
];

async function testResend() {
  console.log('🧪 TESTING RESEND EMAIL SERVICE');
  console.log('================================');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found in .env file');
    console.log('💡 Make sure you have added your Resend API key to the .env file');
    return;
  }
  
  console.log('✅ Resend API key found');
  console.log(`📧 API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
  console.log(`📤 From Email: ${process.env.RESEND_FROM_EMAIL}`);
  
  try {
    console.log('\n📧 Sending test email via Resend...');
    const result = await sendEmailWithResend(testStudent, testMaterials, 'test@example.com');
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('❌ EMAIL FAILED!');
    console.log('🔍 Error details:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 TIPS:');
      console.log('- Check if your Resend API key is correct');
      console.log('- Make sure the API key starts with "re_"');
      console.log('- Verify your Resend account is active');
    }
    
    if (error.message.includes('domain')) {
      console.log('\n💡 DOMAIN TIPS:');
      console.log('- For testing, you can use any email in RESEND_FROM_EMAIL');
      console.log('- For production, you need to verify your domain in Resend');
      console.log('- Try using "onboarding@resend.dev" for testing');
    }
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. If successful, your Resend service is working!');
  console.log('2. Restart your backend server to use Resend');
  console.log('3. Test email delivery from your frontend');
  console.log('4. Check both inbox and spam folders');
}

// Run test
testResend().catch(console.error);
