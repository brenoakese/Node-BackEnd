import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
let authToken = null;
let userId = null;
let materiaId = null;
let tarefaId = null;

async function login() {
  try {
    console.log('🔐 Fazendo login...');
    
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'teste@teste.com',
        password: '12345678'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      authToken = data.token;
      userId = data.user.id;
      console.log('✅ Login realizado com sucesso');
      console.log(`👤 Usuário: ${data.user.name} (${data.user.papel_detalhado})`);
    } else {
      throw new Error(data.error || 'Erro no login');
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    throw error;
  }
}

async function criarMateria() {
  try {
    console.log('📚 Criando matéria...');
    
    // Gerar nome único para evitar conflitos
    const timestamp = Date.now();
    const nomeMateria = `Matemática_${timestamp}`;
    
    const response = await fetch(`${BASE_URL}/materias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        nome_materia: nomeMateria
      })
    });

    const data = await response.json();
    
    if (data.success) {
      materiaId = data.data.id;
      console.log('✅ Matéria criada com sucesso');
      console.log(`📖 Matéria: ${data.data.nome_materia} (ID: ${data.data.id})`);
    } else {
      throw new Error(data.error || 'Erro ao criar matéria');
    }
  } catch (error) {
    console.error('❌ Erro ao criar matéria:', error.message);
    throw error;
  }
}

async function buscarMaterias() {
  try {
    console.log('🔍 Buscando matérias...');
    
    const response = await fetch(`${BASE_URL}/materias/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Matérias encontradas:');
      data.data.forEach(materia => {
        console.log(`   - ${materia.nome_materia} (ID: ${materia.id})`);
      });
    } else {
      throw new Error(data.error || 'Erro ao buscar matérias');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar matérias:', error.message);
    throw error;
  }
}

async function criarTarefa() {
  try {
    console.log('📝 Criando tarefa...');
    
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataEntrega = amanha.toISOString().split('T')[0];
    
    const response = await fetch(`${BASE_URL}/tarefas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        titulo: 'Resolver exercícios da página 50',
        data_entrega: dataEntrega,
        materia_id: materiaId
      })
    });

    const data = await response.json();
    
    if (data.success) {
      tarefaId = data.data.id;
      console.log('✅ Tarefa criada com sucesso');
      console.log(`📋 Tarefa: ${data.data.titulo}`);
      console.log(`📅 Entrega: ${data.data.data_entrega}`);
      console.log(`📖 Matéria: ${data.data.materia.nome_materia}`);
    } else {
      throw new Error(data.error || 'Erro ao criar tarefa');
    }
  } catch (error) {
    console.error('❌ Erro ao criar tarefa:', error.message);
    throw error;
  }
}

async function buscarTarefas() {
  try {
    console.log('🔍 Buscando tarefas...');
    
    const response = await fetch(`${BASE_URL}/tarefas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Tarefas encontradas:');
      data.data.forEach(tarefa => {
        console.log(`   - ${tarefa.titulo} (${tarefa.status})`);
        console.log(`     Matéria: ${tarefa.materia.nome_materia}`);
        console.log(`     Entrega: ${tarefa.data_entrega}`);
      });
    } else {
      throw new Error(data.error || 'Erro ao buscar tarefas');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar tarefas:', error.message);
    throw error;
  }
}

async function marcarTarefaConcluida() {
  try {
    console.log('✅ Marcando tarefa como concluída...');
    
    const response = await fetch(`${BASE_URL}/tarefas/${tarefaId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        status: 'concluida'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Tarefa marcada como concluída');
      console.log(`📋 Tarefa: ${data.data.titulo} (${data.data.status})`);
    } else {
      throw new Error(data.error || 'Erro ao marcar tarefa como concluída');
    }
  } catch (error) {
    console.error('❌ Erro ao marcar tarefa como concluída:', error.message);
    throw error;
  }
}

async function runTests() {
  try {
    console.log('🧪 Iniciando testes do sistema de tarefas...\n');
    
    await login();
    console.log('');
    
    await criarMateria();
    console.log('');
    
    await buscarMaterias();
    console.log('');
    
    await criarTarefa();
    console.log('');
    
    await buscarTarefas();
    console.log('');
    
    await marcarTarefaConcluida();
    console.log('');
    
    await buscarTarefas();
    console.log('');
    
    console.log('🎉 Todos os testes passaram com sucesso!');
    
  } catch (error) {
    console.error('💥 Teste falhou:', error.message);
    process.exit(1);
  }
}

runTests(); 