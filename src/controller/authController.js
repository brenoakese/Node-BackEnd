import userDto from "../dtos/userDto.js";
import UserService from "../service/userService.js";

class AuthController {
  userService = new UserService();

  async register(req, res) {
    try {
      console.log("📦 Dados recebidos no backend:", req.body);
      
      const { name, email, password } = req.body;

      // Validações básicas
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: "Nome, email e senha são obrigatórios",
          details: { name: !!name, email: !!email, password: !!password }
        });
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "Email inválido" 
        });
      }

      // Validação de senha
      if (password.length < 6) {
        return res.status(400).json({ 
          error: "Senha deve ter pelo menos 6 caracteres" 
        });
      }

      console.log("🔄 Criando usuário...");
      
      const user = await this.userService.create(
        new userDto(name, password, email)
      );

      console.log("✅ Usuário criado com sucesso:", {
        id: user.id,
        name: user.name,
        email: user.email
      });

      res.status(201).json({
        message: "Usuário registrado com sucesso",
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error("❌ Erro no registro:", error);
      
      // Tratamento de erros específicos
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return res.status(409).json({ 
          error: "Email já está em uso",
          code: "EMAIL_ALREADY_EXISTS"
        });
      }

      res.status(500).json({ 
        error: "Erro interno do servidor durante o registro",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async login(req, res) {
    try {
      console.log("📦 Tentativa de login:", { email: req.body.email });
      
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: "Email e senha são obrigatórios" 
        });
      }

      console.log("🔍 Buscando usuário por email...");
      const user = await this.userService.findByEmail(email);
      
      if (!user) {
        console.log("❌ Usuário não encontrado");
        return res.status(401).json({ 
          error: "Credenciais inválidas" 
        });
      }

      console.log("🔐 Verificando senha...");
      const isPasswordValid = await user.checkPassword(password);
      
      if (!isPasswordValid) {
        console.log("❌ Senha inválida");
        return res.status(401).json({ 
          error: "Credenciais inválidas" 
        });
      }

      console.log("✅ Login realizado com sucesso");

      return res.status(200).json({
        message: "Login realizado com sucesso",
        success: true,
        token: "dummy-token-" + Date.now(), // Você pode implementar JWT aqui
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error("❌ Erro no login:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor durante o login",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default AuthController;