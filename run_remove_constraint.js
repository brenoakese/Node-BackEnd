import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function removeDuplicateConstraint() {
  try {
    console.log('🚀 Removendo constraint duplicada...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'remove_duplicate_constraint.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Executando script...');
    
    // Executar o script
    await db.query(sqlContent);
    
    console.log('✅ Constraint duplicada removida com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao remover constraint:', error);
  }
}

removeDuplicateConstraint(); 