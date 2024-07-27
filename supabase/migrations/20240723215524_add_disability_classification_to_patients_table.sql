-- ENUM型を作成
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'disability_classification_enum') THEN
        CREATE TYPE disability_classification_enum AS ENUM (
            'independence',
            'disability_level_1',
            'disability_level_2',
            'disability_level_3',
            'disability_level_4',
            'disability_level_5',
            'disability_level_6'
        );
    END IF;
END $$;

-- 新しい列をNULL許可で追加
ALTER TABLE patients
ADD COLUMN disability_classification disability_classification_enum;

-- 既存のデータをデフォルト値でアップデート
UPDATE patients
SET disability_classification = 'independence'
WHERE disability_classification IS NULL;

-- NOT NULL制約を追加
ALTER TABLE patients
ALTER COLUMN disability_classification SET NOT NULL;
