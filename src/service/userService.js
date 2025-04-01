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

    const user = new User(userDto.name, userDto.email, userDto.password);
    await user.encryptPassword();

    return this.userRepository.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }

  async findByEmail(email) {
    return this.userRepository.findByEmail(email);
  }
}

export default UserService;