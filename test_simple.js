import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
let authToken = null;

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

async function testarCriacaoMateria() {
  try {
    console.log('📚 Testando criação de matéria...');
    
    const response = await fetch(`${BASE_URL}/materias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        nome_materia: 'Teste Matemática'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Matéria criada com sucesso');
      console.log(`📖 Matéria: ${data.data.nome_materia} (ID: ${data.data.id})`);
    } else {
      console.log('❌ Erro ao criar matéria:', data.error);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

async function testarDuplicata() {
  try {
    console.log('🔄 Testando criação de matéria duplicada...');
    
    const response = await fetch(`${BASE_URL}/materias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        nome_materia: 'Teste Matemática'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('❌ Matéria duplicada foi criada (não deveria)');
    } else {
      console.log('✅ Erro esperado ao tentar criar duplicata:', data.error);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

async function runTest() {
  try {
    console.log('🧪 Iniciando teste simples...\n');
    
    await login();
    console.log('');
    
    await testarCriacaoMateria();
    console.log('');
    
    await testarDuplicata();
    console.log('');
    
    console.log('✅ Teste concluído');
  } catch (error) {
    console.error('💥 Teste falhou:', error.message);
  }
}

runTest(); 