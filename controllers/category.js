const { request, response } = require("express");

const { Category } = require("../models");

const getCategories = async (req = request, res = response) => {
  const { limit = 0, from = 0 } = req.query;

  const [total, categories] = await Promise.all([
    Category.countDocuments({ status: true }),
    Category.find({ status: true })
      .limit(Number(limit))
      .skip(Number(from))
      .populate("user", "name"),
  ]);

  res.status(200).json({ total, categories });
};

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.find({ status: true, _id: id }).populate(
    "user",
    "name"
  );

  if (!category) {
    return res.status(400).json({ msg: `id ${id} not found` });
  }

  res.status(200).json({ category });
};

const postCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const dbCategory = await Category.findOne({ name });

  if (dbCategory) {
    return res.status(400).json({
      msg: `category ${dbCategory.name}, already exists`,
    });
  }

  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);
  await category.save();

  res.status(201).json(category);
};

const putCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const name = data.name;

  const dbCategory = await Category.findOne({ name });

  if (dbCategory) {
    return res.status(400).json({
      msg: `category ${dbCategory.name}, already exists`,
    });
  }

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.status(400).json({ category });
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json({ category });
};

module.exports = {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
};
