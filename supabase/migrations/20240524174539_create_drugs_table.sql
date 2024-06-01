CREATE TABLE drugs (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    image_id VARCHAR(255) NOT NULL,
    patient_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
