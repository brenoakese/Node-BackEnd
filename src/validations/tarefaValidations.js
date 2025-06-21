import { body, param } from 'express-validator';

// Validações para criação de tarefa
export const criarTarefa = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('Título da tarefa é obrigatório')
    .isLength({ min: 1, max: 255 })
    .withMessage('Título da tarefa deve ter entre 1 e 255 caracteres'),
  
  body('data_entrega')
    .notEmpty()
    .withMessage('Data de entrega é obrigatória')
    .isISO8601()
    .withMessage('Data de entrega deve estar no formato ISO 8601 (YYYY-MM-DD)'),
  
  body('materia_id')
    .isUUID()
    .withMessage('ID da matéria deve ser um UUID válido')
];

// Validações para atualização de status da tarefa
export const atualizarStatusTarefa = [
  param('id')
    .isUUID()
    .withMessage('ID da tarefa deve ser um UUID válido'),
  
  body('status')
    .isIn(['pendente', 'concluida'])
    .withMessage('Status deve ser "pendente" ou "concluida"')
];

// Validações para busca de tarefa por ID
export const tarefaId = [
  param('id')
    .isUUID()
    .withMessage('ID da tarefa deve ser um UUID válido')
];

// Validações para atualização completa da tarefa
export const atualizarTarefa = [
  param('id')
    .isUUID()
    .withMessage('ID da tarefa deve ser um UUID válido'),
  
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('Título da tarefa é obrigatório')
    .isLength({ min: 1, max: 255 })
    .withMessage('Título da tarefa deve ter entre 1 e 255 caracteres'),
  
  body('data_entrega')
    .notEmpty()
    .withMessage('Data de entrega é obrigatória')
    .isISO8601()
    .withMessage('Data de entrega deve estar no formato ISO 8601 (YYYY-MM-DD)'),
  
  body('materia_id')
    .isUUID()
    .withMessage('ID da matéria deve ser um UUID válido')
]; 