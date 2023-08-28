const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  // verify if email exist
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      msg: "user / password invalid/s",
    });
  }

  // if user is active
  if (!user.status) {
    return res.status(400).json({
      msg: "user / password invalid/s - status: false",
    });
  }

  // verify password
  const validPassword = bcryptjs.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      msg: "user / password invalid/s - password",
    });
  }

  // generate jwt
  const token = await generateJWT(user.id);

  try {
    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "speak with the administrator",
    });
  }
};

module.exports = { login };
