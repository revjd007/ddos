const jwt = require('jsonwebtoken');
module.exports = async (req, res) => {
  // Find user, bcrypt.compare, if verified, jwt.sign({id: user.id})
  res.json({ token: 'jwt...' });
};
