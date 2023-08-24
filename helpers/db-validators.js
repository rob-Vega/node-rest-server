const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) {
    throw new Error(`${role} is not registered on db`);
  }
};

const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error(`${email} already exists`);
  }
};

const userExistById = async (id = "") => {
  const userExist = await User.findById(id);
  if (!userExist) {
    throw new Error(`id ${id} does not exists`);
  }
};

module.exports = {
  isRoleValid,
  emailExist,
  userExistById,
};
