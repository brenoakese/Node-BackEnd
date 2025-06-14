import EventService from '../service/eventService.js';

class EventController {
  constructor() {
    this.eventService = new EventService();
  }

  async createEvent(req, res) {
    try {
      const usuarioId = req.user.id;
      const eventData = req.body;
      
      console.log('📝 Criando novo evento para usuário:', usuarioId);
      console.log('📋 Dados do evento:', eventData);
      
      const event = await this.eventService.createEvent(eventData, usuarioId);
      
      return res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        event: event.toJSON()
      });
      
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error);
      
      if (error.message.includes('Dados inválidos')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao criar evento',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getAllEvents(req, res) {
    try {
      const usuarioId = req.user.id;
      
      console.log('📋 Buscando todos os eventos do usuário:', usuarioId);
      
      const events = await this.eventService.getAllEvents(usuarioId);
      
      return res.status(200).json({
        success: true,
        message: 'Eventos encontrados com sucesso',
        events: events.map(event => event.toJSON()),
        total: events.length
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar eventos',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getUpcomingEvents(req, res) {
    try {
      const usuarioId = req.user.id;
      
      console.log('📅 Buscando eventos futuros do usuário:', usuarioId);
      
      const events = await this.eventService.getUpcomingEvents(usuarioId);
      
      return res.status(200).json({
        success: true,
        message: 'Eventos futuros encontrados com sucesso',
        events: events.map(event => event.toJSON()),
        total: events.length
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos futuros:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar eventos futuros',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;
      
      console.log('🔍 Buscando evento por ID:', id);
      
      const event = await this.eventService.getEventById(id, usuarioId);
      
      return res.status(200).json({
        success: true,
        message: 'Evento encontrado com sucesso',
        event: event.toJSON()
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar evento por ID:', error);
      
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar evento',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;
      const eventData = req.body;
      
      console.log('📝 Atualizando evento:', id);
      console.log('📋 Novos dados:', eventData);
      
      const event = await this.eventService.updateEvent(id, eventData, usuarioId);
      
      return res.status(200).json({
        success: true,
        message: 'Evento atualizado com sucesso',
        event: event.toJSON()
      });
      
    } catch (error) {
      console.error('❌ Erro ao atualizar evento:', error);
      
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }
      
      if (error.message.includes('Dados inválidos')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao atualizar evento',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;
      
      console.log('🗑️ Deletando evento:', id);
      
      await this.eventService.deleteEvent(id, usuarioId);
      
      return res.status(200).json({
        success: true,
        message: 'Evento deletado com sucesso'
      });
      
    } catch (error) {
      console.error('❌ Erro ao deletar evento:', error);
      
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao deletar evento',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getEventsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const usuarioId = req.user.id;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate e endDate são obrigatórios'
        });
      }
      
      console.log('📅 Buscando eventos por período:', { startDate, endDate, usuarioId });
      
      const events = await this.eventService.getEventsByDateRange(startDate, endDate, usuarioId);
      
      return res.status(200).json({
        success: true,
        message: 'Eventos encontrados no período especificado',
        events: events.map(event => event.toJSON()),
        total: events.length,
        period: { startDate, endDate }
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos por período:', error);
      
      if (error.message.includes('Data inválida')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar eventos por período',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getEventsByMonth(req, res) {
    try {
      const { year, month } = req.query;
      const usuarioId = req.user.id;
      
      if (!year || !month) {
        return res.status(400).json({
          success: false,
          error: 'year e month são obrigatórios'
        });
      }
      
      console.log('📅 Buscando eventos do mês:', { year, month, usuarioId });
      
      const events = await this.eventService.getEventsByMonth(year, month, usuarioId);
      
      return res.status(200).json({
        success: true,
        message: 'Eventos do mês encontrados com sucesso',
        events: events.map(event => event.toJSON()),
        total: events.length,
        period: { year, month }
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos do mês:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar eventos do mês',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getEventsByType(req, res) {
    try {
      const { tipo } = req.params;
      const usuarioId = req.user.id;
      
      const tiposValidos = ['medico', 'escola', 'outros'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
          success: false,
          error: `Tipo inválido. Tipos válidos: ${tiposValidos.join(', ')}`
        });
      }
      
      console.log('🏷️ Buscando eventos por tipo:', { tipo, usuarioId });
      
      const events = await this.eventService.getEventsByType(tipo, usuarioId);
      
      return res.status(200).json({
        success: true,
        message: `Eventos do tipo "${tipo}" encontrados com sucesso`,
        events: events.map(event => event.toJSON()),
        total: events.length,
        tipo
      });
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos por tipo:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar eventos por tipo',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default EventController;