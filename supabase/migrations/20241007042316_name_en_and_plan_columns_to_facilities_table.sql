-- enum型を作成
do $$ begin
    if not exists (select 1 from pg_type where typname = 'plan_type') then
        create type plan_type as enum ('松', '竹', '梅');
    end if;
end $$;

-- facilitiesテーブルにplanカラムを追加
alter table public.facilities
    rename column name to name_jp;

alter table public.facilities
    add column name_en varchar(255) not null,
    add column plan plan_type not null,
    add constraint unique_name_jp unique (name_jp),
    add constraint unique_name_en unique (name_en);
