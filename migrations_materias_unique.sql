-- Migration para adicionar constraint única na tabela materias
-- Execute este script no seu banco de dados PostgreSQL

-- 1. Adicionar constraint única para nome_materia + usuario_id
DO $$ 
BEGIN
    -- Verificar se a constraint já existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'materias' 
                   AND constraint_name = 'uk_materias_usuario_nome'
                   AND constraint_type = 'UNIQUE') THEN
        
        -- Adicionar constraint única
        ALTER TABLE materias 
        ADD CONSTRAINT uk_materias_usuario_nome 
        UNIQUE (usuario_id, nome_materia);
        
        RAISE NOTICE 'Constraint única adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Constraint única já existe';
    END IF;
END $$;

-- 2. Verificar se a constraint foi criada
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'materias' 
AND constraint_type = 'UNIQUE';

-- 3. Verificar se existem dados duplicados que precisam ser limpos
SELECT 
    usuario_id,
    nome_materia,
    COUNT(*) as quantidade
FROM materias 
GROUP BY usuario_id, nome_materia 
HAVING COUNT(*) > 1
ORDER BY quantidade DESC;

-- 4. Se houver duplicatas, você pode removê-las com:
-- DELETE FROM materias 
-- WHERE id NOT IN (
--     SELECT MIN(id) 
--     FROM materias 
--     GROUP BY usuario_id, nome_materia
-- ); 