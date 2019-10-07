INSERT INTO skill (apparatus_id, level_id, age_id, priority_id, class_id, action_id, details, warm_up, video)
VALUES
((select id from apparatus where apparatus = 'hammock'), 
	(select id from level where level = '2'), 
	(select id from age where age = 'adult'),
	(select id from priority where priority = 'essential'),
	(select id from class where class = 'drop'),
	(select id from action where action = 'skill'),'super fun dive!', 'warm_up well!', 'https//hereisthevideo.com');
