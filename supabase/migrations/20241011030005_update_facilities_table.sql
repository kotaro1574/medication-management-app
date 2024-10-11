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
    add column email varchar(255),
    add column name_en varchar(255) not null,
    add column plan plan_type not null,
    add constraint unique_name_jp unique (name_jp),
    add constraint unique_name_en unique (name_en);

-- 既存の行に一意のメールアドレスを設定
-- この例では、施設IDを使用して一意のメールアドレスを生成します
update public.facilities
set email = concat('facility', id, '@example.com')
where email is null;

-- not null制約を追加
alter table public.facilities
    alter column email set not null,
-- メールアドレスの一意性を確保するためのUNIQUE制約を追加（オプション）
    add constraint unique_email unique (email);

-- profilesテーブルのfacility_idカラムに外部キー制約を追加
alter table public.profiles
    add constraint fk_profiles_facility
    foreign key (facility_id)
    references public.facilities (id);

-- 既存のポリシーを削除
drop policy if exists "Allow select for all users" on facilities;
drop policy if exists "Allow insert for authenticated users" on facilities;
drop policy if exists "Allow update for authenticated users" on facilities;
drop policy if exists "Allow delete for authenticated users" on facilities;

-- rlsの有効化
alter table facilities enable row level security;

-- select操作用のポリシー: すべてのユーザーがレコードを閲覧可能
create policy "Allow select for all users" on facilities
for select
using (true);

-- insert操作用のポリシー: すべてのユーザーがレコードを挿入可能
create policy "Allow insert for all users" on facilities
for insert
with check (true);

-- update操作用のポリシー: すべてのユーザーがレコードを更新可能
create policy "Allow update for all users" on facilities
for update
using (true)
with check (true);

-- delete操作用のポリシー: すべてのユーザーがレコードを削除可能
create policy "Allow delete for all users" on facilities
for delete
using (true);