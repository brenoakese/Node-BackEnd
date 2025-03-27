import express from 'express';
import AuthController from '../controllers/AuthController';
import authValidations from '../validations/authValidations';
import { validationResult } from 'express-validator';

const router = express.Router();
const authController = new AuthController();

router.post(
  '/login', 
  authValidations.login,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.login
);

router.post(
  '/register', 
  authValidations.register,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.register
);

router.post('/logout', authController.logout);

export default router;