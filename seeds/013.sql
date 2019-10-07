SELECT skill.id, primaryname.name, STRING_AGG (alternatename.name, ';') as "alternate_names"
FROM skill
JOIN apparatus ON skill.apparatus_id = apparatus.id
JOIN action ON skill.action_id = action.id
JOIN age ON skill.age_id = age.id
JOIN class ON skill.class_id = class.id
JOIN level ON skill.level_id = level.id
JOIN priority ON skill.priority_id = priority.id
JOIN name as primaryname ON skill.primary_name_id = primaryname.id
JOIN name AS alternatename ON (skill.id = alternatename.skill_id and skill.primary_name_id != alternatename.id)
GROUP BY skill.id, primaryname.name;


SELECT skill.id, 
  primaryname.name,
  (select STRING_AGG (alternatename.name, ';') as "alternate_names" 
  	from name as alternatename 
  	where skill.id = alternatename.skill_id and skill.primary_name_id != alternatename.id
  	)
FROM skill
JOIN apparatus ON skill.apparatus_id = apparatus.id
JOIN action ON skill.action_id = action.id
JOIN age ON skill.age_id = age.id
JOIN class ON skill.class_id = class.id
JOIN level ON skill.level_id = level.id
JOIN priority ON skill.priority_id = priority.id
JOIN name as primaryname ON skill.primary_name_id = primaryname.id

STRING_AGG (alternate_name.alternate_name, ';') as "alternate_names"