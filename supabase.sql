-- Execute uma vez no SQL Editor do projeto gratuito do Supabase.
-- Um documento JSON por usuário. A senha é gerenciada pelo Supabase Auth.
begin;
create table if not exists public.demandas_boards (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  document jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  constraint document_version check (document->>'version' = '1')
);
alter table public.demandas_boards enable row level security;
revoke all on public.demandas_boards from anon, authenticated;
grant select, insert, update on public.demandas_boards to authenticated;
drop policy if exists own_board_read on public.demandas_boards;
drop policy if exists own_board_create on public.demandas_boards;
drop policy if exists own_board_update on public.demandas_boards;
create policy own_board_read on public.demandas_boards for select to authenticated using ((select auth.uid()) = owner_id);
create policy own_board_create on public.demandas_boards for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy own_board_update on public.demandas_boards for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);

create or replace function public.save_demandas_board(expected_revision bigint, new_document jsonb)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare next_revision bigint;
begin
  if auth.uid() is null then raise exception 'Login necessário' using errcode = '42501'; end if;
  if expected_revision = 0 then
    insert into public.demandas_boards (owner_id, document, revision)
    values (auth.uid(), new_document, 1) on conflict do nothing returning revision into next_revision;
  else
    update public.demandas_boards set document = new_document, revision = revision + 1, updated_at = now()
    where owner_id = auth.uid() and revision = expected_revision returning revision into next_revision;
  end if;
  if next_revision is null then raise exception 'O quadro mudou em outro aparelho' using errcode = '40001'; end if;
  return next_revision;
end;
$$;
revoke all on function public.save_demandas_board(bigint,jsonb) from public, anon;
grant execute on function public.save_demandas_board(bigint,jsonb) to authenticated;
commit;
