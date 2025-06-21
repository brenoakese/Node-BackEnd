-- Migração para adicionar suporte a famílias
-- Execute este script no seu banco de dados PostgreSQL

-- 1. Adicionar colunas familia_id e papel na tabela usuarios (se não existirem)
DO $$ 
BEGIN
    -- Adicionar coluna familia_id se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'usuarios' AND column_name = 'familia_id') THEN
        ALTER TABLE usuarios ADD COLUMN familia_id UUID;
    END IF;
    
    -- Adicionar coluna papel se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'usuarios' AND column_name = 'papel') THEN
        ALTER TABLE usuarios ADD COLUMN papel VARCHAR(20);
    END IF;
END $$;

-- 2. Criar tabela familias
CREATE TABLE IF NOT EXISTS familias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    codigo_convite VARCHAR(8) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Adicionar foreign key na tabela usuarios (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_usuarios_familia') THEN
        ALTER TABLE usuarios 
        ADD CONSTRAINT fk_usuarios_familia 
        FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_familia_id ON usuarios(familia_id);
CREATE INDEX IF NOT EXISTS idx_familias_codigo_convite ON familias(codigo_convite);

-- 5. Adicionar constraint para valores válidos de papel
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                   WHERE constraint_name = 'chk_usuarios_papel') THEN
        ALTER TABLE usuarios 
        ADD CONSTRAINT chk_usuarios_papel 
        CHECK (papel IN ('responsavel', 'dependente') OR papel IS NULL);
    END IF;
END $$;

-- Verificar se as migrações foram aplicadas com sucesso
SELECT 
    'usuarios' as tabela,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name IN ('familia_id', 'papel')
ORDER BY column_name;

SELECT 
    'familias' as tabela,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'familias'
ORDER BY column_name;

-- Migration para adicionar papel_detalhado e gerar códigos de convite
-- Execute este script no seu banco PostgreSQL

-- 1. Adicionar campo papel_detalhado na tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS papel_detalhado VARCHAR(20);

-- 2. Atualizar papel_detalhado baseado no papel atual
UPDATE usuarios 
SET papel_detalhado = CASE 
    WHEN papel = 'responsavel' THEN 'pai'
    WHEN papel = 'dependente' THEN 'filho'
    ELSE papel
END
WHERE papel_detalhado IS NULL;

-- 3. Adicionar campo codigo_convite na tabela familias (se não existir)
ALTER TABLE familias ADD COLUMN IF NOT EXISTS codigo_convite VARCHAR(8);

-- 4. Gerar códigos de convite para famílias que não têm
UPDATE familias 
SET codigo_convite = substring(md5(random()::text) for 8)
WHERE codigo_convite IS NULL OR codigo_convite = '';

-- 5. Definir o primeiro responsável de cada família como 'dono'
UPDATE usuarios 
SET papel_detalhado = 'dono'
WHERE id IN (
    SELECT DISTINCT ON (familia_id) id 
    FROM usuarios 
    WHERE familia_id IS NOT NULL 
    AND papel = 'responsavel'
    ORDER BY familia_id, created_at ASC
);

-- 6. Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_familia_id ON usuarios(familia_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_papel ON usuarios(papel);
CREATE INDEX IF NOT EXISTS idx_usuarios_papel_detalhado ON usuarios(papel_detalhado);
CREATE INDEX IF NOT EXISTS idx_familias_codigo_convite ON familias(codigo_convite); 