-- alertsテーブルの作成
CREATE TABLE alerts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(50) NOT NULL,
    time varchar(255) NOT NULL,
    repeat varchar(255) NOT NULL,
    date timestamptz NOT NULL,
    patient_id uuid NOT NULL,
    switch boolean NOT NULL DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);