-- facilitiesテーブルにデータを挿入
INSERT INTO facilities (name, email) VALUES
('健康センター', 'facility1@example.com'),
('リハビリテーション施設', 'facility2@example.com');

-- groupsテーブルにデータを挿入
INSERT INTO groups (name, facility_id) VALUES
('グループA', (SELECT id FROM facilities WHERE name = '健康センター')),
('グループB', (SELECT id FROM facilities WHERE name = '健康センター')),
('groupA', (SELECT id FROM facilities WHERE name = 'リハビリテーション施設')),
('groupB', (SELECT id FROM facilities WHERE name = 'リハビリテーション施設'));
