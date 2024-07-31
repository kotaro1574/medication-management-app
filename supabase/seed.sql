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

INSERT INTO patients (last_name, first_name, birthday, care_level, disability_classification, facility_id, group_id, gender, image_id, face_ids) VALUES
('杉田', '浩太朗', 'H5.11.2生(30歳)', 'independence', 'independence', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'male', 'd401a4ed-afe7-41b5-afaa-931276924d37', array['8f77dc4e-627e-40f0-9fee-5ab5aa556629', 'f48f3dab-b283-49f2-bd8f-2d239ea996b0', '33b0a570-20a5-4190-8942-040103762b79', '27bf2462-96d9-41e8-8775-456814794c30', 'bb474e59-170c-4d3c-ab43-006c9575e3cf']);