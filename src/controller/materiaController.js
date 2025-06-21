import MateriaService from "../service/materiaService.js";

class MateriaController {
  constructor() {
    this.materiaService = new MateriaService();
  }

  // POST /api/materias - Criar nova matéria
  async criarMateria(req, res) {
    try {
      const { nome_materia, usuario_id } = req.body;
      const usuarioLogado = req.user;

      // LOG DETALHADO PARA DEBUG
      console.log('🔍 [criarMateria] nome_materia:', nome_materia, '| usuario_id (body):', usuario_id, '| usuarioLogado:', usuarioLogado.id, usuarioLogado.papel_detalhado);

      // Se não foi especificado usuario_id, usar o usuário logado
      const targetUsuarioId = usuario_id || usuarioLogado.id;

      // Verificar permissões: apenas responsáveis podem criar matérias para dependentes
      if (usuario_id && usuario_id !== usuarioLogado.id) {
        if (!usuarioLogado.isResponsavel()) {
          return res.status(403).json({
            success: false,
            error: "Você não tem permissão para criar matérias para outros usuários"
          });
        }
      }

      const materia = await this.materiaService.criarMateria(nome_materia, targetUsuarioId);

      res.status(201).json({
        success: true,
        data: materia,
        message: "Matéria criada com sucesso"
      });
    } catch (error) {
      console.error("Error in criarMateria controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/materias/usuario/:usuarioId - Buscar matérias de um usuário
  async buscarMateriasPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;
      const usuarioLogado = req.user;

      // LOG DETALHADO PARA DEBUG
      console.log('🔍 [buscarMateriasPorUsuario] usuarioId (param):', usuarioId, '| usuarioLogado:', usuarioLogado.id, usuarioLogado.papel_detalhado);

      // Verificar permissões: usuário só pode ver suas próprias matérias ou responsáveis podem ver de dependentes
      if (usuarioId !== usuarioLogado.id) {
        if (!usuarioLogado.isResponsavel()) {
          return res.status(403).json({
            success: false,
            error: "Você não tem permissão para ver matérias de outros usuários"
          });
        }
      }

      const materias = await this.materiaService.buscarMateriasPorUsuario(usuarioId);

      res.status(200).json({
        success: true,
        data: materias,
        count: materias.length
      });
    } catch (error) {
      console.error("Error in buscarMateriasPorUsuario controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/materias/me - Buscar matérias do usuário logado
  async buscarMinhasMaterias(req, res) {
    try {
      const usuarioLogado = req.user;
      const materias = await this.materiaService.buscarMateriasPorUsuario(usuarioLogado.id);

      res.status(200).json({
        success: true,
        data: materias,
        count: materias.length
      });
    } catch (error) {
      console.error("Error in buscarMinhasMaterias controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/materias/:id - Buscar matéria por ID
  async buscarMateriaPorId(req, res) {
    try {
      const { id } = req.params;
      const usuarioLogado = req.user;

      const materia = await this.materiaService.buscarMateriaPorId(id);

      // Verificar permissões: usuário só pode ver suas próprias matérias ou responsáveis podem ver de dependentes
      if (materia.usuario_id !== usuarioLogado.id) {
        if (!usuarioLogado.isResponsavel()) {
          return res.status(403).json({
            success: false,
            error: "Você não tem permissão para ver esta matéria"
          });
        }
      }

      res.status(200).json({
        success: true,
        data: materia
      });
    } catch (error) {
      console.error("Error in buscarMateriaPorId controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /api/materias/:id - Atualizar matéria
  async atualizarMateria(req, res) {
    try {
      const { id } = req.params;
      const { nome_materia } = req.body;
      const usuarioLogado = req.user;

      const materia = await this.materiaService.atualizarMateria(id, nome_materia, usuarioLogado.id);

      res.status(200).json({
        success: true,
        data: materia,
        message: "Matéria atualizada com sucesso"
      });
    } catch (error) {
      console.error("Error in atualizarMateria controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /api/materias/:id - Deletar matéria
  async deletarMateria(req, res) {
    try {
      const { id } = req.params;
      const usuarioLogado = req.user;

      const resultado = await this.materiaService.deletarMateria(id, usuarioLogado.id);

      res.status(200).json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      console.error("Error in deletarMateria controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /api/materias/dependente/:usuarioId - Criar múltiplas matérias para um dependente
  async criarMateriasParaDependente(req, res) {
    try {
      const { usuarioId } = req.params;
      const { nomes_materias } = req.body;
      const usuarioLogado = req.user;

      // Verificar permissões: apenas responsáveis podem criar matérias para dependentes
      if (!usuarioLogado.isResponsavel()) {
        return res.status(403).json({
          success: false,
          error: "Você não tem permissão para criar matérias para outros usuários"
        });
      }

      const resultado = await this.materiaService.criarMateriasParaDependente(usuarioId, nomes_materias);

      res.status(201).json({
        success: true,
        data: resultado,
        message: `${resultado.totalCriadas} matérias criadas com sucesso`
      });
    } catch (error) {
      console.error("Error in criarMateriasParaDependente controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default MateriaController; 