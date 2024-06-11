-- RLSを有効にする
ALTER TABLE faces ENABLE ROW LEVEL SECURITY;

-- ログインしているユーザーのみが操作できるようにするポリシーを作成する
CREATE POLICY "Allow logged-in access" ON faces
    FOR ALL
    USING (auth.uid() IS NOT NULL);

