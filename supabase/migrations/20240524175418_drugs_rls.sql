-- RLSを有効にする
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;

-- ログインしているユーザーのみが操作できるようにするポリシーを作成する
CREATE POLICY "Allow logged-in access" ON drugs
    FOR ALL
    USING (auth.uid() IS NOT NULL);

