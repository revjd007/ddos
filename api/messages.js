const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const auth = (req, res, next) => { /* same as above */ };

module.exports = [
  auth,
  async (req, res) => {
    if (req.method === 'POST') {
      const { toId, content } = req.body;
      await prisma.message.create({
        data: { content, fromId: req.user.id, toId }
      });
      res.json({ success: true });
    } else if (req.method === 'GET') {
      const { toId } = req.query;
      const msgs = await prisma.message.findMany({
        where: { OR: [{ fromId: req.user.id, toId }, { fromId: toId, toId: req.user.id }] },
        include: { from: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'asc' }
      });
      res.json(msgs);
    }
  }
];
