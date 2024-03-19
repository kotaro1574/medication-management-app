create table
patients (
id uuid primary key default uuid_generate_v4(),
name text,
created_at timestamptz default now()
);
