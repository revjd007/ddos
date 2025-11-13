const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Bad token' }); }
};

module.exports = [
  auth,
  async (req, res) => {
    if (req.method === 'GET') {
      const { query } = req.query;
      const users = await prisma.user.findMany({
        where: { name: { contains: query || '', mode: 'insensitive' }, verified: true, banned: false },
        select: { id: true, name: true, email: true, avatar: true }
      });
      res.json(users);
    } else if (req.method === 'POST') {  // Ban
      if (!req.user.isAdmin) return res.status(403).json({ error: 'Not admin' });
      const { targetId, reason } = req.body;
      await prisma.user.update({ where: { id: targetId }, data: { banned: true, banReason: reason } });
      res.json({ success: true });
    }
  }
];
