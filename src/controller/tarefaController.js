import TarefaService from "../service/tarefaService.js";

class TarefaController {
  constructor() {
    this.tarefaService = new TarefaService();
  }

  // POST /api/tarefas - Criar nova tarefa
  async criarTarefa(req, res) {
    try {
      const { titulo, data_entrega, materia_id, usuario_id } = req.body;
      const usuarioLogado = req.user;

      // Se um usuario_id for fornecido no corpo, use-o (para criar tarefa para um dependente).
      // Caso contrário, use o id do usuário logado.
      const targetUsuarioId = usuario_id || usuarioLogado.id;

      // Adicionando um log para ver o que está sendo passado
      console.log('📦 [criarTarefa] Body recebido:', req.body);
      console.log(`🎯 Criando tarefa para o usuário: ${targetUsuarioId}`);

      const tarefa = await this.tarefaService.criarTarefa(titulo, data_entrega, materia_id, targetUsuarioId);

      res.status(201).json({
        success: true,
        data: tarefa,
        message: "Tarefa criada com sucesso"
      });
    } catch (error) {
      console.error("Error in criarTarefa controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/tarefas - Buscar tarefas (para usuário logado ou dependente)
  async getTarefas(req, res) {
    console.log('🏁 [getTarefas] Rota de tarefas alcançada.');
    console.log('   [getTarefas] URL Original:', req.originalUrl);
    console.log('   [getTarefas] Parâmetros de Query (req.query):', req.query);

    try {
      const { usuario_id } = req.query;
      const usuarioLogado = req.user;

      if (!usuario_id) {
        console.warn('   [getTarefas] "usuario_id" não fornecido na query. Retornando tarefas do usuário logado.');
        const tarefas = await this.tarefaService.buscarTarefasPorUsuario(usuarioLogado.id);
        return res.status(200).json({ success: true, data: tarefas, count: tarefas.length });
      }
      
      // Aqui, idealmente, deveríamos validar se o usuarioLogado tem permissão para ver as tarefas do usuario_id
      // Por agora, vamos confiar que o frontend está fazendo a lógica correta.
      console.log(`   [getTarefas] Buscando tarefas para o usuário especificado: ${usuario_id}`);
      const tarefas = await this.tarefaService.buscarTarefasPorUsuario(usuario_id);

      res.status(200).json({
        success: true,
        data: tarefas,
        count: tarefas.length
      });
    } catch (error) {
      console.error("🚨 Error in getTarefas controller:", error);
      res.status(500).json({ // Mudei para 500 para erros inesperados no servidor
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/tarefas - Buscar tarefas do usuário logado
  async buscarMinhasTarefas(req, res) {
    try {
      const usuarioLogado = req.user;
      const tarefas = await this.tarefaService.buscarTarefasPorUsuario(usuarioLogado.id);

      res.status(200).json({
        success: true,
        data: tarefas,
        count: tarefas.length
      });
    } catch (error) {
      console.error("Error in buscarMinhasTarefas controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/tarefas/:id - Buscar tarefa por ID
  async buscarTarefaPorId(req, res) {
    try {
      const { id } = req.params;
      const usuarioLogado = req.user;

      const tarefa = await this.tarefaService.buscarTarefaPorId(id, usuarioLogado.id);

      res.status(200).json({
        success: true,
        data: tarefa
      });
    } catch (error) {
      console.error("Error in buscarTarefaPorId controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /api/tarefas/:id/status - Atualizar status da tarefa
  async atualizarStatusTarefa(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const usuarioLogado = req.user;

      const tarefa = await this.tarefaService.atualizarStatusTarefa(id, status, usuarioLogado.id);

      res.status(200).json({
        success: true,
        data: tarefa,
        message: `Tarefa marcada como ${status}`
      });
    } catch (error) {
      console.error("Error in atualizarStatusTarefa controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /api/tarefas/:id - Deletar tarefa
  async deletarTarefa(req, res) {
    try {
      const { id } = req.params;
      const usuarioLogado = req.user;

      const resultado = await this.tarefaService.deletarTarefa(id, usuarioLogado.id);

      res.status(200).json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      console.error("Error in deletarTarefa controller:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default TarefaController; 