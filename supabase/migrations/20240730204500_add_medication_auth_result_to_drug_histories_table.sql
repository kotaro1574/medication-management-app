-- ENUM型を作成
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'medication_auth_result_enum') THEN
        CREATE TYPE medication_auth_result_enum AS ENUM (
            'success', 'failure'
        );
    END IF;
END $$;

-- 新しい列をNULL許可で追加
ALTER TABLE drug_histories
ADD COLUMN medication_auth_result medication_auth_result_enum;

-- 既存のデータをデフォルト値でアップデート
UPDATE drug_histories
SET medication_auth_result = 'success' -- デフォルト値を設定
WHERE medication_auth_result IS NULL;

-- NOT NULL制約を追加
ALTER TABLE drug_histories
ALTER COLUMN medication_auth_result SET NOT NULL;
