import db from "../config/db.js";
import Familia from "../models/Familia.js";

class FamiliaRepository {
  constructor() {
    this.db = db;
  }

  /**
   * Cria uma nova família no banco de dados.
   * @param {string} nome - O nome da família.
   * @param {string} codigoConvite - O código de convite gerado.
   * @returns {Promise<Familia>} A instância da família criada.
   */
  async create(nome, codigoConvite) {
    try {
      const query = `
        INSERT INTO familias (nome, codigo_convite)
        VALUES ($1, $2)
        RETURNING id, nome, codigo_convite, created_at, updated_at;
      `;
      const values = [nome, codigoConvite];
      const { rows } = await this.db.query(query, values);
      const row = rows[0];
      return new Familia(row.id, row.nome, row.codigo_convite, row.created_at, row.updated_at);
    } catch (error) {
      console.error("Error creating family:", error);
      throw new Error("Error creating family");
    }
  }

  /**
   * Encontra uma família pelo seu código de convite.
   * @param {string} codigoConvite - O código de convite.
   * @returns {Promise<Familia|null>} A instância da família encontrada ou null.
   */
  async findByCodigo(codigoConvite) {
    try {
      const query = 'SELECT * FROM familias WHERE codigo_convite = $1;';
      const { rows } = await this.db.query(query, [codigoConvite]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new Familia(row.id, row.nome, row.codigo_convite, row.created_at, row.updated_at);
    } catch (error) {
      console.error("Error finding family by code:", error);
      throw new Error("Error finding family by code");
    }
  }

  /**
   * Busca os membros de uma determinada família.
   * @param {string} familiaId - O ID da família.
   * @returns {Promise<Array<Object>>} Uma lista de usuários (sem a senha).
   */
  async findMembrosByFamiliaId(familiaId) {
    try {
      const query = `
        SELECT id, name, email, papel, papel_detalhado
        FROM usuarios
        WHERE familia_id = $1;
      `;
      const { rows } = await this.db.query(query, [familiaId]);
      return rows;
    } catch (error) {
      console.error("Error finding family members:", error);
      throw new Error("Error finding family members");
    }
  }

  /**
   * Busca uma família pelo ID.
   * @param {string} id - O ID da família.
   * @returns {Promise<Familia|null>} A instância da família encontrada ou null.
   */
  async findById(id) {
    try {
      const query = 'SELECT * FROM familias WHERE id = $1;';
      const { rows } = await this.db.query(query, [id]);
      if (rows.length === 0) {
        return null;
      }
      const row = rows[0];
      return new Familia(row.id, row.nome, row.codigo_convite, row.created_at, row.updated_at);
    } catch (error) {
      console.error("Error finding family by id:", error);
      throw new Error("Error finding family by id");
    }
  }
}

export default FamiliaRepository; 