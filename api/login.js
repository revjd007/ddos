const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.verified) return res.status(403).json({ error: 'Not verified' });
  if (user.banned) return res.status(403).json({ error: 'BANNED', reason: user.banReason || 'No reason' });
  if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ error: 'Wrong password' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ 
    token, 
    user: { 
      id: user.id, 
      name: user.name, 
      email, 
      isAdmin: user.isAdmin, 
      avatar: user.avatar 
    } 
  });
};
