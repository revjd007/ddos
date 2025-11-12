const mux = require('@mux/mux-node');
const { Video } = new mux.Video({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET });

module.exports = async (req, res) => {
  const formData = await req.formData(); // Vercel supports
  const file = formData.get('file');
  const asset = await Video.Assets.create({
    input: await file.arrayBuffer(),
    playback_policy: 'public'
  });
  res.json({ playbackId: asset.playback_ids[0].id });
};
