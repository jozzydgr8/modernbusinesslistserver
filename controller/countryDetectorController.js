const axios = require('axios');
const getCountry = async (req, res) => {
  try {
    // Get client IP
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const response = await axios.get('https://ipinfo.io/json', {
      params: {
        token: process.env.IPINFO_TOKEN,
        ip: ip,
      },
    });

    const country = response.data.country?.toUpperCase() || null;

    return res.json({ country });
  } catch (error) {
    console.error('Country detection error:', error);
    return res.status(500).json(error.message);
  }
}

module.exports= {getCountry}