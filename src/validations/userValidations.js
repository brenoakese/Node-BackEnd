import { body, ExpressValidator } from "express-validator";

const userValidations = {
  createUser: [
    body("name")
      .notEmpty().withMessage("Name is required")
      .isString().withMessage("Name must be a string")
      .isLength({ max: 60 }).withMessage("Name exceeded the characters number"),

    body("email")
      .isEmail().withMessage("Invalid email format"),

    body("password")
      .isString()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
};

export default userValidations;
