const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ msg: "no token in request" });
  }

  try {
    const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({ msg: "token not valid - user not on db" });
    }

    if (!user.status) {
      return res.status(401).json({ msg: "token not valid - status: false" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      msg: "token is not valid",
    });
  }
  next();
};

module.exports = { validateJWT };
