-- RLSを有効にする
ALTER TABLE drug_histories ENABLE ROW LEVEL SECURITY;

-- ログインしているユーザーのみが操作できるようにするポリシーを作成する
CREATE POLICY "Allow logged-in access" ON drug_histories
    FOR ALL
    USING (auth.uid() IS NOT NULL);

