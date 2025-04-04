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
}

export default UserService;
