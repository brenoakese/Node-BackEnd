import { v4 as uuidv4 } from "uuid";
import moment from "moment";

class Event {
  id;
  titulo;
  data;
  hora;
  tipo;
  pessoa;
  descricao;
  usuarioId;
  status;
  createdAt;
  updatedAt;

  constructor(
    id,
    titulo,
    data,
    hora,
    tipo,
    pessoa,
    descricao,
    usuarioId,
    status = 'pendente',
    created_at,
    updated_at
  ) {
    this.id = id || uuidv4();
    this.titulo = titulo;
    this.data = data;
    this.hora = hora;
    this.tipo = tipo;
    this.pessoa = pessoa;
    this.descricao = descricao;
    this.usuarioId = usuarioId;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static fromDatabase(row) {
    return new Event(
      row.id,
      row.titulo,
      moment(row.data).format('DD/MM/YYYY'),
      moment(row.hora, 'HH:mm:ss').format('HH:mm'),
      row.tipo,
      row.pessoa,
      row.descricao,
      row.usuario_id,
      row.status,
      row.created_at,
      row.updated_at
    );
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
      data: this.data,
      hora: this.hora,
      tipo: this.tipo,
      pessoa: this.pessoa,
      descricao: this.descricao,
      usuario_id: this.usuarioId,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
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

  static parseDate(dateStr) {
    return moment(dateStr, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }

  static parseTime(timeStr) {
    return moment(timeStr, 'HH:mm').format('HH:mm:ss');
  }

  validate() {
    const errors = [];
    if (!this.titulo || this.titulo.length < 3) errors.push('Título deve ter pelo menos 3 caracteres.');
    if (!moment(this.data, 'DD/MM/YYYY', true).isValid()) errors.push('Data inválida. Use o formato DD/MM/YYYY.');
    if (!moment(this.hora, 'HH:mm', true).isValid()) errors.push('Hora inválida. Use o formato HH:mm.');
    return errors;
  }
}

export default Event;