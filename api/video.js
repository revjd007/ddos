const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const multer = require('multer');  // npm i multer
const upload = multer({ dest: 'uploads/' });
const prisma = new PrismaClient();

const auth = (req, res, next) => { /* same */ };

module.exports = [
  upload.single('video'),
  auth,
  async (req, res) => {
    if (req.method === 'GET') {
      const videos = await prisma.video.findMany({
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' }
      });
      res.json(videos);
    } else if (req.method === 'POST') {
      const url = req.file ? `/uploads/${req.file.filename}` : req.body.url;
      const video = await prisma.video.create({
        data: { title: req.body.title, url, userId: req.user.id }
      });
      res.json(video);
    }
  }
];
