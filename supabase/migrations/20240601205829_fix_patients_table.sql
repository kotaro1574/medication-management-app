-- テーブルの構造を変更
ALTER TABLE patients
-- 新しいカラムを追加
ADD COLUMN lastName VARCHAR(50) NOT NULL,
ADD COLUMN firstName VARCHAR(50) NOT NULL,
ADD COLUMN face_ids VARCHAR(255)[] NOT NULL;

-- 既存のカラムを削除
ALTER TABLE patients
DROP COLUMN name,
DROP COLUMN face_id