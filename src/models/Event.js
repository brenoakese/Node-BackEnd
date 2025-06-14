import { v4 as uuidv4 } from "uuid";

class Event {
  id;
  titulo;
  data;
  hora;
  tipo;
  pessoa;
  descricao;
  usuarioId;
  createdAt;
  updatedAt;

  constructor(id = uuidv4(), titulo, data, hora, tipo, pessoa, descricao, usuarioId) {
    this.id = id;
    this.titulo = titulo;
    this.data = data;
    this.hora = hora;
    this.tipo = tipo;
    this.pessoa = pessoa;
    this.descricao = descricao;
    this.usuarioId = usuarioId;
  }

  static fromDatabase(row) {
    const event = new Event(
      row.id,
      row.titulo,
      row.data,
      row.hora,
      row.tipo,
      row.pessoa,
      row.descricao,
      row.usuario_id
    );
    
    event.createdAt = row.created_at;
    event.updatedAt = row.updated_at;
    
    return event;
  }

  toDatabase() {
    return {
      id: this.id,
      titulo: this.titulo,
      data: this.data,
      hora: this.hora,
      tipo: this.tipo,
      pessoa: this.pessoa,
      descricao: this.descricao,
      usuario_id: this.usuarioId
    };
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      data: this.formatDate(this.data),
      hora: this.formatTime(this.hora),
      tipo: this.tipo,
      pessoa: this.pessoa,
      descricao: this.descricao,
      usuarioId: this.usuarioId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  formatTime(time) {
    if (!time) return '';
    
    // Se time já for string no formato HH:MM, retorna como está
    if (typeof time === 'string' && time.includes(':')) {
      return time.substring(0, 5); // Garante formato HH:MM
    }
    
    // Se for objeto Date ou string ISO
    const t = new Date(`1970-01-01T${time}`);
    const hours = String(t.getHours()).padStart(2, '0');
    const minutes = String(t.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  static parseDate(dateString) {
    // Converte DD/MM/YYYY para YYYY-MM-DD
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  static parseTime(timeString) {
    // Garante formato HH:MM:SS para o banco
    if (timeString.length === 5) {
      return `${timeString}:00`;
    }
    return timeString;
  }

  validate() {
    const errors = [];

    if (!this.titulo || this.titulo.trim().length === 0) {
      errors.push('Título é obrigatório');
    }

    if (!this.data) {
      errors.push('Data é obrigatória');
    }

    if (!this.hora) {
      errors.push('Hora é obrigatória');
    }

    if (!this.tipo || !['medico', 'escola', 'outros'].includes(this.tipo)) {
      errors.push('Tipo deve ser: medico, escola ou outros');
    }

    if (!this.pessoa || this.pessoa.trim().length === 0) {
      errors.push('Pessoa é obrigatória');
    }

    if (!this.usuarioId) {
      errors.push('ID do usuário é obrigatório');
    }

    // Validar formato da data (DD/MM/YYYY)
    if (this.data) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(this.data)) {
        errors.push('Data deve estar no formato DD/MM/YYYY');
      } else {
        const [day, month, year] = this.data.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
          errors.push('Data inválida');
        }
        
        // Verificar se não é no passado
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
          errors.push('Não é possível criar eventos no passado');
        }
      }
    }

    // Validar formato da hora (HH:MM)
    if (this.hora) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(this.hora)) {
        errors.push('Hora deve estar no formato HH:MM (00:00 a 23:59)');
      }
    }

    return errors;
  }
}

export default Event;