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

  async findById(id) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM public.usuarios WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return new User(
        rows[0].id,
        rows[0].name,
        rows[0].email,
        rows[0].password
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
      const { rows } = await db.query(
        "DELETE FROM public.usuarios WHERE id = $1 RETURNING *",
        [id]
      );

      return rows.length > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Error deleting user");
    }
  }
}

export default UserRepository;