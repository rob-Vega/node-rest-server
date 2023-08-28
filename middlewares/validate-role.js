const { request, response } = require("express");

const isAdmin = (req = request, res = response, next) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ msg: "is necessary to validate token first" });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not admin`,
    });
  }

  req.user;

  next();
};

const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(500)
        .json({ msg: "is necessary to validate token first" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ msg: `the services require one of this roles ${roles}` });
    }

    next();
  };
};

module.exports = {
  isAdmin,
  hasRole,
};
