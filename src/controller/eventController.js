import EventService from '../service/eventService.js';

class EventController {
  constructor() {
    this.eventService = new EventService();
  }

  async createEvent(req, res) {
    try {
      // Passa o objeto user inteiro (req.user) para o serviço
      const event = await this.eventService.createEvent(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        event: event.toJSON()
      });
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error);
      const statusCode = error.message.includes('Apenas responsáveis') ? 403 : 400;
      return res.status(statusCode).json({ success: false, error: error.message });
    }
  }

  async getAllEvents(req, res) {
    try {
      // Passa o objeto user inteiro
      const events = await this.eventService.getAllEvents(req.user);
      return res.status(200).json({
        success: true,
        events: events.map(event => {
          const jsonEvent = event.toJSON();
          // Adiciona o nome da pessoa ao JSON final se existir
          if (event.pessoa_nome) {
            jsonEvent.pessoa_nome = event.pessoa_nome;
          }
          return jsonEvent;
        }),
        total: events.length
      });
    } catch (error) {
      console.error('❌ Erro ao buscar eventos:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
    }
  }
  
  async updateEventStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, error: 'O novo status é obrigatório.' });
        }

        const updatedEvent = await this.eventService.updateEventStatus(id, status, req.user);
        
        return res.status(200).json({
            success: true,
            message: 'Status do evento atualizado com sucesso.',
            event: updatedEvent.toJSON()
        });

    } catch (error) {
        console.error('❌ Erro ao atualizar status do evento:', error);
        const statusCode = error.message.includes('Acesso negado') || error.message.includes('Apenas responsáveis') ? 403 : 404;
        return res.status(statusCode).json({ success: false, error: error.message });
    }
  }

  // Manter os outros métodos por enquanto, ciente de que podem precisar de revisão de permissão
  async getEventById(req, res) {
    try {
      const event = await this.eventService.getEventById(req.params.id, req.user.id);
      if (!event) return res.status(404).json({ success: false, error: 'Evento não encontrado' });
      return res.status(200).json({ success: true, event: event.toJSON() });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const event = await this.eventService.updateEvent(req.params.id, req.body, req.user.id);
      return res.status(200).json({ success: true, event: event.toJSON() });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async deleteEvent(req, res) {
    try {
      await this.eventService.deleteEvent(req.params.id, req.user.id);
      return res.status(200).json({ success: true, message: 'Evento deletado com sucesso' });
    } catch (error) {
      return res.status(404).json({ success: false, error: error.message });
    }
  }
}

export default EventController; 