const axios = require("axios");
const Country = require('../Schema/countrySchema');
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

  const country = response.data.country?.toUpperCase() || "NG";

  let matchCountry = await Country.findOne({ iso: country });

  // If not found, fallback to NG from DB
  if (!matchCountry) {
    matchCountry = await Country.findOne({ iso: "NG" });
  }

  // Still not found? return null safely
  if (!matchCountry) {
    return res.json({ countryId: null });
  }

  return res.json({ countryId: matchCountry._id });



  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.status(500).json({error: "Failed to determine country" });
  }
};

module.exports = { getCountry };