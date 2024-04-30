require('dotenv').config();
const sgMail = require('@sendgrid/mail');


// Initialize SendGrid with your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendWelcome = (message, context) => {
  // Decode the message
  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');
  const user = JSON.parse(incomingMessage);

  const userName = user.user_name

  console.log(`New user registered: ${user.email_address}`);
  console.log(`New user name: ${userName}`);

  // Email message setup
  const email = {
    to: user.email_address, // User's email address
    from: process.env.SENDGRID_SENDER, // Verified SendGrid sender email
    subject: "Welcome to Book Finder!",
    text: "We're thrilled to have you on board and can't wait to get started.",
    html: 
        `<div>
        <h2>Hi, ${userName}!</h2>
        <p>Welcome to <strong>Book Finder</strong>! Embark on a journey through the vast realm of literature with us. Let's uncover hidden gems, explore timeless classics, and 
        dive into thrilling adventures between the pages. Whether you're seeking knowledge, inspiration, or pure escapism, our platform is your guide to discovering the perfect book for every mood and moment. Get ready to immerse yourself in the enchanting world of stories!</p>
        </div>`,
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