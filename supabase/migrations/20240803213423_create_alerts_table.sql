-- alertsテーブルの作成
CREATE TABLE alerts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    hour int2 NOT NULL,  -- 時間（0〜23の範囲を想定）
    minute int2 NOT NULL,  -- 分（0〜59の範囲を想定）
    repeat varchar(255) NOT NULL,
    date timestamptz NOT NULL,
    patient_id uuid NOT NULL,
    is_alert_enabled boolean NOT NULL DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);