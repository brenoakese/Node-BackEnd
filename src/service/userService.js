import UserRepository from "../repository/userRepository.js";
import User from "../models/User.js";
import userDto from "../dtos/userDto.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(userDto) {
    const existingUser = await this.userRepository.findByEmail(userDto.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User(
      undefined,
      userDto.name,
      userDto.email,
      userDto.password
    );

    await user.encryptPassword();

    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }

  async findByEmail(email) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id) {
    return this.userRepository.findById(id);
  }

  async findAll() {
    try {
      const users = await this.userRepository.findAll();
      return users;
    } catch (error) {
      console.error("Error in UserService.findAll:", error);
      throw new Error("Error fetching users");
    }
  }

  async deleteById(id) {
    try {
      // Verificar se o usuário existe antes de deletar
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error("User not found");
      }

      const deleted = await this.userRepository.deleteById(id);
      return deleted;
    } catch (error) {
      console.error("Error in UserService.deleteById:", error);
      throw error;
    }
  }
}

export default UserService;