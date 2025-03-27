import UserRepository from "../repository/userRepository";
import User from "../models/User";
import userDto from "../dtos/userDto";

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    
    async create(userDto) {

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