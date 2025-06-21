import db from './src/config/db.js';

async function runMigration() {
  try {
    console.log('🚀 Iniciando migration...');
    
    // 1. Adicionar campo papel_detalhado na tabela usuarios
    console.log('📝 Adicionando campo papel_detalhado...');
    await db.query(`
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS papel_detalhado VARCHAR(20);
    `);
    
    // 2. Atualizar papel_detalhado baseado no papel atual
    console.log('📝 Atualizando papel_detalhado...');
    await db.query(`
      UPDATE usuarios 
      SET papel_detalhado = CASE 
          WHEN papel = 'responsavel' THEN 'pai'
          WHEN papel = 'dependente' THEN 'filho'
          ELSE papel
      END
      WHERE papel_detalhado IS NULL;
    `);
    
    // 3. Adicionar campo codigo_convite na tabela familias (se não existir)
    console.log('📝 Adicionando campo codigo_convite...');
    await db.query(`
      ALTER TABLE familias ADD COLUMN IF NOT EXISTS codigo_convite VARCHAR(8);
    `);
    
    // 4. Gerar códigos de convite para famílias que não têm
    console.log('📝 Gerando códigos de convite...');
    await db.query(`
      UPDATE familias 
      SET codigo_convite = substring(md5(random()::text) for 8)
      WHERE codigo_convite IS NULL OR codigo_convite = '';
    `);
    
    // 5. Definir o primeiro responsável de cada família como 'dono'
    console.log('📝 Definindo donos das famílias...');
    await db.query(`
      UPDATE usuarios 
      SET papel_detalhado = 'dono'
      WHERE id IN (
          SELECT DISTINCT ON (familia_id) id 
          FROM usuarios 
          WHERE familia_id IS NOT NULL 
          AND papel = 'responsavel'
          ORDER BY familia_id, created_at ASC
      );
    `);
    
    // 6. Adicionar índices para melhor performance
    console.log('📝 Criando índices...');
    await db.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_familia_id ON usuarios(familia_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_papel ON usuarios(papel);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_papel_detalhado ON usuarios(papel_detalhado);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_familias_codigo_convite ON familias(codigo_convite);`);
    
    // 7. Verificar se tudo foi aplicado
    console.log('📝 Verificando alterações...');
    const result = await db.query(`
      SELECT 
          'usuarios' as tabela,
          column_name,
          data_type
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      AND column_name IN ('familia_id', 'papel', 'papel_detalhado')
      ORDER BY column_name;
    `);
    
    console.log('✅ Migration executada com sucesso!');
    console.log('📋 Resumo das alterações:');
    console.log('   - Campo papel_detalhado adicionado à tabela usuarios');
    console.log('   - Campo codigo_convite adicionado à tabela familias');
    console.log('   - Códigos de convite gerados para famílias existentes');
    console.log('   - Primeiros responsáveis definidos como donos');
    console.log('   - Índices criados para melhor performance');
    console.log('📊 Colunas encontradas:', result.rows);
    
  } catch (error) {
    console.error('❌ Erro na migration:', error);
  } finally {
    // Fechar o pool corretamente
    if (db && db.pool) {
      await db.pool.end();
      console.log('🔌 Conexão com o banco fechada.');
    }
  }
}

runMigration(); 