const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const prisma = new PrismaClient();

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
});

module.exports = async (req, res) => {
  const { email, password, name } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: 'Email taken' });

  const hash = await bcrypt.hash(password, 10);
  const code = crypto.randomInt(100000, 999999).toString();

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name: name || email.split('@')[0],
      isAdmin: email === 'pdigger48@gmail.com'
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { bio: code }
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'TikTok Next - Verify',
    text: `Code: ${code}`
  });

  res.json({ success: true });
};
