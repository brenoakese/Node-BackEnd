import fetch from 'node-fetch';

async function testAlterarPapel() {
  try {
    console.log('🧪 Testando endpoint de alterar papel...');
    
    // Primeiro, fazer login para obter o token
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'teste@teste.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('📋 Resposta do login:', loginData);
    
    if (!loginData.token) {
      console.error('❌ Falha no login');
      return;
    }
    
    // Testar alterar papel do "Teste Mãe" para "mae"
    const alterarResponse = await fetch('http://localhost:3000/api/familias/membros/f4203368-a2c6-40de-af26-58cac404c73b/papel', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        papel_detalhado: 'mae'
      })
    });
    
    const alterarData = await alterarResponse.json();
    console.log('📋 Resposta da alteração:', alterarData);
    console.log('📊 Status:', alterarResponse.status);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testAlterarPapel(); 