const { Category, Product } = require("../models");
const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) {
    throw new Error(`${role} is not registered on db`);
  }
};

const emailExists = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error(`${email} already exists`);
  }
};

const userExistsById = async (id = "") => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`id ${id} does not exists`);
  }
};

const categoryExistsById = async (id = "") => {
  const categoryExists = await Category.findById(id);
  if (!categoryExists) {
    throw new Error(`id ${id} does not exists`);
  }
};

const productExistsById = async (id = "") => {
  const productsExists = await Product.findById(id);
  if (!productsExists) {
    throw new Error(`id ${id} does not exists`);
  }
};

module.exports = {
  isRoleValid,
  emailExists,
  userExistsById,
  categoryExistsById,
  productExistsById,
};
