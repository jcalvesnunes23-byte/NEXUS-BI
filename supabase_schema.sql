-- Tabela de Perfis de Usuário
create table public.profiles (
  id uuid references auth.users not null primary key,
  is_pro boolean default false,
  import_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar Row Level Security (Segurança)
alter table public.profiles enable row level security;

-- Políticas de RLS para Perfis
create policy "Usuários podem ver o próprio perfil"
  on profiles for select
  using ( auth.uid() = id );

create policy "Usuários podem atualizar seus próprios perfis"
  on profiles for update
  using ( auth.uid() = id );

-- Criação automática de perfil ao se cadastrar
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, is_pro, import_count)
  values (new.id, false, 0);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Tabela do Sistema de Arquivos (opcional)
create table public.files (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  parent_id uuid references public.files(id) null,
  name text not null,
  type text not null check (type in ('folder', 'file')),
  data jsonb null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.files enable row level security;

create policy "Usuários podem ver seus próprios arquivos"
  on files for select
  using ( auth.uid() = user_id );

create policy "Usuários podem inserir seus próprios arquivos"
  on files for insert
  with check ( auth.uid() = user_id );

create policy "Usuários podem atualizar seus próprios arquivos"
  on files for update
  using ( auth.uid() = user_id );

create policy "Usuários podem deletar seus próprios arquivos"
  on files for delete
  using ( auth.uid() = user_id );
