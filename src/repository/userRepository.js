import e from "express";
import db from "../config/db.js";
import User from "../models/User.js";

class UserRepository {
  constructor() {
    this.db = db;
  }

  async create(user) {
    try {
      console.log("id", user.id);

      const { rows } = await db.query(
        "INSERT INTO public.usuarios (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [user.id, user.name, user.email, user.password]
      );

      return rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }

  async findByEmail(email) {
    try {
      const { rows } = await db.query(
        "SELECT id, name, email, password, familia_id, papel, papel_detalhado FROM public.usuarios WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return null; // No user found with the given email
      }
      
      const row = rows[0];
      return new User(
        row.id,
        row.name,
        row.email,
        row.password,
        row.familia_id,
        row.papel,
        row.papel_detalhado
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Error finding user by email");
    }
  }

  async findById(id) {
    try {
      const { rows } = await this.db.query(
        "SELECT id, name, email, password, familia_id, papel, papel_detalhado FROM public.usuarios WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return new User(
        rows[0].id,
        rows[0].name,
        rows[0].email,
        rows[0].password,
        rows[0].familia_id,
        rows[0].papel,
        rows[0].papel_detalhado
      );
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw new Error("Error finding user by id");
    }
  }

  async findAll() {
    try {
      const { rows } = await db.query(
        "SELECT id, name, email, created_at, updated_at FROM public.usuarios ORDER BY created_at DESC"
      );

      return rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error("Error finding all users:", error);
      throw new Error("Error finding all users");
    }
  }

  async deleteById(id) {
    try {
      const { rows } = await this.db.query(
        "DELETE FROM public.usuarios WHERE id = $1 RETURNING *",
        [id]
      );

      return rows.length > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Error deleting user");
    }
  }

  /**
   * Atualiza a família e o papel de um usuário.
   * @param {string} usuarioId - O ID do usuário a ser atualizado.
   * @param {string} familiaId - O ID da família para vincular.
   * @param {string} papel - O novo papel do usuário.
   * @param {string} papel_detalhado - O novo papel detalhado do usuário.
   * @returns {Promise<void>}
   */
  async updateFamilia(usuarioId, familiaId, papel, papel_detalhado = null) {
    try {
      const query = `
        UPDATE usuarios
        SET familia_id = $1, papel = $2, papel_detalhado = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4;
      `;
      await this.db.query(query, [familiaId, papel, papel_detalhado, usuarioId]);
    } catch (error) {
      console.error("Error updating user family:", error);
      throw new Error("Error updating user family");
    }
  }

  /**
   * Atualiza apenas o papel de um usuário.
   * @param {string} usuarioId - O ID do usuário a ser atualizado.
   * @param {string} papel - O novo papel do usuário.
   * @returns {Promise<void>}
   */
  async updatePapel(usuarioId, papel) {
    try {
      const query = `
        UPDATE usuarios
        SET papel = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2;
      `;
      await this.db.query(query, [papel, usuarioId]);
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Error updating user role");
    }
  }

  /**
   * Atualiza apenas o papel detalhado de um usuário.
   * @param {string} usuarioId - O ID do usuário a ser atualizado.
   * @param {string} papel_detalhado - O novo papel detalhado do usuário.
   * @returns {Promise<void>}
   */
  async updatePapelDetalhado(usuarioId, papel_detalhado) {
    try {
      const query = `
        UPDATE usuarios
        SET papel_detalhado = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2;
      `;
      await this.db.query(query, [papel_detalhado, usuarioId]);
    } catch (error) {
      console.error("Error updating user detailed role:", error);
      throw new Error("Error updating user detailed role");
    }
  }
}

export default UserRepository;