const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, hasRole } = require("../middlewares");
const {
  isRoleValid,
  emailExists,
  userExistsById,
} = require("../helpers/db-validators");
const {
  getUsers,
  postUser,
  putUser,
  patchUser,
  deleteUser,
} = require("../controllers/user");

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("name", "name is required").notEmpty(),
    check(
      "password",
      "password is required and must have more than 6 characters"
    )
      .notEmpty()
      .isLength({ min: 6 }),
    check("email", "email is not valid").isEmail(),
    check("email", "email already exist").custom(emailExists),
    check("role").custom(isRoleValid),
    validateFields,
  ],
  postUser
);

router.put(
  "/:id",
  [
    check("id", "id is not valid").isMongoId(),
    check("id").custom(userExistsById),
    check("role").custom(isRoleValid),
    validateFields,
  ],
  putUser
);

router.patch("/", patchUser);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE", "SALES_ROLE"),
    check("id", "id is not valid").isMongoId(),
    check("id").custom(userExistsById),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
