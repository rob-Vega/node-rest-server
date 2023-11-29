const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateFile } = require("../middlewares");
const {
  loadFiles,
  updateImage,
  showImage,
  updateImageCloudinary,
} = require("../controllers/upload");
const { allowedCollections } = require("../helpers");

const router = Router();

router.post("/", validateFile, loadFiles);

router.put(
  "/:collection/:id",
  [
    validateFile,
    check("id", "must be a mongo id").isMongoId(),
    check("collection").custom((collection) =>
      allowedCollections(collection, ["users", "products"])
    ),
    validateFields,
  ],
  // updateImage
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "must be a mongo id").isMongoId(),
    check("collection").custom((collection) =>
      allowedCollections(collection, ["users", "products"])
    ),
    validateFields,
  ],
  showImage
);

module.exports = router;
