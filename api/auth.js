module.exports = (req, res) => {
  res.json({ token: 'fake-jwt-' + req.body.email });
};
