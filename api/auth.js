module.exports = (req, res) => {
  res.json({ token: 'hub-jwt-' + req.body.email });
};
