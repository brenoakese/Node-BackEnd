import FamiliaService from '../service/familiaService.js';

class FamiliaController {
  constructor() {
    this.familiaService = new FamiliaService();
  }

  /**
   * Rota para criar uma nova família.
   */
  async criarFamilia(req, res) {
    try {
      const { nome } = req.body;
      const usuarioId = req.user.id; // Vem do middleware de autenticação

      if (!nome) {
        return res.status(400).json({ success: false, error: 'O nome da família é obrigatório.' });
      }

      const novaFamilia = await this.familiaService.criarFamilia(nome, usuarioId);
      
      return res.status(201).json({
        success: true,
        message: 'Família criada com sucesso!',
        familia: novaFamilia.toJSON(),
      });
    } catch (error) {
      console.error('❌ Erro ao criar família:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Rota para um usuário entrar em uma família.
   */
  async entrarEmFamilia(req, res) {
    try {
      const { codigo_convite } = req.body;
      const usuarioId = req.user.id;

      if (!codigo_convite) {
        return res.status(400).json({ success: false, error: 'O código de convite é obrigatório.' });
      }

      const familia = await this.familiaService.entrarEmFamilia(codigo_convite, usuarioId);

      return res.status(200).json({
        success: true,
        message: 'Você entrou na família com sucesso!',
        familia: familia.toJSON(),
      });
    } catch (error) {
      console.error('❌ Erro ao entrar em família:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Rota para buscar os detalhes da família do usuário logado.
   */
  async getMinhaFamilia(req, res) {
    try {
      const familiaId = req.user.familia_id; // Vem do middleware de autenticação

      if (!familiaId) {
        return res.status(404).json({ success: false, error: 'Você ainda não faz parte de uma família.' });
      }
      
      const detalhes = await this.familiaService.getDetalhesFamilia(familiaId);

      return res.status(200).json({
        success: true,
        ...detalhes,
      });

    } catch (error) {
      console.error('❌ Erro ao buscar detalhes da família:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Altera o papel de um membro da família (apenas dono pode).
   */
  async alterarPapelMembro(req, res) {
    try {
      const usuarioLogado = req.user;
      const membroId = req.params.id;
      const { papel_detalhado } = req.body;

      console.log('🔍 Dados recebidos:', { usuarioLogado, membroId, papel_detalhado });

      if (!usuarioLogado.papel_detalhado || usuarioLogado.papel_detalhado !== 'dono') {
        return res.status(403).json({ success: false, error: 'Apenas o dono da família pode alterar o papel de membros.' });
      }
      if (usuarioLogado.id === membroId) {
        return res.status(400).json({ success: false, error: 'Você não pode alterar seu próprio papel.' });
      }
      if (!papel_detalhado) {
        return res.status(400).json({ success: false, error: 'Papel detalhado é obrigatório.' });
      }

      // Validar papel detalhado
      const papeisValidos = ['dono', 'pai', 'mae', 'filho', 'filha', 'avo', 'avó', 'neto', 'neta'];
      if (!papeisValidos.includes(papel_detalhado)) {
        return res.status(400).json({ success: false, error: 'Papel detalhado inválido.' });
      }

      // Determinar o papel baseado no papel_detalhado
      const papel = ['dono', 'pai', 'mae', 'avo', 'avó'].includes(papel_detalhado) ? 'responsavel' : 'dependente';

      await this.familiaService.alterarPapelMembro(usuarioLogado.familia_id, membroId, papel, papel_detalhado);
      return res.status(200).json({ success: true, message: 'Papel do membro alterado com sucesso.' });
    } catch (error) {
      console.error('❌ Erro ao alterar papel do membro:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Remove um membro da família (apenas dono pode).
   */
  async removerMembro(req, res) {
    try {
      const usuarioLogado = req.user;
      const membroId = req.params.id;

      if (!usuarioLogado.papel_detalhado || usuarioLogado.papel_detalhado !== 'dono') {
        return res.status(403).json({ success: false, error: 'Apenas o dono da família pode remover membros.' });
      }
      if (usuarioLogado.id === membroId) {
        return res.status(400).json({ success: false, error: 'Você não pode remover a si mesmo.' });
      }

      await this.familiaService.removerMembro(usuarioLogado.familia_id, membroId);
      return res.status(200).json({ success: true, message: 'Membro removido com sucesso.' });
    } catch (error) {
      console.error('❌ Erro ao remover membro:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Transfere o papel de dono para outro membro (apenas dono atual pode).
   */
  async transferirDono(req, res) {
    try {
      const usuarioLogado = req.user;
      const { novoDonoId } = req.body;

      if (!usuarioLogado.papel_detalhado || usuarioLogado.papel_detalhado !== 'dono') {
        return res.status(403).json({ success: false, error: 'Apenas o dono atual pode transferir o papel de dono.' });
      }
      if (usuarioLogado.id === novoDonoId) {
        return res.status(400).json({ success: false, error: 'Você já é o dono da família.' });
      }

      await this.familiaService.transferirDono(usuarioLogado.familia_id, novoDonoId, usuarioLogado.id);
      return res.status(200).json({ success: true, message: 'Papel de dono transferido com sucesso.' });
    } catch (error) {
      console.error('❌ Erro ao transferir dono:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}

export default FamiliaController; 