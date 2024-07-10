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

INSERT INTO patients (last_name, first_name, birthday, care_level, facility_id, group_id, gender, image_id, face_ids) VALUES
('杉田', '浩太朗', 'H5.11.2生(30歳)', 'independence', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'male', '49d53b48-08f5-479a-bc08-6e8a7f764a95', array['f7048c9d-4497-4f49-8123-d82cdf50a0a7', '3bcd163c-3100-4c0a-99d3-369a2b52a17', 'fe0a8aee-3d45-42bf-a7de-aa424916aef4', '3be0a94d-3eb0-409d-9c97-f354ff573358', '21720c1-efdf-4498-832d-f1b84b32c1bf']);