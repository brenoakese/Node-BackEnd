import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migration para constraint única de matérias...');
    
    // Ler o arquivo de migration
    const migrationPath = path.join(__dirname, 'migrations_materias_unique.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executando migration...');
    
    // Executar a migration
    await db.query(migrationSQL);
    
    console.log('✅ Migration executada com sucesso!');
    console.log('🔒 Constraint única adicionada para evitar duplicatas de matérias por usuário');
    
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    process.exit(1);
  }
}

runMigration(); 