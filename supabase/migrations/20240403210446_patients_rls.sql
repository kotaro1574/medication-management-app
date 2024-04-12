alter table patients enable row level security;

-- SELECT操作用のポリシー: ログインしているユーザーのみがレコードを閲覧可能
create policy "Allow select for authenticated users" on patients
for select
using (auth.uid() is not null);

-- INSERT操作用のポリシー: ログインしているユーザーがレコードを挿入可能
create policy "Allow insert for authenticated users" on patients
for insert
with check (auth.uid() is not null);

-- UPDATE操作用のポリシー: ログインしているユーザーがレコードを更新可能
create policy "Allow update for authenticated users" on patients
for update
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- DELETE操作用のポリシー: ログインしているユーザーがレコードを削除可能
create policy "Allow delete for authenticated users" on patients
for delete
using (auth.uid() is not null);
