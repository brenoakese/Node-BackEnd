import db from "../config/db.js";
import Tarefa from "../models/Tarefa.js";

class TarefaRepository {
  constructor() {
    this.db = db;
  }

  async create(tarefa) {
    try {
      const { rows } = await this.db.query(
        "INSERT INTO public.tarefas (titulo, data_entrega, status, usuario_id, materia_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [tarefa.titulo, tarefa.data_entrega, tarefa.status, tarefa.usuario_id, tarefa.materia_id]
      );

      return new Tarefa(
        rows[0].id,
        rows[0].titulo,
        rows[0].data_entrega,
        rows[0].status,
        rows[0].usuario_id,
        rows[0].materia_id,
        rows[0].created_at,
        rows[0].updated_at
      );
    } catch (error) {
      console.error("Error creating tarefa:", error);
      throw new Error("Error creating tarefa");
    }
  }

  async findById(id) {
    try {
      const { rows } = await this.db.query(
        `SELECT t.*, m.nome_materia 
         FROM public.tarefas t 
         JOIN public.materias m ON t.materia_id = m.id 
         WHERE t.id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      const tarefa = new Tarefa(
        row.id,
        row.titulo,
        row.data_entrega,
        row.status,
        row.usuario_id,
        row.materia_id,
        row.created_at,
        row.updated_at
      );

      // Adicionar informações da matéria
      tarefa.materia = {
        id: row.materia_id,
        nome_materia: row.nome_materia
      };

      return tarefa;
    } catch (error) {
      console.error("Error finding tarefa by id:", error);
      throw new Error("Error finding tarefa by id");
    }
  }

  async findByUsuarioId(usuarioId) {
    try {
      const { rows } = await this.db.query(
        `SELECT t.*, m.nome_materia 
         FROM public.tarefas t 
         JOIN public.materias m ON t.materia_id = m.id 
         WHERE t.usuario_id = $1 
         ORDER BY t.data_entrega ASC, t.created_at DESC`,
        [usuarioId]
      );

      return rows.map(row => {
        const tarefa = new Tarefa(
          row.id,
          row.titulo,
          row.data_entrega,
          row.status,
          row.usuario_id,
          row.materia_id,
          row.created_at,
          row.updated_at
        );

        // Adicionar informações da matéria
        tarefa.materia = {
          id: row.materia_id,
          nome_materia: row.nome_materia
        };

        return tarefa;
      });
    } catch (error) {
      console.error("Error finding tarefas by usuario id:", error);
      throw new Error("Error finding tarefas by usuario id");
    }
  }

  async findByUsuarioIdAndStatus(usuarioId, status) {
    try {
      const { rows } = await this.db.query(
        `SELECT t.*, m.nome_materia 
         FROM public.tarefas t 
         JOIN public.materias m ON t.materia_id = m.id 
         WHERE t.usuario_id = $1 AND t.status = $2 
         ORDER BY t.data_entrega ASC, t.created_at DESC`,
        [usuarioId, status]
      );

      return rows.map(row => {
        const tarefa = new Tarefa(
          row.id,
          row.titulo,
          row.data_entrega,
          row.status,
          row.usuario_id,
          row.materia_id,
          row.created_at,
          row.updated_at
        );

        // Adicionar informações da matéria
        tarefa.materia = {
          id: row.materia_id,
          nome_materia: row.nome_materia
        };

        return tarefa;
      });
    } catch (error) {
      console.error("Error finding tarefas by usuario id and status:", error);
      throw new Error("Error finding tarefas by usuario id and status");
    }
  }

  async updateStatus(id, status) {
    try {
      const { rows } = await this.db.query(
        "UPDATE public.tarefas SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [status, id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new Tarefa(
        row.id,
        row.titulo,
        row.data_entrega,
        row.status,
        row.usuario_id,
        row.materia_id,
        row.created_at,
        row.updated_at
      );
    } catch (error) {
      console.error("Error updating tarefa status:", error);
      throw new Error("Error updating tarefa status");
    }
  }

  async update(id, tarefa) {
    try {
      const { rows } = await this.db.query(
        "UPDATE public.tarefas SET titulo = $1, data_entrega = $2, materia_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
        [tarefa.titulo, tarefa.data_entrega, tarefa.materia_id, id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new Tarefa(
        row.id,
        row.titulo,
        row.data_entrega,
        row.status,
        row.usuario_id,
        row.materia_id,
        row.created_at,
        row.updated_at
      );
    } catch (error) {
      console.error("Error updating tarefa:", error);
      throw new Error("Error updating tarefa");
    }
  }

  async deleteById(id) {
    try {
      const { rows } = await this.db.query(
        "DELETE FROM public.tarefas WHERE id = $1 RETURNING *",
        [id]
      );

      return rows.length > 0;
    } catch (error) {
      console.error("Error deleting tarefa:", error);
      throw new Error("Error deleting tarefa");
    }
  }

  async deleteByUsuarioId(usuarioId) {
    try {
      const { rows } = await this.db.query(
        "DELETE FROM public.tarefas WHERE usuario_id = $1 RETURNING *",
        [usuarioId]
      );

      return rows.length;
    } catch (error) {
      console.error("Error deleting tarefas by usuario id:", error);
      throw new Error("Error deleting tarefas by usuario id");
    }
  }

  async countByUsuarioId(usuarioId) {
    try {
      const { rows } = await this.db.query(
        "SELECT COUNT(*) as count FROM public.tarefas WHERE usuario_id = $1",
        [usuarioId]
      );

      return parseInt(rows[0].count);
    } catch (error) {
      console.error("Error counting tarefas by usuario id:", error);
      throw new Error("Error counting tarefas by usuario id");
    }
  }

  async countByUsuarioIdAndStatus(usuarioId, status) {
    try {
      const { rows } = await this.db.query(
        "SELECT COUNT(*) as count FROM public.tarefas WHERE usuario_id = $1 AND status = $2",
        [usuarioId, status]
      );

      return parseInt(rows[0].count);
    } catch (error) {
      console.error("Error counting tarefas by usuario id and status:", error);
      throw new Error("Error counting tarefas by usuario id and status");
    }
  }
}

export default TarefaRepository; 