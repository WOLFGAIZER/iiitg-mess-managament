const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMS = async (phoneNumber, message) => {
  // Implement your SMS service here (Twilio, AWS SNS, etc.)
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  // For development, just log the OTP
  return true;
};

module.exports = { generateOTP, sendSMS }; 