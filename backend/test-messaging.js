/**
 * Test script for messaging services
 * Run with: node test-messaging.js
 */

require('dotenv').config();
const { sendEmailWithNodemailer, sendEmailDevelopment } = require('./lib/nodemailerService');
const { sendWhatsAppWithGreenAPI, sendWhatsAppDevelopment } = require('./lib/whatsappService');

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

async function testEmailServices() {
  console.log('\n🧪 TESTING EMAIL SERVICES...\n');

  // Test Nodemailer
  try {
    console.log('📧 Testing Nodemailer...');
    const result = await sendEmailWithNodemailer(testStudent, testMaterials, 'test@example.com');
    console.log('✅ Nodemailer Result:', result.details.message);
  } catch (error) {
    console.log('❌ Nodemailer Error:', error.message);
  }

  // Test Development Email
  try {
    console.log('\n📧 Testing Development Email...');
    const result = await sendEmailDevelopment(testStudent, testMaterials, 'test@example.com');
    console.log('✅ Development Email Result:', result.details.message);
  } catch (error) {
    console.log('❌ Development Email Error:', error.message);
  }
}

async function testWhatsAppServices() {
  console.log('\n🧪 TESTING WHATSAPP SERVICES...\n');

  // Test Green API
  try {
    console.log('📱 Testing Green API...');
    const result = await sendWhatsAppWithGreenAPI(testStudent, testMaterials, '+1234567890');
    console.log('✅ Green API Result:', result.details.message);
  } catch (error) {
    console.log('❌ Green API Error:', error.message);
  }

  // Test Development WhatsApp
  try {
    console.log('\n📱 Testing Development WhatsApp...');
    const result = await sendWhatsAppDevelopment(testStudent, testMaterials, '+1234567890');
    console.log('✅ Development WhatsApp Result:', result.details.message);
  } catch (error) {
    console.log('❌ Development WhatsApp Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 MESSAGING SERVICES TEST SUITE');
  console.log('================================');
  
  await testEmailServices();
  await testWhatsAppServices();
  
  console.log('\n✨ TEST COMPLETED!');
  console.log('\n💡 TIPS:');
  console.log('- Configure your .env file to test real services');
  console.log('- Check EMAIL_SETUP_GUIDE.md for Gmail setup');
  console.log('- Check MESSAGING_ALTERNATIVES.md for all options');
}

// Run tests
runTests().catch(console.error);
