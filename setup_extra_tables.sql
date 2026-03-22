-- Tabela: system_notifications
CREATE TABLE IF NOT EXISTS public.system_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  time_label text DEFAULT 'agora',
  is_read boolean DEFAULT false,
  type text DEFAULT 'info' CHECK (type IN ('success', 'warning', 'info', 'alert', 'error')),
  created_at timestamptz DEFAULT now()
);

-- Tabela: node_activity
CREATE TABLE IF NOT EXISTS public.node_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  node text NOT NULL,
  latency integer NOT NULL,
  status text NOT NULL,
  load integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela: security_protocols
CREATE TABLE IF NOT EXISTS public.security_protocols (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  status text NOT NULL,
  last_check text NOT NULL,
  strength integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela: system_events
CREATE TABLE IF NOT EXISTS public.system_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_time text NOT NULL,
  event_description text NOT NULL,
  node text NOT NULL,
  type text DEFAULT 'ok' CHECK (type IN ('ok', 'warn', 'alert')),
  created_at timestamptz DEFAULT now()
);

-- Tabela: telemetry_metrics
CREATE TABLE IF NOT EXISTS public.telemetry_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  month_label text NOT NULL,
  value integer NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- INSERTS INICIAIS (Mock inicial para encher o banco com os mesmos dados da tela atual)
INSERT INTO public.system_notifications (title, message, time_label, is_read, type) VALUES
('Upload Concluído', 'Dados de Telemetria Quântica foram criptografados com sucesso.', '2m atrás', false, 'success'),
('Anomalia Detectada', 'Tentativa de acesso não autorizado no Nó #47. Protocolo de segurança ativado.', '15m atrás', false, 'warning'),
('Backup Completo', 'Sistema Alpha — backup realizado em todos os nós globais.', '1h atrás', true, 'info'),
('Certificado Renovado', 'Certificado SSL AES-256 renovado automaticamente.', '3h atrás', true, 'success');

INSERT INTO public.node_activity (node, latency, status, load) VALUES
('São Paulo', 12, 'online', 78),
('Rio de Janeiro', 18, 'online', 55),
('Frankfurt', 94, 'online', 41),
('Nova York', 128, 'online', 62),
('Tóquio', 201, 'degradado', 89),
('Sydney', 245, 'online', 33);

INSERT INTO public.security_protocols (name, status, last_check, strength) VALUES
('AES-256 Criptografia', 'Ativo', '21 Mar, 2024', 100),
('Autenticação 2FA', 'Ativo', '21 Mar, 2024', 95),
('Firewall Quântico', 'Ativo', '20 Mar, 2024', 88),
('HSM Hardware Key', 'Ativo', '19 Mar, 2024', 100),
('Auditoria de Logs', 'Ativo', '21 Mar, 2024', 92),
('Isolamento de Rede', 'Manutenção', '18 Mar, 2024', 75);

INSERT INTO public.system_events (event_time, event_description, node, type) VALUES
('17:58:12', 'Checkpoint de sincronização concluído', 'São Paulo', 'ok'),
('17:57:44', 'Pico de throughput detectado — 920 GB/s', 'Frankfurt', 'warn'),
('17:56:01', 'Novo arquivo criptografado: ARC-2024-011', 'São Paulo', 'ok'),
('17:54:33', 'Latência elevada no nó Tóquio', 'Tóquio', 'warn'),
('17:53:10', 'Replicação de dados concluída em 6 nós', 'Global', 'ok'),
('17:51:20', 'Backup automático iniciado — Sistema Alpha', 'Rio de Janeiro', 'ok'),
('17:49:05', 'Tentativa de acesso bloqueada pelo Firewall Quântico', 'Nova York', 'alert'),
('17:47:58', 'Certificado SSL verificado e válido', 'Global', 'ok');

INSERT INTO public.telemetry_metrics (month_label, value, order_index) VALUES
('Out', 420, 1),
('Nov', 380, 2),
('Dez', 510, 3),
('Jan', 490, 4),
('Fev', 620, 5),
('Mar', 580, 6),
('Abr', 710, 7),
('Mai', 680, 8),
('Jun', 750, 9),
('Jul', 820, 10),
('Ago', 790, 11),
('Set', 860, 12);

-- Permissões básicas
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso publico read" ON public.system_notifications FOR SELECT USING (true);
CREATE POLICY "Acesso publico read" ON public.node_activity FOR SELECT USING (true);
CREATE POLICY "Acesso publico read" ON public.security_protocols FOR SELECT USING (true);
CREATE POLICY "Acesso publico read" ON public.system_events FOR SELECT USING (true);
CREATE POLICY "Acesso publico read" ON public.telemetry_metrics FOR SELECT USING (true);
