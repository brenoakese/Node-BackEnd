import express from "express";
import AuthController from "../controller/authController.js";
import authValidations from "../validations/authValidations.js";
import { validationResult } from "express-validator";

const router = express.Router();
const authController = new AuthController();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/auth/login",
  authValidations.login,
  validate,
  authController.login.bind(authController)
);

router.post(
  "/auth/register",
  authValidations.register,
  validate,
  authController.register.bind(authController)
);

export default router;
