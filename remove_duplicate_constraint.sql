-- Remover constraint duplicada
-- Execute este script no seu banco de dados PostgreSQL

-- 1. Remover nossa constraint personalizada (já existe uma padrão)
DO $$ 
BEGIN
    -- Verificar se a constraint existe antes de tentar removê-la
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'materias' 
               AND constraint_name = 'uk_materias_usuario_nome'
               AND constraint_type = 'UNIQUE') THEN
        
        -- Remover constraint personalizada
        ALTER TABLE materias 
        DROP CONSTRAINT uk_materias_usuario_nome;
        
        RAISE NOTICE 'Constraint duplicada removida com sucesso';
    ELSE
        RAISE NOTICE 'Constraint personalizada não existe';
    END IF;
END $$;

-- 2. Verificar constraints restantes
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'materias' 
AND constraint_type = 'UNIQUE'; 