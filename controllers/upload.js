const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { uploadFiles } = require("../helpers");

const { User, Product } = require("../models");

const loadFiles = async (req = request, res = response) => {
  try {
    const fileName = await uploadFiles(req.files);
    return res.json({ fileName });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `there is not user with id ${id}` });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `there is not product with id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "need to be added" });
  }

  try {
    if (model.image) {
      console.log(model.image);
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    }
  } catch (error) {
    console.error(error);
  }

  model.image = await uploadFiles(req.files, undefined, collection);
  await model.save();

  res.json(model);
};

const updateImageCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `there is not user with id ${id}` });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `there is not product with id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "need to be added" });
  }

  try {
    if (model.image) {
      const nameArr = model.image.split("/");
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split(".");
      cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    console.error(error);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.image = secure_url;

  await model.save();

  res.json(model);
};

const showImage = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `there is not user with id ${id}` });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `there is not product with id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "need to be added" });
  }

  try {
    if (model.image) {
      console.log(model.image);
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );
      if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
      }
    }
  } catch (error) {
    console.error(error);
  }

  const noImagePath = path.join(__dirname, "../assets/no-image.jpg");

  res.sendFile(noImagePath);
};

module.exports = {
  loadFiles,
  updateImage,
  updateImageCloudinary,
  showImage,
};
