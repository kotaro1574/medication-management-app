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
('杉田浩太朗', 'H5-11-02', 'independence', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'male', '3b241a63-73ba-4e93-a81d-941d47d93ddb', '9231e459-d4ad-4d89-b60a-ef564fffffba'),
('杉田夏美', 'H4-06-10', 'needs_support_1', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'female', '272c58bb-3e20-4e72-bfe1-68caeb97fd79', '2b9c34c8-a82e-423f-9454-fa18fd4d3416'),
('大田翔也', 'R50-03-03', 'needs_nursing_care_2', (SELECT id FROM facilities WHERE name = 'リハビリテーション施設'), (SELECT id FROM groups WHERE name = 'groupA'), 'male', '959e15a2-5e04-4464-aa9f-020ab61ec706', '139e0f58-8854-4a59-9302-af8957c256b7');

INSERT INTO drugs (image_id, patient_id) VALUES
('7ad6f4bc-6d0a-4a0f-8752-756ea7b23991', (SELECT id FROM patients WHERE name = '杉田浩太朗'));