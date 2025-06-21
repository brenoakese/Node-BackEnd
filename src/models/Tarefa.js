import { v4 as uuidv4 } from "uuid";

class Tarefa {
  id;
  titulo;
  data_entrega;
  status;
  usuario_id;
  materia_id;
  created_at;
  updated_at;

  constructor(id = uuidv4(), titulo, data_entrega, status = 'pendente', usuario_id, materia_id, created_at = null, updated_at = null) {
    this.id = id;
    this.titulo = titulo;
    this.data_entrega = data_entrega;
    this.status = status;
    this.usuario_id = usuario_id;
    this.materia_id = materia_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método para validar se a tarefa é válida
  isValid() {
    return this.titulo && 
           this.titulo.trim().length > 0 && 
           this.titulo.trim().length <= 255 &&
           this.data_entrega &&
           this.usuario_id &&
           this.materia_id &&
           ['pendente', 'concluida'].includes(this.status);
  }

  // Método para normalizar os dados
  normalize() {
    if (this.titulo) {
      this.titulo = this.titulo.trim();
    }
    
    // Garantir que a data está no formato correto
    if (this.data_entrega) {
      // Se for string, converter para Date
      if (typeof this.data_entrega === 'string') {
        this.data_entrega = new Date(this.data_entrega);
      }
    }
  }

  // Método para marcar como concluída
  marcarConcluida() {
    this.status = 'concluida';
  }

  // Método para marcar como pendente
  marcarPendente() {
    this.status = 'pendente';
  }

  // Método para verificar se está vencida
  isVencida() {
    const hoje = new Date();
    const dataEntrega = new Date(this.data_entrega);
    return dataEntrega < hoje && this.status === 'pendente';
  }

  // Método para converter para objeto simples (para JSON)
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      data_entrega: this.data_entrega,
      status: this.status,
      usuario_id: this.usuario_id,
      materia_id: this.materia_id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default Tarefa; 