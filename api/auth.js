const db = { users: {}, scripts: [] };

module.exports = (req, res) => {
  const { email, pass } = req.body;
  if (!db.users[email]) {
    db.users[email] = { pass, scripts: [] };
    res.json({ token: 'fake-jwt-' + email });
  } else if (db.users[email].pass === pass) {
    res.json({ token: 'fake-jwt-' + email });
  } else {
    res.status(401).json({ error: 'Wrong password' });
  }
};
