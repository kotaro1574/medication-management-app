-- RLSを有効にする
ALTER TABLE user_faces ENABLE ROW LEVEL SECURITY;

-- SELECTのみ誰でも可能にするポリシーを作成
CREATE POLICY "Allow public read access" ON user_faces
    FOR SELECT
    USING (true);

-- INSERT, UPDATE, DELETEはログインユーザーのみ可能にするポリシーを作成
CREATE POLICY "Allow logged-in write access" ON user_faces
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() = user_id);

-- 外部キー制約の追加
ALTER TABLE public.user_faces
ADD CONSTRAINT fk_profiles
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;