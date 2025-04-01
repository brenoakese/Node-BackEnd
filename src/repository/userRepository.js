import e from "express";
import db from "../config/db.js";
import User from "../models/User.js";

class UserRepository {

  constructor(){
    this.db = db;
  }


  async create({ name, email, password }) {
    const { rows } = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    return rows[0];
  }

  async findByEmail(email) {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    return rows[0];
  }
}

export default UserRepository;