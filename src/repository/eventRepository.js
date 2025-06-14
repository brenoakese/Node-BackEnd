import db from '../config/db.js';
import Event from '../models/Event.js';

class EventRepository {
  
  async create(event) {
    try {
      console.log('📝 Criando evento no banco:', event.toDatabase());
      
      const eventData = event.toDatabase();
      const query = `
        INSERT INTO eventos (id, titulo, data, hora, tipo, pessoa, descricao, usuario_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const values = [
        eventData.id,
        eventData.titulo,
        Event.parseDate(event.data), // Converte DD/MM/YYYY para YYYY-MM-DD
        Event.parseTime(event.hora), // Garante formato HH:MM:SS
        eventData.tipo,
        eventData.pessoa,
        eventData.descricao,
        eventData.usuario_id
      ];

      const result = await db.query(query, values);
      
      console.log('✅ Evento criado com sucesso:', result.rows[0]);
      return Event.fromDatabase(result.rows[0]);
      
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error);
      throw error;
    }
  }

  async findByUserId(usuarioId) {
    try {
      console.log('🔍 Buscando eventos do usuário:', usuarioId);
      
      const query = `
        SELECT * FROM eventos 
        WHERE usuario_id = $1 
        ORDER BY data ASC, hora ASC
      `;
      
      const result = await db.query(query, [usuarioId]);
      
      console.log(`✅ ${result.rows.length} eventos encontrados`);
      return result.rows.map(row => Event.fromDatabase(row));
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos:', error);
      throw error;
    }
  }

  async findUpcomingByUserId(usuarioId) {
    try {
      console.log('📅 Buscando eventos futuros do usuário:', usuarioId);
      
      const query = `
        SELECT * FROM eventos 
        WHERE usuario_id = $1 AND data >= CURRENT_DATE
        ORDER BY data ASC, hora ASC
      `;
      
      const result = await db.query(query, [usuarioId]);
      
      console.log(`✅ ${result.rows.length} eventos futuros encontrados`);
      return result.rows.map(row => Event.fromDatabase(row));
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos futuros:', error);
      throw error;
    }
  }

  async findById(id, usuarioId) {
    try {
      console.log('🔍 Buscando evento por ID:', id, 'do usuário:', usuarioId);
      
      const query = `
        SELECT * FROM eventos 
        WHERE id = $1 AND usuario_id = $2
      `;
      
      const result = await db.query(query, [id, usuarioId]);
      
      if (result.rows.length === 0) {
        console.log('❌ Evento não encontrado');
        return null;
      }
      
      console.log('✅ Evento encontrado:', result.rows[0]);
      return Event.fromDatabase(result.rows[0]);
      
    } catch (error) {
      console.error('❌ Erro ao buscar evento por ID:', error);
      throw error;
    }
  }

  async update(id, usuarioId, eventData) {
    try {
      console.log('📝 Atualizando evento:', id, 'do usuário:', usuarioId);
      
      const query = `
        UPDATE eventos 
        SET titulo = $3, data = $4, hora = $5, tipo = $6, pessoa = $7, descricao = $8, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND usuario_id = $2
        RETURNING *
      `;
      
      const values = [
        id,
        usuarioId,
        eventData.titulo,
        Event.parseDate(eventData.data),
        Event.parseTime(eventData.hora),
        eventData.tipo,
        eventData.pessoa,
        eventData.descricao
      ];

      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        console.log('❌ Evento não encontrado para atualização');
        return null;
      }
      
      console.log('✅ Evento atualizado com sucesso:', result.rows[0]);
      return Event.fromDatabase(result.rows[0]);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar evento:', error);
      throw error;
    }
  }

  async delete(id, usuarioId) {
    try {
      console.log('🗑️ Deletando evento:', id, 'do usuário:', usuarioId);
      
      const query = `
        DELETE FROM eventos 
        WHERE id = $1 AND usuario_id = $2
        RETURNING *
      `;
      
      const result = await db.query(query, [id, usuarioId]);
      
      if (result.rows.length === 0) {
        console.log('❌ Evento não encontrado para exclusão');
        return false;
      }
      
      console.log('✅ Evento deletado com sucesso');
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao deletar evento:', error);
      throw error;
    }
  }

  async findByDateRange(usuarioId, startDate, endDate) {
    try {
      console.log('📅 Buscando eventos entre:', startDate, 'e', endDate);
      
      const query = `
        SELECT * FROM eventos 
        WHERE usuario_id = $1 AND data BETWEEN $2 AND $3
        ORDER BY data ASC, hora ASC
      `;
      
      const result = await db.query(query, [usuarioId, startDate, endDate]);
      
      console.log(`✅ ${result.rows.length} eventos encontrados no período`);
      return result.rows.map(row => Event.fromDatabase(row));
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos por período:', error);
      throw error;
    }
  }

  async findByType(usuarioId, tipo) {
    try {
      console.log('🏷️ Buscando eventos do tipo:', tipo, 'do usuário:', usuarioId);
      
      const query = `
        SELECT * FROM eventos 
        WHERE usuario_id = $1 AND tipo = $2
        ORDER BY data ASC, hora ASC
      `;
      
      const result = await db.query(query, [usuarioId, tipo]);
      
      console.log(`✅ ${result.rows.length} eventos do tipo ${tipo} encontrados`);
      return result.rows.map(row => Event.fromDatabase(row));
      
    } catch (error) {
      console.error('❌ Erro ao buscar eventos por tipo:', error);
      throw error;
    }
  }
}

export default EventRepository;