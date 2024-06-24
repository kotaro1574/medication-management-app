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
('杉田', '浩太朗', 'H5.11.2生(30歳)', 'independence', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'male', '76de6609-3fcb-4dcf-8b55-7cdf4a729724', array['c6993c3a-d03e-4d2f-b48b-ee56827080c0', 'b77c2537-0eed-4702-97c3-55ecd6fe5389', '95e5328e-3e53-4142-85a1-a818ca7596aa', '697c867c-0796-4d41-9f08-d56d30c771a9', '1e65d962-fc5f-49fd-9481-0bf691197fef']);