-- テーブルの構造を変更
ALTER TABLE patients
-- 新しいカラムを追加
ADD COLUMN last_name VARCHAR(50) NOT NULL,
ADD COLUMN first_name VARCHAR(50) NOT NULL;

-- 既存のカラムを削除
ALTER TABLE patients
DROP COLUMN lastName,
DROP COLUMN firstName