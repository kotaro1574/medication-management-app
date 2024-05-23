-- ENUM型を作成
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'care_level_enum') THEN
        CREATE TYPE care_level_enum AS ENUM ('independence', 'needs_support_1', 'needs_support_2', 'needs_nursing_care_1', 'needs_nursing_care_2', 'needs_nursing_care_3', 'needs_nursing_care_4', 'needs_nursing_care_5');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
        CREATE TYPE gender_enum AS ENUM ('male', 'female');
    END IF;
END $$;

-- テーブルの構造を変更
ALTER TABLE patients
-- 既存のカラムのデータ型と制約を変更
ALTER COLUMN name SET DATA TYPE VARCHAR(50),
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN image_id SET DATA TYPE VARCHAR(255),
ALTER COLUMN image_id SET NOT NULL,

-- 新しいカラムを追加
ADD COLUMN birthday VARCHAR(50) NOT NULL,
ADD COLUMN care_level care_level_enum NOT NULL,
ADD COLUMN facility_id UUID NOT NULL,
ADD COLUMN group_id UUID NOT NULL,
ADD COLUMN gender gender_enum NOT NULL,
ADD COLUMN face_id VARCHAR(255) NOT NULL,
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 不要なカラムを削除
ALTER TABLE patients
DROP COLUMN face_ids;
