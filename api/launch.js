module.exports = async (req, res) => {
  const { target, duration, method } = req.body;
  const vps = 'http://YOUR-VPS-IP:3000/launch';   // ← CHANGE THIS
  try { await fetch(vps, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({target,duration,method})}); }
  catch(e) {}
  res.json({ status: `Queued ${method} → ${target} (${duration}s)` });
};