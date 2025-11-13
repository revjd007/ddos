const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.verified || user.banned || !await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ error: 'Invalid' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email, isAdmin: user.isAdmin, avatar: user.avatar } });
};
