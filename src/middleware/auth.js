import jwt from 'jsonwebtoken';
import UserService from '../service/userService.js';
import User from '../models/User.js';

const userService = new UserService();

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido',
        code: 'NO_TOKEN'
      });
    }

    // Se for um dummy token (compatibilidade temporária)
    if (token.startsWith('dummy-token-')) {
      // Para desenvolvimento, aceitar dummy tokens
      // Em produção, remover esta parte
      console.log('⚠️  Usando dummy token para desenvolvimento');
      req.user = new User('dummy-user', 'Test User', 'test@test.com', null, null, 'responsavel', 'dono');
      return next();
    }

    // Verificar JWT real
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Buscar o usuário no banco para garantir que ainda existe
    const user = await userService.findById(decoded.id);
    
    // Log para depuração: verificar o que está sendo retornado
    console.log('🔍 User object from service in middleware:', user);

    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Criar uma instância da classe User com os dados do banco
    req.user = new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.familia_id,
      user.papel,
      user.papel_detalhado
    );

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'EXPIRED_TOKEN'
      });
    }

    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export default authenticateToken;