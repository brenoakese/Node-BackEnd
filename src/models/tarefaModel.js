const pool = require('../config/db');

class Tarefa {
  static async findByUsuarioId(usuarioId) {
    const query = `
      SELECT
        t.id,
        t.titulo,
        t.data_entrega,
        t.status,
        t.usuario_id,
        t.created_at,
        t.updated_at,
        m.id as materia_id,
        m.nome_materia
      FROM
        tarefas t
      LEFT JOIN
        materias m ON t.materia_id = m.id
      WHERE
        t.usuario_id = $1
      ORDER BY
        t.created_at DESC;
    `;
    const { rows } = await pool.query(query, [usuarioId]);
    
    // Formata o resultado para aninhar o objeto da matéria
    return rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      data_entrega: row.data_entrega,
      status: row.status,
      usuario_id: row.usuario_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      materia: {
        id: row.materia_id,
        nome_materia: row.nome_materia
      }
    }));
  }

  static async create({ titulo, data_entrega, usuario_id, materia_id }) {
    const query = `
      INSERT INTO tarefas (titulo, data_entrega, usuario_id, materia_id, status)
      VALUES ($1, $2, $3, $4, 'pendente')
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [titulo, data_entrega, usuario_id, materia_id]);
    return rows[0];
  }

  static async updateStatus(tarefaId, status) {
    const query = `
      UPDATE tarefas
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, tarefaId]);
    return rows[0];
  }
}

module.exports = Tarefa; 