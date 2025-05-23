import userDto from "../dtos/userDto.js";
import UserService from "../service/userService.js";

class AuthController {
  userService = new UserService();

  async register(req, res) {
    try {
      console.log(req.body);

      const { name, email, password } = req.body;

      const user = await this.userService.create(
        new userDto(name, password, email)
      );
      res.status(201).json({
        message: "User registered successfully",
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await user.checkPassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default AuthController;
