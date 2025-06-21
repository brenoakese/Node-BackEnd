import express from 'express';
import TarefaController from '../controller/tarefaController.js';
import * as tarefaValidations from '../validations/tarefaValidations.js';
import authenticateToken from '../middleware/auth.js';
import { validationResult } from 'express-validator';

const router = express.Router();
const tarefaController = new TarefaController();

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

// POST /api/tarefas - Criar nova tarefa
router.post('/', 
  tarefaValidations.criarTarefa, 
  validate, 
  tarefaController.criarTarefa.bind(tarefaController)
);

// GET /api/tarefas - Buscar tarefas do usuário (logado ou por query param)
router.get('/', 
  tarefaController.getTarefas.bind(tarefaController)
);

// GET /api/tarefas/:id - Buscar tarefa por ID
router.get('/:id', 
  tarefaValidations.tarefaId, 
  validate, 
  tarefaController.buscarTarefaPorId.bind(tarefaController)
);

// PUT /api/tarefas/:id/status - Atualizar status da tarefa
router.put('/:id/status',
  tarefaValidations.atualizarStatusTarefa,
  validate,
  tarefaController.atualizarStatusTarefa.bind(tarefaController)
);

// DELETE /api/tarefas/:id - Deletar tarefa
router.delete('/:id', 
  tarefaValidations.tarefaId, 
  validate, 
  tarefaController.deletarTarefa.bind(tarefaController)
);

export default router; 