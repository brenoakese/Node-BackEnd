import TarefaRepository from "../repository/tarefaRepository.js";
import MateriaRepository from "../repository/materiaRepository.js";
import Tarefa from "../models/Tarefa.js";

class TarefaService {
  constructor() {
    this.tarefaRepository = new TarefaRepository();
    this.materiaRepository = new MateriaRepository();
  }

  async criarTarefa(titulo, dataEntrega, materiaId, usuarioId) {
    try {
      if (!titulo || !titulo.trim()) {
        throw new Error("Título da tarefa é obrigatório");
      }

      if (!dataEntrega) {
        throw new Error("Data de entrega é obrigatória");
      }

      if (!materiaId) {
        throw new Error("Matéria é obrigatória");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const materia = await this.materiaRepository.findById(materiaId);
      if (!materia) {
        throw new Error("Matéria não encontrada");
      }

      if (materia.usuario_id !== usuarioId) {
        throw new Error("Matéria não pertence ao usuário");
      }

      const dataEntregaObj = new Date(dataEntrega);
      if (isNaN(dataEntregaObj.getTime())) {
        throw new Error("Data de entrega inválida");
      }

      const tarefa = new Tarefa(null, titulo.trim(), dataEntregaObj, 'pendente', usuarioId, materiaId);
      
      if (!tarefa.isValid()) {
        throw new Error("Dados da tarefa são inválidos");
      }

      const tarefaCriada = await this.tarefaRepository.create(tarefa);
      
      tarefaCriada.materia = {
        id: materia.id,
        nome_materia: materia.nome_materia
      };

      return tarefaCriada;
    } catch (error) {
      console.error("Error in criarTarefa:", error);
      throw error;
    }
  }

  async buscarTarefasPorUsuario(usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const tarefas = await this.tarefaRepository.findByUsuarioId(usuarioId);
      return tarefas;
    } catch (error) {
      console.error("Error in buscarTarefasPorUsuario:", error);
      throw error;
    }
  }

  async buscarTarefasPorUsuarioEStatus(usuarioId, status) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      if (!['pendente', 'concluida'].includes(status)) {
        throw new Error("Status inválido");
      }

