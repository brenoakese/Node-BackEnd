import express from 'express';
import UserController from '../controllers/UserController';
import userValidations from '../validations/userValidations';
import { validationResult } from 'express-validator';

const router = express.Router();
const userController = new UserController();


const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};


router.post(
  '/', 
  validate(userValidations.createUser),
  userController.create
);

router.get('/', userController.findAll);
router.get('/:id', userController.findById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;