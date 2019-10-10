CREATE VIEW all_skills as
SELECT skill.id, primaryname.name, apparatus.apparatus, action.action, age.age, class.class, level.level, priority.priority, array_to_string (array (select name from name where skill.id = name.skill_id), ',') as alt_names
FROM skill
JOIN apparatus ON skill.apparatus_id = apparatus.id
JOIN action ON skill.action_id = action.id
JOIN age ON skill.age_id = age.id
JOIN class ON skill.class_id = class.id
JOIN level ON skill.level_id = level.id
JOIN priority ON skill.priority_id = priority.id
JOIN name as primaryname ON skill.primary_name_id = primaryname.id
JOIN name AS alternatename ON (skill.id = alternatename.skill_id and skill.primary_name_id != alternatename.id);