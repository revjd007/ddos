const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  const { email, code } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user.bio !== code) return res.status(400).json({ error: 'Invalid' });
  await prisma.user.update({ where: { id: user.id }, data: { verified: true, bio: '' } });
  res.json({ success: true });
};
