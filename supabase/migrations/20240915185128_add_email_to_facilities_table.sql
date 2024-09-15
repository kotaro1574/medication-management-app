-- 1. まず、NULL値を許容するカラムを追加
ALTER TABLE facilities
ADD COLUMN email VARCHAR(255);

-- 2. 既存の行に一意のメールアドレスを設定
-- この例では、施設IDを使用して一意のメールアドレスを生成します
UPDATE facilities
SET email = CONCAT('facility_', id, '@example.com')
WHERE email IS NULL;

-- 3. NOT NULL制約を追加
ALTER TABLE facilities
ALTER COLUMN email SET NOT NULL;

-- 4. メールアドレスの一意性を確保するためのUNIQUE制約を追加（オプション）
ALTER TABLE facilities
ADD CONSTRAINT unique_email UNIQUE (email);