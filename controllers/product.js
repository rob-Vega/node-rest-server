const { request, response } = require("express");

const { Product } = require("../models");

const getProducts = async (req = request, res = response) => {
  const { limit = 0, from = 0 } = req.query;

  const [total, products] = await Promise.all([
    Product.countDocuments({ status: true }),
    Product.find({ status: true })
      .limit(Number(limit))
      .skip(Number(from))
      .populate("user", "name")
      .populate("category", "name"),
  ]);

  res.status(200).json({ total, products });
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  if (!product?.status) {
    return res.status(400).json({ msg: `product with id ${id} not found` });
  }

  res.status(200).json({ product });
};

const postProduct = async (req = request, res = response) => {
  const { price, description, category } = req.body;
  const name = req.body.name.toUpperCase();

  const dbProduct = await Product.findOne({ name });

  if (dbProduct) {
    return res.status(400).json({
      msg: `product ${product.name}, already exists`,
    });
  }

  const data = {
    name,
    price,
    description,
    user: req.user._id,
    category,
  };

  const product = new Product(data);
  await product.save();

  res.status(201).json(product);
};

const putProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, user, name, ...data } = req.body;
  data.user = req.user._id;

  if (name) {
    data.name = name.toUpperCase();
  }

  if (name) {
    const dbProduct = await Product.findOne({ name });

    if (dbProduct) {
      return res.status(400).json({
        msg: `product ${dbProduct.name}, already exists`,
      });
    }
  }

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.status(400).json({ product });
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json({ product });
};

module.exports = {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
};
