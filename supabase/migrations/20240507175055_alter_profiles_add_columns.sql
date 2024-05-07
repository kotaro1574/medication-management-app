alter table profiles
  alter column name set not null,
  add column facility_id uuid not null,
  add column created_at timestamptz not null default current_timestamp;
