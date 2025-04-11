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
        "SELECT * FROM public.usuarios WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return null; // No user found with the given email
      }

      return new User(
        rows[0].id,
        rows[0].name,
        rows[0].email,
        rows[0].password
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Error finding user by email");
    }
  }
}

export default UserRepository;
