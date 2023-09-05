const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, hasRole } = require("../middlewares");
const {
  productExistsById,
  categoryExistsById,
} = require("../helpers/db-validators");
const {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
} = require("../controllers/product");

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [check("id").isMongoId().custom(productExistsById)],
  getProduct
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "name is required").notEmpty(),
    check("price", "price is required").notEmpty(),
    check("description", "description is required").notEmpty(),
    check("available").isBoolean().optional(),
    check("category", "category id is required")
      .isMongoId()
      .custom(categoryExistsById),
    validateFields,
  ],
  postProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id").isMongoId("id not valid").custom(productExistsById),
    check("name", "name must not be empty").notEmpty().optional(),
    check("price").notEmpty().isNumeric().optional(),
    check("description", "name must not be empty").notEmpty().optional(),
    check("available").isBoolean().optional(),
    validateFields,
  ],
  putProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id").custom(productExistsById).isMongoId(),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
