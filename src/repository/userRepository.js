import e from "express";
import db from "../config/db.js";
import User from "../models/User.js";

class UserRepository {
  constructor() {
    this.db = db;
  }

  async create(user) {
    try {
      const { name, email, password } = user;

      console.log(`${name}, ${email}, ${password}`);

      const { rows } = await db.query(
        "INSERT INTO public.usuarios (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password]
      );

      return rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }

  async findByEmail(email) {
    const { rows } = await db.query(
      "SELECT * FROM public.usuarios WHERE email = $1",
      [email]
    );

    return rows[0];
  }
}

export default UserRepository;
