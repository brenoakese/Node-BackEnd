import UserRepository from "../repository/userRepository";
import User from "../models/User";
import userDto from "../dtos/userDto";

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    
    async create({ name, email, password }) {
        return this.userRepository.create({ name, email, password });
    }
    
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    }