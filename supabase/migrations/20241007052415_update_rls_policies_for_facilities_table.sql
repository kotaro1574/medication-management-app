-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Allow select for all users" ON facilities;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON facilities;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON facilities;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON facilities;

-- RLSの有効化
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- SELECT操作用のポリシー: すべてのユーザーがレコードを閲覧可能
CREATE POLICY "Allow select for all users" ON facilities
FOR SELECT
USING (true);

-- INSERT操作用のポリシー: すべてのユーザーがレコードを挿入可能
CREATE POLICY "Allow insert for all users" ON facilities
FOR INSERT
WITH CHECK (true);

-- UPDATE操作用のポリシー: すべてのユーザーがレコードを更新可能
CREATE POLICY "Allow update for all users" ON facilities
FOR UPDATE
USING (true)
WITH CHECK (true);

-- DELETE操作用のポリシー: すべてのユーザーがレコードを削除可能
CREATE POLICY "Allow delete for all users" ON facilities
FOR DELETE
USING (true);
