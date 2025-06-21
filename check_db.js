import db from './src/config/db.js';

async function checkDatabase() {
  try {
    console.log('🔍 Verificando estrutura do banco de dados...');
    
    // Verificar se a constraint única existe
    const constraintQuery = `
      SELECT 
        constraint_name,
        constraint_type,
        table_name
      FROM information_schema.table_constraints 
      WHERE table_name = 'materias' 
      AND constraint_type = 'UNIQUE';
    `;
    
    const constraintResult = await db.query(constraintQuery);
    console.log('📋 Constraints únicas na tabela materias:');
    console.log(constraintResult.rows);
    
    // Verificar estrutura da tabela materias
    const tableQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'materias'
      ORDER BY ordinal_position;
    `;
    
    const tableResult = await db.query(tableQuery);
    console.log('\n📋 Estrutura da tabela materias:');
    console.log(tableResult.rows);
    
    // Verificar se existem dados na tabela
    const dataQuery = `
      SELECT COUNT(*) as total_materias FROM materias;
    `;
    
    const dataResult = await db.query(dataQuery);
    console.log(`\n📊 Total de matérias no banco: ${dataResult.rows[0].total_materias}`);
    
    // Verificar se existem duplicatas
    const duplicateQuery = `
      SELECT 
        usuario_id,
        nome_materia,
        COUNT(*) as quantidade
      FROM materias 
      GROUP BY usuario_id, nome_materia 
      HAVING COUNT(*) > 1
      ORDER BY quantidade DESC;
    `;
    
    const duplicateResult = await db.query(duplicateQuery);
    console.log('\n🔄 Duplicatas encontradas:');
    console.log(duplicateResult.rows);
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error);
  } finally {
    if (db && db.pool) {
      await db.pool.end();
      console.log('🔌 Conexão fechada.');
    }
  }
}

checkDatabase(); 