      const tarefas = await this.tarefaRepository.findByUsuarioIdAndStatus(usuarioId, status);
      return tarefas;
    } catch (error) {
      console.error("Error in buscarTarefasPorUsuarioEStatus:", error);
      throw error;
    }
  }

  async buscarTarefaPorId(tarefaId, usuarioId) {
    try {
      if (!tarefaId) {
        throw new Error("ID da tarefa é obrigatório");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const tarefa = await this.tarefaRepository.findById(tarefaId);
      if (!tarefa) {
        throw new Error("Tarefa não encontrada");
      }

      if (tarefa.usuario_id !== usuarioId) {
        throw new Error("Você não tem permissão para acessar esta tarefa");
      }

      return tarefa;
    } catch (error) {
      console.error("Error in buscarTarefaPorId:", error);
      throw error;
    }
  }

  async atualizarStatusTarefa(tarefaId, status, usuarioId) {
    try {
      if (!tarefaId) {
        throw new Error("ID da tarefa é obrigatório");
      }

      if (!['pendente', 'concluida'].includes(status)) {
        throw new Error("Status inválido");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const tarefaExistente = await this.tarefaRepository.findById(tarefaId);
      if (!tarefaExistente) {
        throw new Error("Tarefa não encontrada");
      }

      if (tarefaExistente.usuario_id !== usuarioId) {
        throw new Error("Você não tem permissão para alterar esta tarefa");
      }

      const tarefaAtualizada = await this.tarefaRepository.updateStatus(tarefaId, status);
      if (!tarefaAtualizada) {
        throw new Error("Erro ao atualizar o status da tarefa");
      }

      tarefaAtualizada.materia = tarefaExistente.materia;

      return tarefaAtualizada;
    } catch (error) {
      console.error("Error in atualizarStatusTarefa:", error);
      throw error;
    }
  }

  async atualizarTarefa(tarefaId, titulo, dataEntrega, materiaId, usuarioId) {
    try {
      if (!tarefaId) {
        throw new Error("ID da tarefa é obrigatório");
      }

      if (!titulo || !titulo.trim()) {
        throw new Error("Título da tarefa é obrigatório");
      }

      if (!dataEntrega) {
        throw new Error("Data de entrega é obrigatória");
      }

      if (!materiaId) {
        throw new Error("Matéria é obrigatória");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const tarefaExistente = await this.tarefaRepository.findById(tarefaId);
      if (!tarefaExistente) {
        throw new Error("Tarefa não encontrada");
      }

      if (tarefaExistente.usuario_id !== usuarioId) {
        throw new Error("Você não tem permissão para editar esta tarefa");
      }

      const materia = await this.materiaRepository.findById(materiaId);
      if (!materia) {
        throw new Error("Matéria não encontrada");
      }

      if (materia.usuario_id !== usuarioId) {
        throw new Error("Matéria não pertence ao usuário");
      }

      const dataEntregaObj = new Date(dataEntrega);
      if (isNaN(dataEntregaObj.getTime())) {
        throw new Error("Data de entrega inválida");
      }

      const tarefaAtualizada = new Tarefa(tarefaId, titulo.trim(), dataEntregaObj, tarefaExistente.status, usuarioId, materiaId);
      const resultado = await this.tarefaRepository.update(tarefaId, tarefaAtualizada);
      
      if (!resultado) {
        throw new Error("Erro ao atualizar a tarefa");
      }

      resultado.materia = {
        id: materia.id,
        nome_materia: materia.nome_materia
      };

      return resultado;
    } catch (error) {
      console.error("Error in atualizarTarefa:", error);
      throw error;
    }
  }

  async deletarTarefa(tarefaId, usuarioId) {
    try {
      if (!tarefaId) {
        throw new Error("ID da tarefa é obrigatório");
      }

      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const tarefaExistente = await this.tarefaRepository.findById(tarefaId);
      if (!tarefaExistente) {
        throw new Error("Tarefa não encontrada");
      }

      if (tarefaExistente.usuario_id !== usuarioId) {
        throw new Error("Você não tem permissão para deletar esta tarefa");
      }

      const resultado = await this.tarefaRepository.deleteById(tarefaId);
      if (!resultado) {
        throw new Error("Erro ao deletar a tarefa");
      }

      return { success: true, message: "Tarefa deletada com sucesso" };
    } catch (error) {
      console.error("Error in deletarTarefa:", error);
      throw error;
    }
  }

  async contarTarefasPorUsuario(usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const count = await this.tarefaRepository.countByUsuarioId(usuarioId);
      return count;
    } catch (error) {
      console.error("Error in contarTarefasPorUsuario:", error);
      throw error;
    }
  }

  async contarTarefasPorUsuarioEStatus(usuarioId, status) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      if (!['pendente', 'concluida'].includes(status)) {
        throw new Error("Status inválido");
      }

      const count = await this.tarefaRepository.countByUsuarioIdAndStatus(usuarioId, status);
      return count;
    } catch (error) {
      console.error("Error in contarTarefasPorUsuarioEStatus:", error);
      throw error;
    }
  }

  async buscarEstatisticasTarefas(usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const totalTarefas = await this.contarTarefasPorUsuario(usuarioId);
      const tarefasPendentes = await this.contarTarefasPorUsuarioEStatus(usuarioId, 'pendente');
      const tarefasConcluidas = await this.contarTarefasPorUsuarioEStatus(usuarioId, 'concluida');

      return {
        total: totalTarefas,
        pendentes: tarefasPendentes,
        concluidas: tarefasConcluidas,
        percentualConcluidas: totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0
      };
    } catch (error) {
      console.error("Error in buscarEstatisticasTarefas:", error);
      throw error;
    }
  }
}

export default TarefaService; 