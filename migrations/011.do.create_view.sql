CREATE VIEW all_skills as
SELECT skill.id, primaryname.name, apparatus.apparatus, action.action, age.age, class.class, level.level, priority.priority, skill.details, skill.prerequisites, skill.warm_up, skill.video, array_to_string (array (select name from name where skill.id = name.skill_id and skill.primary_name_id != name.id), ',') as alt_names
FROM skill
RIGHT JOIN apparatus ON skill.apparatus_id = apparatus.id
RIGHT JOIN action ON skill.action_id = action.id
RIGHT JOIN age ON skill.age_id = age.id
RIGHT JOIN class ON skill.class_id = class.id
RIGHT JOIN level ON skill.level_id = level.id
RIGHT JOIN priority ON skill.priority_id = priority.id
JOIN name as primaryname ON skill.primary_name_id = primaryname.id;