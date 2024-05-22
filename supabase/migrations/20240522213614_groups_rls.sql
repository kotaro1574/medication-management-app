-- RLSを有効にする
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- ログインしているユーザーのみが操作できるようにするポリシーを作成する
CREATE POLICY "Allow logged-in access" ON groups
    FOR ALL
    USING (auth.uid() IS NOT NULL);

