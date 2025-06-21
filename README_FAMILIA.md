# Implementação de Funcionalidades de Família

Este documento descreve as mudanças implementadas para adicionar suporte a famílias no backend.

## Arquivos Criados/Modificados

### Novos Arquivos:
- `src/models/Familia.js` - Modelo da família
- `src/repository/familiaRepository.js` - Repository para operações de família
- `src/service/familiaService.js` - Service com lógica de negócio
- `src/controller/familiaController.js` - Controller para endpoints de família
- `src/routes/familiaRoutes.js` - Rotas de família
- `migrations.sql` - Script de migração do banco de dados

### Arquivos Modificados:
- `src/models/User.js` - Adicionados campos `familia_id` e `papel`
- `src/repository/userRepository.js` - Adicionado método `updateFamilia`
- `src/middleware/auth.js` - Incluídos campos de família no `req.user`
- `src/app.js` - Adicionadas rotas de família

## Migração do Banco de Dados

Antes de executar o servidor, execute o script de migração:

```bash
# Conecte ao seu banco PostgreSQL e execute:
psql -U seu_usuario -d seu_banco -f migrations.sql
```

Ou execute o script diretamente no seu cliente PostgreSQL.

## Novos Endpoints

### POST /api/familias
Cria uma nova família.
```json
{
  "nome": "Família Silva"
}
```

### POST /api/familias/join
Entra em uma família usando código de convite.
```json
{
  "codigo_convite": "ABC12345"
}
```

### GET /api/familias/me
Obtém detalhes da família do usuário logado.

## Estrutura do Banco

### Tabela `familias`:
- `id` (UUID, PK)
- `nome` (VARCHAR(255))
- `codigo_convite` (VARCHAR(8), UNIQUE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela `usuarios` (modificada):
- Adicionado `familia_id` (UUID, FK para familias.id)
- Adicionado `papel` (VARCHAR(20)) - valores: 'responsavel', 'dependente'

## Funcionalidades Implementadas

1. **Criar Família**: Usuário pode criar uma nova família e se torna responsável
2. **Entrar em Família**: Usuário pode entrar em família existente usando código de convite
3. **Visualizar Família**: Usuário pode ver detalhes da sua família e membros
4. **Códigos de Convite**: Geração automática de códigos únicos de 8 caracteres
5. **Papéis**: Sistema de papéis (responsável/dependente) para controle de permissões

## Testando

Após executar as migrações, você pode testar os endpoints:

1. Registre um usuário: `POST /api/auth/register`
2. Faça login: `POST /api/auth/login`
3. Crie uma família: `POST /api/familias`
4. Veja sua família: `GET /api/familias/me`

## Compatibilidade com Frontend

As implementações são compatíveis com o frontend React Native/Expo que já estava fazendo chamadas para estes endpoints. 