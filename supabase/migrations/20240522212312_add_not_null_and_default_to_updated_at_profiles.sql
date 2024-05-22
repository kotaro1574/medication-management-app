-- 既存のnull値をデフォルト値に更新する
UPDATE profiles
SET updated_at = NOW()
WHERE updated_at IS NULL;

-- カラムにNOT NULL制約を追加し、デフォルト値を設定する
ALTER TABLE profiles
ALTER COLUMN updated_at SET NOT NULL,
ALTER COLUMN updated_at SET DEFAULT NOW();
