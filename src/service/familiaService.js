import crypto from 'crypto';
import FamiliaRepository from '../repository/familiaRepository.js';
import UserRepository from '../repository/userRepository.js';

class FamiliaService {
  constructor() {
    this.familiaRepository = new FamiliaRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * Gera um código de convite aleatório e único.
   * @returns {string} Código de 8 caracteres.
   */
  _gerarCodigoConvite() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  /**
   * Cria uma nova família e define o usuário criador como o primeiro responsável.
   * @param {string} nomeFamilia - O nome da nova família.
   * @param {string} usuarioId - O ID do usuário que está criando a família.
   * @returns {Promise<Familia>} A família criada.
   */
  async criarFamilia(nomeFamilia, usuarioId) {
    const usuario = await this.userRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }
    if (usuario.familia_id) {
      throw new Error('Usuário já pertence a uma família.');
    }

    const codigoConvite = this._gerarCodigoConvite();
    
    // Cria a família no banco
    const novaFamilia = await this.familiaRepository.create(nomeFamilia, codigoConvite);

    // Atualiza o usuário para vincular à família e definir o papel como dono
    await this.userRepository.updateFamilia(usuarioId, novaFamilia.id, 'responsavel', 'dono');

    return novaFamilia;
  }

  /**
   * Adiciona um usuário a uma família existente usando um código de convite.
   * @param {string} codigoConvite - O código para entrar na família.
   * @param {string} usuarioId - O ID do usuário que está entrando.
   * @returns {Promise<Familia>} A família à qual o usuário se juntou.
   */
  async entrarEmFamilia(codigoConvite, usuarioId) {
    const usuario = await this.userRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }
    if (usuario.familia_id) {
      throw new Error('Usuário já pertence a uma família.');
    }

    const familia = await this.familiaRepository.findByCodigo(codigoConvite);
    if (!familia) {
      throw new Error('Código de convite inválido ou família não encontrada.');
    }

    // Atualiza o usuário para vincular à família com o papel de dependente
    await this.userRepository.updateFamilia(usuarioId, familia.id, 'dependente', 'filho');

    return familia;
  }
  
  /**
   * Busca os detalhes e membros de uma família.
   * @param {string} familiaId - O ID da família do usuário logado.
   * @returns {Promise<Object>} Um objeto com os dados da família e a lista de membros.
   */
  async getDetalhesFamilia(familiaId) {
    if (!familiaId) {
      throw new Error("Usuário não está associado a nenhuma família.");
    }

    const membros = await this.familiaRepository.findMembrosByFamiliaId(familiaId);
    const familia = await this.familiaRepository.findById(familiaId);

    return {
      codigoConvite: familia?.codigo_convite || '',
      membros: membros
    };
  }

  /**
   * Altera o papel de um membro da família.
   * @param {string} familiaId
   * @param {string} membroId
   * @param {string} papel
   * @param {string} papel_detalhado
   */
  async alterarPapelMembro(familiaId, membroId, papel, papel_detalhado) {
    const membro = await this.userRepository.findById(membroId);
    if (!membro) throw new Error('Membro não encontrado.');
    if (membro.familia_id?.toString() !== familiaId?.toString()) {
      throw new Error('Este usuário não pertence à sua família.');
    }
    
    // Validar papel detalhado
    const papeisValidos = ['dono', 'pai', 'mae', 'filho', 'filha', 'avo', 'avó', 'neto', 'neta'];
    if (!papeisValidos.includes(papel_detalhado)) {
      throw new Error('Papel detalhado inválido.');
    }
    
    await this.userRepository.updatePapel(membroId, papel);
    await this.userRepository.updatePapelDetalhado(membroId, papel_detalhado);
    return true;
  }

  /**
   * Remove um membro da família.
   * @param {string} familiaId
   * @param {string} membroId
   */
  async removerMembro(familiaId, membroId) {
    const membro = await this.userRepository.findById(membroId);
    if (!membro) throw new Error('Membro não encontrado.');
    if (membro.familia_id?.toString() !== familiaId?.toString()) {
      throw new Error('Este usuário não pertence à sua família.');
    }
    // Remove vínculo com a família e papel
    await this.userRepository.updateFamilia(membroId, null, null, null);
    return true;
  }

  /**
   * Transfere o papel de dono para outro membro da família.
   * @param {string} familiaId
   * @param {string} novoDonoId
   * @param {string} donoAtualId
   */
  async transferirDono(familiaId, novoDonoId, donoAtualId) {
    const donoAtual = await this.userRepository.findById(donoAtualId);
    if (!donoAtual || !donoAtual.isDono()) {
      throw new Error('Apenas o dono atual pode transferir o papel de dono.');
    }
    
    const novoDono = await this.userRepository.findById(novoDonoId);
    if (!novoDono || novoDono.familia_id?.toString() !== familiaId?.toString()) {
      throw new Error('Novo dono deve pertencer à família.');
    }
    
    // Remove papel de dono do atual
    await this.userRepository.updatePapelDetalhado(donoAtualId, 'pai');
    
    // Define novo dono
    await this.userRepository.updatePapelDetalhado(novoDonoId, 'dono');
    
    return true;
  }
}

export default FamiliaService; 