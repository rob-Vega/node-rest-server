const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Category, Product } = require("../models");

const permitedCollections = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({ results: user ? [user] : [] });
  }

  const regex = new RegExp(term, "i");

  const users = await User.find({ name: regex, stattus: true });
  res.json({ results: users });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const categories = await Category.findById(term).populate(
      "category",
      "name"
    );
    return res.json({ results: categories ? [categories] : [] });
  }

  const regex = new RegExp(term, "i");

  const categories = await Category.find({
    $or: [{ name: regex }, { description: regex }],
    $and: [{ status: true }],
  });
  res.json({ results: categories });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const products = await Product.findById(term);
    return res.json({ results: products ? [products] : [] });
  }

  const regex = new RegExp(term, "i");

  const products = await Product.find({
    $or: [{ name: regex }, { description: regex }],
    $and: [{ status: true }],
  }).populate("category", "name");

  res.json({ results: products });
};

const search = (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!permitedCollections.includes(collection)) {
    return res
      .status(400)
      .json({ msg: `permited collections ${permitedCollections}` });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({ msg: "there is not route" });
  }
};

module.exports = { search };
