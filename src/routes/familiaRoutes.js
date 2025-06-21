import express from 'express';
import FamiliaController from '../controller/familiaController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();
const familiaController = new FamiliaController();

// Todas as rotas de família requerem autenticação
router.use(authenticateToken);

// POST /api/familias - Criar uma nova família
router.post(
  '/familias', 
  familiaController.criarFamilia.bind(familiaController)
);

// POST /api/familias/join - Entrar em uma família com um código
router.post(
  '/familias/join', 
  familiaController.entrarEmFamilia.bind(familiaController)
);

// GET /api/familias/me - Obter detalhes da família do usuário logado
router.get(
  '/familias/me', 
  familiaController.getMinhaFamilia.bind(familiaController)
);

// PUT /api/familias/membros/:id/papel - Alterar papel de um membro
router.put(
  '/familias/membros/:id/papel',
  familiaController.alterarPapelMembro.bind(familiaController)
);

// DELETE /api/familias/membros/:id - Remover membro da família
router.delete(
  '/familias/membros/:id',
  familiaController.removerMembro.bind(familiaController)
);

// PUT /api/familias/dono - Transferir papel de dono
router.put(
  '/familias/dono',
  familiaController.transferirDono.bind(familiaController)
);

export default router; 