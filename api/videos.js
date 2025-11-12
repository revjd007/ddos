const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Bad token' }); }
};

module.exports = [
  auth,
  async (req, res) => {
    if (req.method === 'GET') {
      const videos = await prisma.video.findMany({
        include: { user: { select: { name: true } } }
      });
      res.json(videos);
    } else if (req.method === 'POST') {
      const { title, url } = req.body;
      const video = await prisma.video.create({
        data: { title, url, userId: req.user.id }
      });
      res.json(video);
    }
  }
];
