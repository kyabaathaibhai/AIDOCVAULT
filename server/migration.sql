create table public.documents (
  id uuid primary key,
  name text,
  type text,
  size bigint,
  createdAt bigint,
  status text,
  originalContent text,
  summary text,
  markdown text,
  error text,
  isbinary boolean
);

alter table public.documents disable row level security;