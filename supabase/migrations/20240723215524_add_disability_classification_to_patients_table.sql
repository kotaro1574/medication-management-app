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

-- テーブルの変更
ALTER TABLE patients
ADD COLUMN disability_classification disability_classification_enum NOT NULL;
