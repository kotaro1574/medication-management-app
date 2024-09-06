--- user_facesの作成
CREATE TABLE user_faces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id varchar(255) NOT NULL,
    face_id varchar(255) NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamptz NOT NULL
);