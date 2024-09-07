-- RLSを有効にする
ALTER TABLE user_faces ENABLE ROW LEVEL SECURITY;

-- ログインしているユーザーのみが操作できるようにするポリシーを作成する
CREATE POLICY "Allow logged-in access" ON user_faces
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- 外部キー制約の追加
ALTER TABLE public.user_faces
ADD CONSTRAINT fk_profiles
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;