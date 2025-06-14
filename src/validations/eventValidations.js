import { body, param, query } from 'express-validator';

const eventValidations = {
  // Validações para criar evento
  createEvent: [
    body('titulo')
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 3, max: 100 })
      .withMessage('Título deve ter entre 3 e 100 caracteres')
      .trim(),
    
    body('data')
      .notEmpty()
      .withMessage('Data é obrigatória')
      .matches(/^\d{2}\/\d{2}\/\d{4}$/)
      .withMessage('Data deve estar no formato DD/MM/AAAA')
      .custom((value) => {
        const [dia, mes, ano] = value.split('/').map(Number);
        const data = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        // Verificar se a data é válida
        if (data.getDate() !== dia || data.getMonth() !== mes - 1 || data.getFullYear() !== ano) {
          throw new Error('Data inválida');
        }
        
        // Verificar se não é no passado
        if (data < hoje) {
          throw new Error('Não é possível criar eventos no passado');
        }
        
        return true;
      }),
    
    body('hora')
      .notEmpty()
      .withMessage('Hora é obrigatória')
      .matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('Hora deve estar no formato HH:MM (00:00 a 23:59)'),
    
    body('tipo')
      .isIn(['medico', 'escola', 'outros'])
      .withMessage('Tipo deve ser: medico, escola ou outros'),
    
    body('pessoa')
      .notEmpty()
      .withMessage('Pessoa é obrigatória')
      .isLength({ min: 2, max: 50 })
      .withMessage('Nome da pessoa deve ter entre 2 e 50 caracteres')
      .trim(),
    
    body('descricao')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Descrição deve ter no máximo 500 caracteres')
      .trim()
  ],
  
  // Validações para atualizar evento
  updateEvent: [
    body('titulo')
      .optional()
      .isLength({ min: 3, max: 100 })
      .withMessage('Título deve ter entre 3 e 100 caracteres')
      .trim(),
    
    body('data')
      .optional()
      .matches(/^\d{2}\/\d{2}\/\d{4}$/)
      .withMessage('Data deve estar no formato DD/MM/AAAA')
      .custom((value) => {
        if (!value) return true; // Campo opcional
        
        const [dia, mes, ano] = value.split('/').map(Number);
        const data = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        // Verificar se a data é válida
        if (data.getDate() !== dia || data.getMonth() !== mes - 1 || data.getFullYear() !== ano) {
          throw new Error('Data inválida');
        }
        
        // Verificar se não é no passado
        if (data < hoje) {
          throw new Error('Não é possível atualizar para uma data no passado');
        }
        
        return true;
      }),
    
    body('hora')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('Hora deve estar no formato HH:MM (00:00 a 23:59)'),
    
    body('tipo')
      .optional()
      .isIn(['medico', 'escola', 'outros'])
      .withMessage('Tipo deve ser: medico, escola ou outros'),
    
    body('pessoa')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Nome da pessoa deve ter entre 2 e 50 caracteres')
      .trim(),
    
    body('descricao')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Descrição deve ter no máximo 500 caracteres')
      .trim()
  ],
  
  // Validação para ID do evento
  eventId: [
    param('id')
      .isUUID()
      .withMessage('ID do evento deve ser um UUID válido')
  ],
  
  // Validações para busca por período
  dateRange: [
    query('startDate')
      .notEmpty()
      .withMessage('Data inicial é obrigatória')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Data inicial deve estar no formato AAAA-MM-DD')
      .isISO8601()
      .withMessage('Data inicial deve ser uma data válida'),
    
    query('endDate')
      .notEmpty()
      .withMessage('Data final é obrigatória')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Data final deve estar no formato AAAA-MM-DD')
      .isISO8601()
      .withMessage('Data final deve ser uma data válida')
      .custom((endDate, { req }) => {
        if (new Date(endDate) < new Date(req.query.startDate)) {
          throw new Error('Data final deve ser posterior à data inicial');
        }
        return true;
      })
  ],
  
  // Validações para busca por mês
  monthQuery: [
    query('year')
      .notEmpty()
      .withMessage('Ano é obrigatório')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Ano deve ser um número entre 2000 e 2100'),
    
    query('month')
      .notEmpty()
      .withMessage('Mês é obrigatório')
      .isInt({ min: 1, max: 12 })
      .withMessage('Mês deve ser um número entre 1 e 12')
  ]
};

export default eventValidations;