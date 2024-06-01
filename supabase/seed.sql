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

INSERT INTO patients (lastName, firstName, birthday, care_level, facility_id, group_id, gender, image_id, face_ids) VALUES
('杉田', '浩太朗', 'H5-11-02', 'independence', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'male', '3b241a63-73ba-4e93-a81d-941d47d93ddb', array['9231e459-d4ad-4d89-b60a-ef564fffffba']),
('杉田', '夏美', 'H4-06-10', 'needs_support_1', (SELECT id FROM facilities WHERE name = '健康センター'), (SELECT id FROM groups WHERE name = 'グループA'), 'female', '272c58bb-3e20-4e72-bfe1-68caeb97fd79', array['2b9c34c8-a82e-423f-9454-fa18fd4d3416']),
('大田', '翔也', 'R50-03-03', 'needs_nursing_care_2', (SELECT id FROM facilities WHERE name = 'リハビリテーション施設'), (SELECT id FROM groups WHERE name = 'groupA'), 'male', '959e15a2-5e04-4464-aa9f-020ab61ec706', array['139e0f58-8854-4a59-9302-af8957c256b7']);
