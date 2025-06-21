import express from 'express';
import MateriaController from '../controller/materiaController.js';
import * as materiaValidations from '../validations/materiaValidations.js';
import authenticateToken from '../middleware/auth.js';
import { validationResult } from 'express-validator';

const router = express.Router();
const materiaController = new MateriaController();

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      error: 'Dados inválidos',
      details: errors.array() 
    });
  }
  next();
};

// Middleware de autenticação aplicado a todas as rotas
router.use(authenticateToken);

// POST /api/materias - Criar nova matéria
router.post('/materias', 
  materiaValidations.criarMateria, 
  validate, 
  materiaController.criarMateria.bind(materiaController)
);

// GET /api/materias/me - Buscar matérias do usuário logado
router.get('/materias/me', 
  materiaController.buscarMinhasMaterias.bind(materiaController)
);

// GET /api/materias/usuario/:usuarioId - Buscar matérias de um usuário específico
router.get('/materias/usuario/:usuarioId', 
  materiaValidations.usuarioId, 
  validate, 
  materiaController.buscarMateriasPorUsuario.bind(materiaController)
);

// GET /api/materias/:id - Buscar matéria por ID
router.get('/materias/:id', 
  materiaValidations.materiaId, 
  validate, 
  materiaController.buscarMateriaPorId.bind(materiaController)
);

// PUT /api/materias/:id - Atualizar matéria
router.put('/materias/:id', 
  materiaValidations.atualizarMateria, 
  validate, 
  materiaController.atualizarMateria.bind(materiaController)
);

// DELETE /api/materias/:id - Deletar matéria
router.delete('/materias/:id', 
  materiaValidations.materiaId, 
  validate, 
  materiaController.deletarMateria.bind(materiaController)
);

// POST /api/materias/dependente/:usuarioId - Criar múltiplas matérias para um dependente
router.post('/materias/dependente/:usuarioId', 
  materiaValidations.criarMateriasParaDependente, 
  validate, 
  materiaController.criarMateriasParaDependente.bind(materiaController)
);

export default router; 