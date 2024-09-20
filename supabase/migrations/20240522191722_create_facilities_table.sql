CREATE TABLE facilities (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name varchar(50) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- profilesテーブルのfacility_idカラムに外部キー制約を追加
ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_facility
  FOREIGN KEY (facility_id)
  REFERENCES facilities(id);