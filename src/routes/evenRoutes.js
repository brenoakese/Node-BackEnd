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

// GET /api/events - Buscar todos os eventos (lógica de família aplicada)
router.get('/events', 
  eventController.getAllEvents.bind(eventController)
);

// GET /api/events/:id - Buscar evento por ID
router.get('/events/:id', 
  eventValidations.eventId, 
  validate, 
  eventController.getEventById.bind(eventController)
);

// PUT /api/events/:id/status - Atualizar status do evento
router.put('/events/:id/status',
  eventValidations.eventId,
  validate,
  eventController.updateEventStatus.bind(eventController)
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