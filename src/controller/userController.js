import UserService from '../service/userService.js';
import userDto from '../dtos/userDto.js';

const userService = new UserService();

class UserController {
  
  async getUsers(req, res) {
    try {
      console.log('📋 Buscando todos os usuários...');
      console.log('👤 Usuário autenticado:', req.user);
      
      const users = await userService.findAll();
      
      console.log(`✅ ${users.length} usuários encontrados`);
      
      return res.status(200).json({
        success: true,
        message: 'Usuários encontrados com sucesso',
        users: users,
        total: users.length
      });

    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar usuários',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      console.log('🔍 Buscando usuário por ID:', id);
      
      const user = await userService.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Usuário encontrado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Erro ao buscar usuário por ID:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao buscar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;
      
      console.log('🗑️  Tentando deletar usuário:', id);
      console.log('👤 Usuário atual:', currentUserId);
      
      // Verificar se o usuário não está tentando deletar a si mesmo
      if (id === currentUserId) {
        return res.status(400).json({
          success: false,
          error: 'Você não pode deletar sua própria conta'
        });
      }

      const deleted = await userService.deleteById(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      console.log('✅ Usuário deletado com sucesso');

      return res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });

    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor ao deletar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      
      console.log('👤 Buscando dados do usuário atual:', userId);
      
      const user = await userService.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Dados do usuário atual',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Erro ao buscar usuário atual:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default UserController;