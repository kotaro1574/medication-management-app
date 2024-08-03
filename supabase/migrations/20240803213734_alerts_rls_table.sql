-- RLSを有効にする
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- ログインしているユーザーのみが操作できるようにするポリシーを作成する
CREATE POLICY "Allow logged-in access" ON alerts
    FOR ALL
    USING (auth.uid() IS NOT NULL);

