const mux = require('@mux/mux-node');
const { Live } = new mux.Live({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET });
module.exports = async (req, res) => {
  const stream = await Live.Streams.create({
    playback_policy: 'public',
    new_asset_settings: { playback_policy: 'public' }
  });
  // Save to DB
  res.json({ rtmpUrl: stream.rtmp_url, streamKey: stream.stream_key });
};
