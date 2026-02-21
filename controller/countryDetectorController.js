const axios = require("axios");

const getCountry = async (req, res) => {
  try {
    const forwarded = req.headers["x-forwarded-for"];

      let ip = forwarded
        ? forwarded.split(",")[0].trim()
        : req.socket.remoteAddress;

      if (!ip) {
        return res.json({ country: null });
      }

      if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
      }

      if (ip === "127.0.0.1" || ip === "::1") {
        return res.json({ country: "NG" }); // for local testing
      }

      const response = await axios.get(
        `https://ipinfo.io/${ip}/json`,
        {
          params: { token: process.env.IPINFO_TOKEN }
        }
      );

    const country = response.data.country?.toUpperCase() || null;

    return res.json({ country });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getCountry };