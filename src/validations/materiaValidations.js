import { body, param } from 'express-validator';

// Validações para criação de matéria
export const criarMateria = [
  body('nome_materia')
    .trim()
    .notEmpty()
    .withMessage('Nome da matéria é obrigatório')
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome da matéria deve ter entre 1 e 100 caracteres'),
  
  body('usuario_id')
    .optional()
    .isUUID()
    .withMessage('ID do usuário deve ser um UUID válido')
];

// Validações para atualização de matéria
export const atualizarMateria = [
  param('id')
    .isUUID()
    .withMessage('ID da matéria deve ser um UUID válido'),
  
  body('nome_materia')
    .trim()
    .notEmpty()
    .withMessage('Nome da matéria é obrigatório')
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome da matéria deve ter entre 1 e 100 caracteres')
];

// Validações para busca de matéria por ID
export const materiaId = [
  param('id')
    .isUUID()
    .withMessage('ID da matéria deve ser um UUID válido')
];

// Validações para busca de matérias por usuário
export const usuarioId = [
  param('usuarioId')
    .isUUID()
    .withMessage('ID do usuário deve ser um UUID válido')
];

// Validações para criação de múltiplas matérias para dependente
export const criarMateriasParaDependente = [
  param('usuarioId')
    .isUUID()
    .withMessage('ID do usuário deve ser um UUID válido'),
  
  body('nomes_materias')
    .isArray({ min: 1 })
    .withMessage('Lista de matérias deve ser um array não vazio'),
  
  body('nomes_materias.*')
    .trim()
    .notEmpty()
    .withMessage('Nome da matéria é obrigatório')
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome da matéria deve ter entre 1 e 100 caracteres')
]; 