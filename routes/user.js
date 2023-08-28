const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateFields,
  validateJWT,
  isAdmin,
  hasRole,
} = require("../middlewares");

const {
  isRoleValid,
  emailExist,
  userExistById,
} = require("../helpers/db-validators");
const {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch,
} = require("../controllers/user");

const router = Router();

router.get("/", usersGet);

router.post(
  "/",
  [
    check("name", "name is required").notEmpty(),
    check(
      "password",
      "Password is required and must have more than 6 characters"
    )
      .notEmpty()
      .isLength({ min: 6 }),
    check("email", "Email is not valid").isEmail(),
    check("email", "Email already exist").custom(emailExist),
    // check("role", "Role is not valid").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("role").custom(isRoleValid),
    validateFields,
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "id is not valid").isMongoId(),
    check("id").custom(userExistById),
    check("role").custom(isRoleValid),
    validateFields,
  ],
  usersPut
);

router.patch("/", usersPatch);

router.delete(
  "/:id",
  [
    validateJWT,
    // isAdmin,
    hasRole("ADMIN_ROLE", "SALES_ROLE"),
    check("id", "id is not valid").isMongoId(),
    check("id").custom(userExistById),
    validateFields,
  ],
  usersDelete
);

module.exports = router;
