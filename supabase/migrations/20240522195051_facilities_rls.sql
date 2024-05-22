ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- SELECT操作用のポリシー: すべてのユーザーがレコードを閲覧可能
CREATE POLICY "Allow select for all users" ON facilities
FOR SELECT
USING (true);

-- INSERT操作用のポリシー: ログインしているユーザーがレコードを挿入可能
CREATE POLICY "Allow insert for authenticated users" ON facilities
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE操作用のポリシー: ログインしているユーザーがレコードを更新可能
CREATE POLICY "Allow update for authenticated users" ON facilities
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- DELETE操作用のポリシー: ログインしているユーザーがレコードを削除可能
CREATE POLICY "Allow delete for authenticated users" ON facilities
FOR DELETE
USING (auth.uid() IS NOT NULL);
