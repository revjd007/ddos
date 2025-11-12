const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const prisma = new PrismaClient();
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS  // App password
  }
});

module.exports = async (req, res) => {
  const { email, pass } = req.body;
  const hashed = await require('bcrypt').hash(pass, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, verified: false } });
  const code = crypto.randomInt(100000, 999999).toString();
  await prisma.user.update({ where: { id: user.id }, data: { /* store code temporarily, e.g., in a field */ } }); // Add code field in schema if needed
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verify Email',
    text: `Your code: ${code}`
  });
  res.json({ codeSent: true, userId: user.id });
};
