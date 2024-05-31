-- facilitiesテーブルにデータを挿入
INSERT INTO facilities (name) VALUES
('健康センター'),
('リハビリテーション施設');

-- groupsテーブルにデータを挿入
INSERT INTO groups (name, facility_id) VALUES
('グループA', (SELECT id FROM facilities WHERE name = '健康センター')),
('グループB', (SELECT id FROM facilities WHERE name = '健康センター')),
('groupA', (SELECT id FROM facilities WHERE name = 'リハビリテーション施設')),
('groupB', (SELECT id FROM facilities WHERE name = 'リハビリテーション施設'));

INSERT INTO patients (name, birthday, care_level, facility_id, group_id, gender, image_id, face_id) VALUES
('杉田浩太朗', 'H5-11-02', 'independence', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'male', '5f9e89a6-180f-4343-aa9c-e66af3a4c8d1', '6c464c39-a82d-4c8a-9610-4f0dde97e845'),
('杉田夏美.', 'H4-06-10', 'needs_support_1', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'female', '4301dd77-f600-45b7-af6e-96a1c3188cec', '3cc67684-3799-432b-b9a2-077e75737672'),
('大田翔也', 'R50-03-03', 'needs_nursing_care_2', (SELECT id FROM facilities WHERE name = 'リハビリテーション施設'), (SELECT id FROM groups WHERE name = 'groupA'), 'male', '1cdddf84-6dd2-4dc0-800f-65623f07c067', '75c3a9fe-d3cc-466e-bb82-b449d537c9b4');

INSERT INTO drugs (image_id, patient_id) VALUES
('7ad6f4bc-6d0a-4a0f-8752-756ea7b23991', (SELECT id FROM patients WHERE name = '杉田浩太朗'));