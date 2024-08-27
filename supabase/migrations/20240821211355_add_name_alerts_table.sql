ALTER TABLE alerts
ADD COLUMN name VARCHAR(50);

-- 既存のデータをデフォルト値でアップデート
UPDATE alerts
SET name = 'アラート' -- デフォルト値を設定
WHERE name IS NULL;

-- NOT NULL制約を追加
ALTER TABLE alerts
ALTER COLUMN name SET NOT NULL;