# Sistema de Tarefas - Documentação

## Visão Geral

O sistema de tarefas permite que os usuários gerenciem suas tarefas diárias, especialmente voltadas para deveres de casa e atividades escolares. O sistema é baseado em um modelo hierárquico onde:

- **Responsáveis** (dono, pai, mãe, etc.) podem configurar matérias personalizadas para cada dependente
- **Dependentes** (filhos, filhas, etc.) podem criar e gerenciar suas próprias tarefas usando as matérias configuradas

## Estrutura do Banco de Dados

### Tabela `materias`
```sql
CREATE TABLE materias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_materia VARCHAR(100) NOT NULL,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nome_materia, usuario_id)
);
```

### Tabela `tarefas`
```sql
CREATE TABLE tarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    data_entrega DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida')),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    materia_id UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Endpoints da API

### Matérias

#### POST `/api/materias`
Cria uma nova matéria para o usuário logado ou para um dependente (se for responsável).

**Body:**
```json
{
  "nome_materia": "Matemática",
  "usuario_id": "uuid-opcional" // Se não informado, usa o usuário logado
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome_materia": "Matemática",
    "usuario_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Matéria criada com sucesso"
}
```

#### GET `/api/materias/me`
Busca todas as matérias do usuário logado.

#### GET `/api/materias/usuario/:usuarioId`
Busca matérias de um usuário específico (apenas para responsáveis).

#### PUT `/api/materias/:id`
Atualiza uma matéria existente.

**Body:**
```json
{
  "nome_materia": "Matemática Avançada"
}
```

#### DELETE `/api/materias/:id`
Remove uma matéria (apenas se não houver tarefas associadas).

#### POST `/api/materias/dependente/:usuarioId`
Cria múltiplas matérias para um dependente de uma vez.

**Body:**
```json
{
  "nomes_materias": ["Matemática", "Português", "Ciências", "História"]
}
```

### Tarefas

#### POST `/api/tarefas`
Cria uma nova tarefa.

**Body:**
```json
{
  "titulo": "Resolver exercícios da página 50",
  "data_entrega": "2024-01-15",
  "materia_id": "uuid-da-materia"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "titulo": "Resolver exercícios da página 50",
    "data_entrega": "2024-01-15",
    "status": "pendente",
    "usuario_id": "uuid",
    "materia_id": "uuid",
    "materia": {
      "id": "uuid",
      "nome_materia": "Matemática"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Tarefa criada com sucesso"
}
```

#### GET `/api/tarefas`
Busca todas as tarefas do usuário logado.

#### PUT `/api/tarefas/:id/status`
Atualiza o status de uma tarefa.

**Body:**
```json
{
  "status": "concluida" // ou "pendente"
}
```

#### DELETE `/api/tarefas/:id`
Remove uma tarefa.

## Fluxo de Uso

### 1. Configuração Inicial (Responsável)
1. O responsável acessa a tela "Gerenciar Matérias"
2. Seleciona um dependente da lista
3. Adiciona as matérias específicas daquele dependente (ex: "Matemática", "Português", "Ciências")

### 2. Criação de Tarefas (Dependente)
1. O dependente acessa a tela "Tarefas"
2. Clica no botão "+" para adicionar uma nova tarefa
3. Preenche:
   - Título da tarefa
   - Data de entrega
   - Seleciona uma das matérias configuradas pelo responsável
4. Salva a tarefa

### 3. Gerenciamento de Tarefas
- O dependente pode marcar tarefas como "concluídas"
- Pode visualizar tarefas pendentes e concluídas
- Pode deletar tarefas se necessário

## Permissões

### Responsáveis (dono, pai, mãe, avô, avó)
- ✅ Criar matérias para si mesmos
- ✅ Criar matérias para dependentes
- ✅ Visualizar matérias de dependentes
- ✅ Editar/deletar suas próprias matérias
- ✅ Criar tarefas para si mesmos
- ✅ Visualizar tarefas de dependentes (futuro)

### Dependentes (filho, filha, neto, neta)
- ✅ Criar matérias para si mesmos
- ✅ Visualizar suas próprias matérias
- ✅ Editar/deletar suas próprias matérias
- ✅ Criar tarefas para si mesmos
- ✅ Visualizar suas próprias tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Deletar suas próprias tarefas

## Instalação e Configuração

### 1. Executar Migração
```bash
node run_migration_tarefas.js
```

### 2. Testar Funcionalidade
```bash
node test_tarefas.js
```

### 3. Verificar Endpoints
```bash
# Verificar se o servidor está rodando
curl http://localhost:3000/api/health

# Testar login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456"}'
```

## Validações

### Matérias
- Nome da matéria: obrigatório, 1-100 caracteres
- Usuário ID: UUID válido
- Nome único por usuário

### Tarefas
- Título: obrigatório, 1-255 caracteres
- Data de entrega: obrigatória, formato ISO 8601 (YYYY-MM-DD)
- Matéria ID: UUID válido, deve pertencer ao usuário
- Status: "pendente" ou "concluida"

## Tratamento de Erros

Todos os endpoints retornam respostas padronizadas:

**Sucesso:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso"
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Descrição do erro",
  "details": [...] // Detalhes de validação (se aplicável)
}
```

## Próximos Passos

1. **Implementar notificações** para tarefas vencidas
2. **Adicionar filtros** por matéria, status e data
3. **Implementar relatórios** de progresso
4. **Adicionar anexos** às tarefas
5. **Implementar lembretes** automáticos
6. **Adicionar comentários** nas tarefas 