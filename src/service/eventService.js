import EventRepository from '../repository/eventRepository.js';
import UserRepository from '../repository/userRepository.js';
import Event from '../models/Event.js';

class EventService {
  constructor() {
    this.eventRepository = new EventRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * Verifica se o usuário é dependente baseado no papel_detalhado
   */
  _isDependente(user) {
    return ['filho', 'filha', 'neto', 'neta'].includes(user.papel_detalhado);
  }

  /**
   * Verifica se o usuário é responsável baseado no papel_detalhado
   */
  _isResponsavel(user) {
    return ['dono', 'pai', 'mae', 'avo', 'avó'].includes(user.papel_detalhado);
  }

  /**
   * Cria um evento.
   * Se o criador for responsável (dono, pai, mãe, etc.), pode criar para outros membros da família.
   * Se for dependente, NÃO pode criar eventos.
   */
  async createEvent(eventData, creatorUser) {
    // VALIDAÇÃO CRÍTICA: Dependentes NÃO podem criar eventos
    if (this._isDependente(creatorUser)) {
      throw new Error('Dependentes não podem criar eventos. Apenas responsáveis podem criar eventos.');
    }

    const destinatarioId = eventData.usuario_id || creatorUser.id;

    // Lógica de permissão para criação
    if (destinatarioId !== creatorUser.id) {
      if (!this._isResponsavel(creatorUser)) {
        throw new Error('Apenas responsáveis podem criar eventos para outros membros.');
      }
      // Valida se o destinatário pertence à mesma família
      const destinatario = await this.userRepository.findById(destinatarioId);
      if (!destinatario || destinatario.familia_id?.toString() !== creatorUser.familia_id?.toString()) {
        throw new Error('Destinatário inválido ou não pertence à sua família.');
      }
    }

    const event = new Event(
      undefined,
      eventData.titulo,
      eventData.data,
      eventData.hora,
      eventData.tipo,
      eventData.pessoa,
      eventData.descricao,
      destinatarioId,
      'pendente' // Status padrão
    );

    const validationErrors = event.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Dados inválidos: ${validationErrors.join(', ')}`);
    }

    return this.eventRepository.create(event);
  }

  /**
   * Busca eventos.
   * Se for responsável, vê todos os eventos da família.
   * Se for dependente, vê apenas os seus.
   */
  async getAllEvents(user) {
    if (this._isResponsavel(user) && user.familia_id) {
      return this.eventRepository.findAllByFamilyId(user.familia_id);
    }
    return this.eventRepository.findByUserId(user.id);
  }

  /**
   * Atualiza o status de um evento com regras de permissão.
   */
  async updateEventStatus(eventId, newStatus, user) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const eventOwner = await this.userRepository.findById(event.usuario_id);
    if (eventOwner.familia_id?.toString() !== user.familia_id?.toString()) {
      throw new Error('Acesso negado. O evento não pertence à sua família.');
    }

    switch (newStatus) {
      case 'concluido':
        if (event.status !== 'pendente') throw new Error('Apenas eventos pendentes podem ser concluídos.');
        if (event.usuario_id !== user.id) throw new Error('Você só pode concluir seus próprios eventos.');
        break;
      case 'verificado':
        if (event.status !== 'concluido') throw new Error('Apenas eventos concluídos podem ser verificados.');
        if (!this._isResponsavel(user)) throw new Error('Apenas responsáveis podem verificar eventos.');
        break;
      default:
        throw new Error(`Status inválido: ${newStatus}`);
    }

    return this.eventRepository.updateStatus(eventId, newStatus);
  }

  // Métodos antigos que podem precisar de revisão de permissão, mas mantidos por enquanto
  async getEventById(id, usuarioId) {
    return this.eventRepository.findByIdAndUser(id, usuarioId);
  }

  async updateEvent(id, eventData, usuarioId) {
    const existingEvent = await this.eventRepository.findByIdAndUser(id, usuarioId);
    if (!existingEvent) throw new Error('Evento não encontrado para este usuário.');
    return this.eventRepository.update(id, usuarioId, eventData);
  }

  async deleteEvent(id, usuarioId) {
    const existingEvent = await this.eventRepository.findByIdAndUser(id, usuarioId);
    if (!existingEvent) throw new Error('Evento não encontrado para este usuário.');
    return this.eventRepository.delete(id, usuarioId);
  }
}

export default EventService; 