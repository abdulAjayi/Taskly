const jwt = require("jsonwebtoken");
const User = require("../model/users");
async function Auth(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.AUTH_SECRET_CODE);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("pls authenticate", { error: error.message });
  }
}
module.exports = Auth;
