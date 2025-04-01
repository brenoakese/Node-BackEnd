import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

class Database {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  async connect() {
    try {
      await this.pool.connect();
      console.log(
        "Conexão com o banco de dados PostgreSQL estabelecida com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao conectar ao banco de dados PostgreSQL:",
        error.message
      );
      process.exit(1);
    }
  }

  async query(query, params) {
    return this.pool.query(query, params);
  }
}

const db = new Database();
db.connect();

export default db;