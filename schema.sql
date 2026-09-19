-- Tempo — schema Postgres (Neon)
-- À exécuter une fois dans l'éditeur SQL de Neon.

create table if not exists events (
  id         text primary key,
  name       text not null,
  organizer  text,
  place      text,
  dates      jsonb not null,          -- ex. ["2026-09-20","2026-09-21"]
  criteria   text,
  mode       text,                    -- "single" | "range"
  created_at timestamptz not null default now()
);

create table if not exists responses (
  id         text primary key,
  event_id   text not null references events(id) on delete cascade,
  name       text not null,
  avail      jsonb not null,          -- ex. {"2026-09-20":"yes","2026-09-21":"maybe"}
  updated_at timestamptz not null default now()
);

create index if not exists responses_event_idx on responses(event_id);
