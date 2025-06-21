import db from "../config/db.js";
import Materia from "../models/Materia.js";

class MateriaRepository {
  constructor() {
    this.db = db;
  }

  async create(materia) {
    try {
      const { rows } = await this.db.query(
        "INSERT INTO public.materias (nome_materia, usuario_id) VALUES ($1, $2) RETURNING *",
        [materia.nome_materia, materia.usuario_id]
      );

      return new Materia(
        rows[0].id,
        rows[0].nome_materia,
        rows[0].usuario_id,
        rows[0].created_at,
        rows[0].updated_at
      );
    } catch (error) {
      console.error("Error creating materia:", error);
      
      // Capturar erro de violação de constraint única (PostgreSQL)
      if (error.code === '23505') {
        throw new Error('Já existe uma matéria com este nome para este usuário');
      }
      
      // Capturar outros erros de constraint
      if (error.code === '23503') {
        throw new Error('Usuário não encontrado');
      }
      
      throw new Error("Erro ao criar matéria");
    }
  }

  async findById(id) {
    try {
      const { rows } = await this.db.query(
        "SELECT * FROM public.materias WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new Materia(
        row.id,
        row.nome_materia,
        row.usuario_id,
        row.created_at,
        row.updated_at
      );
    } catch (error) {
      console.error("Error finding materia by id:", error);
      throw new Error("Error finding materia by id");
    }
  }

  async findByUsuarioId(usuarioId) {
    try {
      const { rows } = await this.db.query(
        "SELECT * FROM public.materias WHERE usuario_id = $1 ORDER BY nome_materia ASC",
        [usuarioId]
      );

      return rows.map(row => new Materia(
        row.id,
        row.nome_materia,
        row.usuario_id,
        row.created_at,
        row.updated_at
      ));
    } catch (error) {
      console.error("Error finding materias by usuario id:", error);
      throw new Error("Error finding materias by usuario id");
    }
  }

  async findByUsuarioIdAndNome(usuarioId, nomeMateria) {
    try {
      const { rows } = await this.db.query(
        "SELECT * FROM public.materias WHERE usuario_id = $1 AND nome_materia = $2",
        [usuarioId, nomeMateria]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new Materia(
        row.id,
        row.nome_materia,
        row.usuario_id,
        row.created_at,
        row.updated_at
      );
    } catch (error) {
      console.error("Error finding materia by usuario id and nome:", error);
      throw new Error("Error finding materia by usuario id and nome");
    }
  }

  async update(id, materia) {
    try {
      const { rows } = await this.db.query(
        "UPDATE public.materias SET nome_materia = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [materia.nome_materia, id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new Materia(
        row.id,
        row.nome_materia,
        row.usuario_id,
        row.created_at,
        row.updated_at
      );
    } catch (error) {
      console.error("Error updating materia:", error);
      
      // Capturar erro de violação de constraint única (PostgreSQL)
      if (error.code === '23505') {
        throw new Error('Já existe uma matéria com este nome para este usuário');
      }
      
      // Capturar outros erros de constraint
      if (error.code === '23503') {
        throw new Error('Usuário não encontrado');
      }
      
      throw new Error("Erro ao atualizar matéria");
    }
  }

  async deleteById(id) {
    try {
      const { rows } = await this.db.query(
        "DELETE FROM public.materias WHERE id = $1 RETURNING *",
        [id]
      );

      return rows.length > 0;
    } catch (error) {
      console.error("Error deleting materia:", error);
      throw new Error("Error deleting materia");
    }
  }

  async deleteByUsuarioId(usuarioId) {
    try {
      const { rows } = await this.db.query(
        "DELETE FROM public.materias WHERE usuario_id = $1 RETURNING *",
        [usuarioId]
      );

      return rows.length;
    } catch (error) {
      console.error("Error deleting materias by usuario id:", error);
      throw new Error("Error deleting materias by usuario id");
    }
  }

  async countByUsuarioId(usuarioId) {
    try {
      const { rows } = await this.db.query(
        "SELECT COUNT(*) as count FROM public.materias WHERE usuario_id = $1",
        [usuarioId]
      );

      return parseInt(rows[0].count);
    } catch (error) {
      console.error("Error counting materias by usuario id:", error);
      throw new Error("Error counting materias by usuario id");
    }
  }
}

export default MateriaRepository; 