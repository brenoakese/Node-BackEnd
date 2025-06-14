import EventRepository from '../repository/eventRepository.js';
import Event from '../models/Event.js';

class EventService {
  constructor() {
    this.eventRepository = new EventRepository();
  }

  async createEvent(eventData, usuarioId) {
    try {
      console.log('🎯 Criando novo evento para usuário:', usuarioId);
      
      // Criar instância do evento
      const event = new Event(
        undefined, // ID será gerado automaticamente
        eventData.titulo,
        eventData.data,
        eventData.hora,
        eventData.tipo,
        eventData.pessoa,
        eventData.descricao,
        usuarioId
      );

      // Validar dados do evento
      const validationErrors = event.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Dados inválidos: ${validationErrors.join(', ')}`);
      }

      // Salvar no banco
      const savedEvent = await this.eventRepository.create(event);
      
      console.log('✅ Evento criado com sucesso');
      return savedEvent;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao criar evento:', error);
      throw error;
    }
  }

  async getAllEvents(usuarioId) {
    try {
      console.log('📋 Buscando todos os eventos do usuário:', usuarioId);
      
      const events = await this.eventRepository.findByUserId(usuarioId);
      
      console.log(`✅ ${events.length} eventos encontrados`);
      return events;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao buscar eventos:', error);
      throw error;
    }
  }

  async getUpcomingEvents(usuarioId) {
    try {
      console.log('📅 Buscando eventos futuros do usuário:', usuarioId);
      
      const events = await this.eventRepository.findUpcomingByUserId(usuarioId);
      
      console.log(`✅ ${events.length} eventos futuros encontrados`);
      return events;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao buscar eventos futuros:', error);
      throw error;
    }
  }

  async getEventById(id, usuarioId) {
    try {
      console.log('🔍 Buscando evento por ID:', id);
      
      const event = await this.eventRepository.findById(id, usuarioId);
      
      if (!event) {
        throw new Error('Evento não encontrado');
      }
      
      console.log('✅ Evento encontrado');
      return event;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao buscar evento por ID:', error);
      throw error;
    }
  }

  async updateEvent(id, eventData, usuarioId) {
    try {
      console.log('📝 Atualizando evento:', id);
      
      // Verificar se evento existe
      const existingEvent = await this.eventRepository.findById(id, usuarioId);
      if (!existingEvent) {
        throw new Error('Evento não encontrado');
      }

      // Criar instância temporária para validação
      const tempEvent = new Event(
        id,
        eventData.titulo,
        eventData.data,
        eventData.hora,
        eventData.tipo,
        eventData.pessoa,
        eventData.descricao,
        usuarioId
      );

      // Validar dados
      const validationErrors = tempEvent.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Dados inválidos: ${validationErrors.join(', ')}`);
      }

      // Atualizar no banco
      const updatedEvent = await this.eventRepository.update(id, usuarioId, eventData);
      
      if (!updatedEvent) {
        throw new Error('Erro ao atualizar evento');
      }
      
      console.log('✅ Evento atualizado com sucesso');
      return updatedEvent;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao atualizar evento:', error);
      throw error;
    }
  }

  async deleteEvent(id, usuarioId) {
    try {
      console.log('🗑️ Deletando evento:', id);
      
      // Verificar se evento existe
      const existingEvent = await this.eventRepository.findById(id, usuarioId);
      if (!existingEvent) {
        throw new Error('Evento não encontrado');
      }

      // Deletar do banco
      const deleted = await this.eventRepository.delete(id, usuarioId);
      
      if (!deleted) {
        throw new Error('Erro ao deletar evento');
      }
      
      console.log('✅ Evento deletado com sucesso');
      return true;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao deletar evento:', error);
      throw error;
    }
  }

  async getEventsByDateRange(usuarioId, startDate, endDate) {
    try {
      console.log('📅 Buscando eventos entre:', startDate, 'e', endDate);
      
      const events = await this.eventRepository.findByDateRange(usuarioId, startDate, endDate);
      
      console.log(`✅ ${events.length} eventos encontrados no período`);
      return events;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao buscar eventos por período:', error);
      throw error;
    }
  }

  async getEventsByType(usuarioId, tipo) {
    try {
      console.log('🏷️ Buscando eventos do tipo:', tipo);
      
      if (!['medico', 'escola', 'outros'].includes(tipo)) {
        throw new Error('Tipo inválido. Use: medico, escola ou outros');
      }
      
      const events = await this.eventRepository.findByType(usuarioId, tipo);
      
      console.log(`✅ ${events.length} eventos do tipo ${tipo} encontrados`);
      return events;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao buscar eventos por tipo:', error);
      throw error;
    }
  }

  async getEventStats(usuarioId) {
    try {
      console.log('📊 Gerando estatísticas de eventos para usuário:', usuarioId);
      
      const allEvents = await this.eventRepository.findByUserId(usuarioId);
      const upcomingEvents = await this.eventRepository.findUpcomingByUserId(usuarioId);
      
      const stats = {
        total: allEvents.length,
        upcoming: upcomingEvents.length,
        past: allEvents.length - upcomingEvents.length,
        byType: {
          medico: allEvents.filter(e => e.tipo === 'medico').length,
          escola: allEvents.filter(e => e.tipo === 'escola').length,
          outros: allEvents.filter(e => e.tipo === 'outros').length
        }
      };
      
      console.log('✅ Estatísticas geradas:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Erro no serviço ao gerar estatísticas:', error);
      throw error;
    }
  }
}

export default EventService;