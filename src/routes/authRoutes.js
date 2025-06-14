import express from "express";
import AuthController from "../controller/authController.js";
import authValidations from "../validations/authValidations.js";
import authenticateToken from "../middleware/auth.js";
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

// Rotas públicas (não requerem autenticação)
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

// Rotas protegidas (requerem autenticação)
router.post(
  "/auth/logout",
  authenticateToken,
  authController.logout.bind(authController)
);

router.get(
  "/auth/verify",
  authenticateToken,
  authController.verifyToken.bind(authController)
);

export default router;