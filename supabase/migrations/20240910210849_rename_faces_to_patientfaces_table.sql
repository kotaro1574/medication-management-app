-- ポリシーを削除する
DROP POLICY IF EXISTS "Allow logged-in access" ON faces;

-- RLSを無効にする
ALTER TABLE faces DISABLE ROW LEVEL SECURITY;

-- テーブル名を変更
ALTER TABLE public.faces RENAME TO patient_faces;

-- 主キー制約の名前を更新
ALTER TABLE public.patient_faces RENAME CONSTRAINT faces_pkey TO patient_faces_pkey;

-- 外部キー制約の名前を更新
ALTER TABLE public.patient_faces RENAME CONSTRAINT fk_patient TO fk_patient_faces_patient;

-- RLSを有効にする
ALTER TABLE patient_faces ENABLE ROW LEVEL SECURITY;

-- ログインしているユーザーのみが操作できるようにするポリシーを作成する
CREATE POLICY "Allow logged-in access" ON patient_faces
    FOR ALL
    USING (auth.uid() IS NOT NULL);