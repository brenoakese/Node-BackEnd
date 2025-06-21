import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migração das tabelas de matérias e tarefas...');
    
    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations_tarefas.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executando SQL de migração...');
    
    // Executar a migração
    await db.query(migrationSQL);
    
    console.log('✅ Migração executada com sucesso!');
    console.log('📋 Tabelas criadas:');
    console.log('   - materias');
    console.log('   - tarefas');
    console.log('   - Índices e triggers');
    
    // Verificar se as tabelas foram criadas
    const materiasCheck = await db.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'materias')");
    const tarefasCheck = await db.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tarefas')");
    
    if (materiasCheck.rows[0].exists && tarefasCheck.rows[0].exists) {
      console.log('✅ Verificação: Tabelas criadas corretamente');
    } else {
      console.log('❌ Erro: Algumas tabelas não foram criadas');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    // O pool de conexões do PostgreSQL não precisa ser fechado manualmente
    console.log('🔌 Conexão com banco mantida (pool de conexões)');
  }
}

// Executar a migração
runMigration(); 