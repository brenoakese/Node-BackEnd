import express from 'express';
import UserController from '../controller/userController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();
const userController = new UserController();

// Middleware de autenticação aplicado a todas as rotas
router.use(authenticateToken);

// GET /api/users - Buscar todos os usuários
router.get('/users', userController.getUsers.bind(userController));

// GET /api/users/me - Buscar dados do usuário atual
router.get('/users/me', userController.getCurrentUser.bind(userController));

// GET /api/users/:id - Buscar usuário por ID
router.get('/users/:id', userController.getUserById.bind(userController));

// DELETE /api/users/:id - Deletar usuário por ID
router.delete('/users/:id', userController.deleteUser.bind(userController));

export default router;