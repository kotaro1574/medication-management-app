-- facilitiesテーブルにデータを挿入
INSERT INTO facilities (name_ja, name_en, email, plan) VALUES
('健康センター', 'health_center', 'facility1@example.com', '竹'),
('リハビリテーション施設', 'rehabilitation_facilities', 'facility2@example.com', '梅');

-- groupsテーブルにデータを挿入
INSERT INTO groups (name, facility_id) VALUES
('グループA', (SELECT id FROM facilities WHERE name_ja = '健康センター')),
('グループB', (SELECT id FROM facilities WHERE name_ja = '健康センター')),
('groupA', (SELECT id FROM facilities WHERE name_ja = 'リハビリテーション施設')),
('groupB', (SELECT id FROM facilities WHERE name_ja = 'リハビリテーション施設'));
