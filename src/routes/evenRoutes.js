import express from 'express';
import EventController from '../controller/eventController.js';
import eventValidations from '../validations/eventValidations.js';
import authenticateToken from '../middleware/auth.js';
import { validationResult } from 'express-validator';

const router = express.Router();
const eventController = new EventController();

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

// POST /api/events - Criar novo evento
router.post('/events', 
  eventValidations.createEvent, 
  validate, 
  eventController.createEvent.bind(eventController)
);

// GET /api/events - Buscar todos os eventos do usuário
router.get('/events', 
  eventController.getAllEvents.bind(eventController)
);

// GET /api/events/upcoming - Buscar eventos futuros
router.get('/events/upcoming', 
  eventController.getUpcomingEvents.bind(eventController)
);

// GET /api/events/by-date-range - Buscar eventos por período
router.get('/events/by-date-range', 
  eventValidations.dateRange, 
  validate, 
  eventController.getEventsByDateRange.bind(eventController)
);

// GET /api/events/by-month - Buscar eventos por mês
router.get('/events/by-month', 
  eventValidations.monthQuery, 
  validate, 
  eventController.getEventsByMonth.bind(eventController)
);

// GET /api/events/by-type/:tipo - Buscar eventos por tipo
router.get('/events/by-type/:tipo', 
  eventController.getEventsByType.bind(eventController)
);

// GET /api/events/:id - Buscar evento por ID
router.get('/events/:id', 
  eventValidations.eventId, 
  validate, 
  eventController.getEventById.bind(eventController)
);

// PUT /api/events/:id - Atualizar evento
router.put('/events/:id', 
  eventValidations.eventId, 
  eventValidations.updateEvent, 
  validate, 
  eventController.updateEvent.bind(eventController)
);

// DELETE /api/events/:id - Deletar evento
router.delete('/events/:id', 
  eventValidations.eventId, 
  validate, 
  eventController.deleteEvent.bind(eventController)
);

export default router;