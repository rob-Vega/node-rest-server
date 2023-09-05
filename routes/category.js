const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, hasRole } = require("../middlewares");
const { categoryExistsById } = require("../helpers/db-validators");
const {
  getCategories,
  postCategory,
  getCategory,
  putCategory,
  deleteCategory,
} = require("../controllers/category");

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [check("id").isMongoId(), check("id").custom(categoryExistsById)],
  getCategory
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "name is required").notEmpty(),
    check("name", "name is required").notEmpty(),
    validateFields,
  ],
  postCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id").isMongoId(),
    check("id").custom(categoryExistsById),
    check("name").notEmpty(),
    validateFields,
  ],
  putCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id").custom(categoryExistsById),
    check("id").isMongoId(),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
