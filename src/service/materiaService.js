import MateriaRepository from "../repository/materiaRepository.js";
import Materia from "../models/Materia.js";

class MateriaService {
  constructor() {
    this.materiaRepository = new MateriaRepository();
  }

  async criarMateria(nomeMateria, usuarioId) {
    try {
      // Validar dados de entrada
      if (!nomeMateria || !nomeMateria.trim()) {
        throw new Error("Nome da matéria é obrigatório");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      // Normalizar o nome da matéria
      const nomeNormalizado = nomeMateria.trim();

      // Verificar se já existe uma matéria com este nome para este usuário
      const materiaExistente = await this.materiaRepository.findByUsuarioIdAndNome(usuarioId, nomeNormalizado);
      if (materiaExistente) {
        throw new Error("Já existe uma matéria com este nome");
      }

      // Criar nova matéria
      const materia = new Materia(null, nomeNormalizado, usuarioId);
      
      if (!materia.isValid()) {
        throw new Error("Dados da matéria são inválidos");
      }

      const materiaCriada = await this.materiaRepository.create(materia);
      return materiaCriada;
    } catch (error) {
      console.error("Error in criarMateria:", error);
      throw error;
    }
  }

  async buscarMateriasPorUsuario(usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const materias = await this.materiaRepository.findByUsuarioId(usuarioId);
      return materias;
    } catch (error) {
      console.error("Error in buscarMateriasPorUsuario:", error);
      throw error;
    }
  }

  async buscarMateriaPorId(materiaId) {
    try {
      if (!materiaId) {
        throw new Error("ID da matéria é obrigatório");
      }

      const materia = await this.materiaRepository.findById(materiaId);
      if (!materia) {
        throw new Error("Matéria não encontrada");
      }

      return materia;
    } catch (error) {
      console.error("Error in buscarMateriaPorId:", error);
      throw error;
    }
  }

  async atualizarMateria(materiaId, nomeMateria, usuarioId) {
    try {
      if (!materiaId) {
        throw new Error("ID da matéria é obrigatório");
      }

      if (!nomeMateria || !nomeMateria.trim()) {
        throw new Error("Nome da matéria é obrigatório");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      // Verificar se a matéria existe e pertence ao usuário
      const materiaExistente = await this.materiaRepository.findById(materiaId);
      if (!materiaExistente) {
        throw new Error("Matéria não encontrada");
      }

      if (materiaExistente.usuario_id !== usuarioId) {
        throw new Error("Você não tem permissão para editar esta matéria");
      }

      // Normalizar o nome da matéria
      const nomeNormalizado = nomeMateria.trim();

      // Verificar se já existe outra matéria com este nome para este usuário
      const materiaComMesmoNome = await this.materiaRepository.findByUsuarioIdAndNome(usuarioId, nomeNormalizado);
      if (materiaComMesmoNome && materiaComMesmoNome.id !== materiaId) {
        throw new Error("Já existe uma matéria com este nome");
      }

      // Atualizar a matéria
      const materiaAtualizada = new Materia(materiaId, nomeNormalizado, usuarioId);
      const resultado = await this.materiaRepository.update(materiaId, materiaAtualizada);
      
      if (!resultado) {
        throw new Error("Erro ao atualizar a matéria");
      }

      return resultado;
    } catch (error) {
      console.error("Error in atualizarMateria:", error);
      throw error;
    }
  }

  async deletarMateria(materiaId, usuarioId) {
    try {
      if (!materiaId) {
        throw new Error("ID da matéria é obrigatório");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      // Verificar se a matéria existe e pertence ao usuário
      const materiaExistente = await this.materiaRepository.findById(materiaId);
      if (!materiaExistente) {
        throw new Error("Matéria não encontrada");
      }

      if (materiaExistente.usuario_id !== usuarioId) {
        throw new Error("Você não tem permissão para deletar esta matéria");
      }

      // TODO: Verificar se existem tarefas associadas a esta matéria
      // Se existirem, não permitir a exclusão ou criar uma estratégia de limpeza

      const resultado = await this.materiaRepository.deleteById(materiaId);
      if (!resultado) {
        throw new Error("Erro ao deletar a matéria");
      }

      return { success: true, message: "Matéria deletada com sucesso" };
    } catch (error) {
      console.error("Error in deletarMateria:", error);
      throw error;
    }
  }

  async contarMateriasPorUsuario(usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const count = await this.materiaRepository.countByUsuarioId(usuarioId);
      return count;
    } catch (error) {
      console.error("Error in contarMateriasPorUsuario:", error);
      throw error;
    }
  }

  async criarMateriasParaDependente(usuarioId, nomesMaterias) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      if (!Array.isArray(nomesMaterias) || nomesMaterias.length === 0) {
        throw new Error("Lista de matérias é obrigatória");
      }

      const materiasCriadas = [];
      const erros = [];

      for (const nomeMateria of nomesMaterias) {
        try {
          const materia = await this.criarMateria(nomeMateria, usuarioId);
          materiasCriadas.push(materia);
        } catch (error) {
          erros.push({ materia: nomeMateria, erro: error.message });
        }
      }

      return {
        materiasCriadas,
        erros,
        totalCriadas: materiasCriadas.length,
        totalErros: erros.length
      };
    } catch (error) {
      console.error("Error in criarMateriasParaDependente:", error);
      throw error;
    }
  }
}

export default MateriaService; 