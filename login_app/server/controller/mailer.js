import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';

/** POST: http://localhost:8080/api/registerMail */
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  if (!username || !userEmail) {
    return res.status(400).send({ error: 'Username and email are required.' });
  }

  if (!ENV.EMAIL || !ENV.PASSWORD) {
    return res.status(500).send({ error: 'Mail service credentials not configured.' });
  }

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // for testing with Ethereal
    auth: {
      user: ENV.EMAIL,
      pass: ENV.PASSWORD,
    },
  });

  let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Login App',
      link: 'https://mailgen.js/',
    },
  });

  let email = {
    body: {
      name: username,
      intro: text || 'Welcome to the Login App!',
      outro: 'Need help? Just reply to this email.',
    },
  };

  let emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || 'Signup Successful',
    html: emailBody,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent successfully!');
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));

    return res.status(200).send({ msg: 'You should receive an email from us.' });
  } catch (error) {
    console.error('❌ Mail error:', error);
    return res.status(500).send({ error: 'Email could not be sent.' });
  }
};
