import { v4 as uuidv4 } from "uuid";

class Materia {
  id;
  nome_materia;
  usuario_id;
  created_at;
  updated_at;

  constructor(id = uuidv4(), nome_materia, usuario_id, created_at = null, updated_at = null) {
    this.id = id;
    this.nome_materia = nome_materia;
    this.usuario_id = usuario_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método para validar se a matéria é válida
  isValid() {
    return this.nome_materia && 
           this.nome_materia.trim().length > 0 && 
           this.nome_materia.trim().length <= 100 &&
           this.usuario_id;
  }

  // Método para normalizar o nome da matéria
  normalizeName() {
    if (this.nome_materia) {
      this.nome_materia = this.nome_materia.trim();
    }
  }

  // Método para converter para objeto simples (para JSON)
  toJSON() {
    return {
      id: this.id,
      nome_materia: this.nome_materia,
      usuario_id: this.usuario_id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default Materia; 