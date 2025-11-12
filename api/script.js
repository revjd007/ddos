const db = { users: {}, scripts: [] };

module.exports = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  const email = token.split('-')[2];
  if (!db.users[email]) return res.status(401).json({ error: 'Invalid token' });

  const { title, content, filename } = req.body;
  db.scripts.push({ title, content, filename, user: email.split('@')[0] });
  res.json({ success: true });
};
