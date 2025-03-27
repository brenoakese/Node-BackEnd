import pool from "../config/db";
import User from "../models/User";

class UserRepository {
  async create({ name, email, password }) {
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    return rows[0];
  }

  async findByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    return rows[0];
  }
}