require('dotenv').config();
const sgMail = require('@sendgrid/mail');


// Initialize SendGrid with your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendWelcome = (message, context) => {
  // Decode the message
  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');
  const user = JSON.parse(incomingMessage);

  console.log(`New user registered: ${user.email_address}`);

  // Email message setup
  const email = {
    to: user.email_address, // User's email address
    from: process.env.SENDGRID_SENDER, // Verified SendGrid sender email
    subject: "Welcome to our platform!",
    text: "We're thrilled to have you on board and can't wait to get started.",
    html: "<strong>We're thrilled to have you on board and can't wait to get started.</strong>",
  };

  // Send the email
  return sgMail
    .send(email)
    .then(() => {
      console.log('Welcome email sent successfully to:', user.email_address);
      return null; // Return null to signal successful execution to Google Cloud
    })
    .catch(error => {
      console.error('Error sending welcome email:', error);
      if (error.response) {
        // Log the full error response from SendGrid
        console.error('SendGrid response error:', error.response.body);
      }
      // We return null even in case of error to avoid retrying; adjust if retries are desired
      return null;
    });
};