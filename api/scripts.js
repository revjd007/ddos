const db = { scripts: [] };

module.exports = (req, res) => {
  res.json(db.scripts);
};
