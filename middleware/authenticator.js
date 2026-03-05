const jwt = require('jsonwebtoken');
const userModel = require('../Schema/userSchema');

const authenticator = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    const user = await userModel.findById(decoded._id).select('_id email admin');;

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }


    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticator;