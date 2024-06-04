CREATE TABLE faces (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id varchar(255) NOT NULL,
    face_id varchar(255) NOT NULL,
    patient_id uuid NOT NULL,
    created_at timestamptz NOT NULL
);
