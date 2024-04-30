const { PubSub } = require('@google-cloud/pubsub');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Initialize SendGrid with your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// Creates a client; assumes default credentials from the environment.
exports.sendFavoriteBooksEmail = async (message, context) => {
   try {
       // Decode the message
       const favoriteBooksData = JSON.parse(Buffer.from(message.data, 'base64').toString('utf-8'));
       console.log(`Sending email with favorite books for user: ${favoriteBooksData.email}`);
       
       // Check if titles property exists and is an array
       if (!Array.isArray(favoriteBooksData.titles)) {
           throw new Error('Titles data is not an array.');
       }
       
       // Construct the email message
       const email = {
           to: favoriteBooksData.email,
           from: process.env.SENDGRID_SENDER,
           subject: "Your Favorite Books",
           text: `Here are your favorite books:\n${favoriteBooksData.titles.join('\n')}`,
           html: `<p>Here are your favorite books:</p><ul>${favoriteBooksData.titles.map(book => `<li>${book}</li>`).join('')}</ul>`,
       };
       
       // Send the email
       await sgMail.send(email);
       console.log('Favorite books email sent successfully.');
   } catch (error) {
       console.error('Error sending favorite books email:', error);
       if (error.response) {
           console.error('SendGrid response error:', error.response.body);
       }
       // Return error to avoid retries
       throw error;
   }
};