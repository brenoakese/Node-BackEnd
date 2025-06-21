-- Migração para criar tabelas de matérias e tarefas
-- Execute este arquivo para adicionar as novas funcionalidades

-- Tabela de matérias (cada usuário pode ter suas próprias matérias)
CREATE TABLE IF NOT EXISTS public.materias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_materia VARCHAR(100) NOT NULL,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nome_materia, usuario_id) -- Evita matérias duplicadas para o mesmo usuário
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    data_entrega DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida')),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    materia_id UUID NOT NULL REFERENCES public.materias(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_materias_usuario_id ON public.materias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario_id ON public.tarefas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_materia_id ON public.tarefas(materia_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_data_entrega ON public.tarefas(data_entrega);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
DROP TRIGGER IF EXISTS update_materias_updated_at ON public.materias;
CREATE TRIGGER update_materias_updated_at 
    BEFORE UPDATE ON public.materias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tarefas_updated_at ON public.tarefas;
CREATE TRIGGER update_tarefas_updated_at 
    BEFORE UPDATE ON public.tarefas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.materias IS 'Tabela para armazenar as matérias personalizadas de cada usuário';
COMMENT ON TABLE public.tarefas IS 'Tabela para armazenar as tarefas dos usuários';
COMMENT ON COLUMN public.materias.usuario_id IS 'ID do usuário que possui esta matéria';
COMMENT ON COLUMN public.tarefas.usuario_id IS 'ID do usuário que criou/possui esta tarefa';
COMMENT ON COLUMN public.tarefas.materia_id IS 'ID da matéria relacionada à tarefa';
COMMENT ON COLUMN public.tarefas.status IS 'Status da tarefa: pendente ou concluida'; 