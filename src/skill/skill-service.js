const SkillService = {
	// basicSkillQuery(knex, skill)
	// 	return knex
	// 		.select('id', 'primary_name_id', 'apparatus_id', 'level_id', 'age_id', 'priority_id', 'class_id', 'action_id', 'details', 'prequisites', 'warm_up', 'video')
	// 		.join('apparatus', 'skill.apparatus_id', 'apparatus.id')
	// 		.join('action', 'skill.action_id', 'action.id')
	// 		.join('age', 'skill.age_id', 'age.id')
	// 		.join('class', 'skill.class_id', 'class.id')
	// 		.join('level', 'skill.level_id', 'level.id')
	// 		.join('priority', 'skill.priority_id', 'priority.id')
	// 		.join('name as primaryname', 'skill.primary_name_id', 'primaryname.id')
	// 	}
	// getByName(knex, name){
	// 	return knex
	// 		.select('*')
	// 		.where({ 'primary_name' : name })
	// 		.orWhere({ 'alt_name' : name })
	// 		.first()
	// 	},


// knexObj = knex.select()

// knexObj2 = knexObj.join()

	basicSkillQuery(knex) {
		return knex
			.from('skill')
			.select('*')
			//.groupBy('skill.id', 'primaryname.name')
	},
	// 	return knex
	// 		.select('skill.id', 'primaryname.name' ).select(knex.raw(STRING_AGG ('alternatename.name as alternate_names'))
	// 		.from('skill')
	// 		.join('apparatus', 'skill.apparatus_id', 'apparatus.id')
	// 		.join('action', 'skill.action_id', 'action.id')
	// 		.join('age', 'skill.age_id', 'age.id')
	// 		.join('class', 'skill.class_id', 'class.id')
	// 		.join('level', 'skill.level_id', 'level.id')
	// 		.join('priority', 'skill.priority_id', 'priority.id')
	// 		.join('name as primaryname', 'skill.primary_name_id', 'primaryname.id')
	// 		.join('name as alternatename', '(skill.id = alternatename.skill_id and skill.primary_name_id != alternatename.id)')
	// 		.groupBy('skill.id', 'primaryname.name'))
	// },

	// getByName(knex, skillName) {
	// 	baseQuery = basicSkillQuery(knex);
	// 	return baseQuery.where()
	// },

	// addNameFilter(knex, skillName) {
	// 	return knex.where()
	// },
	deleteSkill(knex, id){
   		return knex('skill')
     		.where({ id })
     		.delete()
  	},
  	getById(knex, id){
   		return knex
     		.from('skill')
     		.select('*')
     		.where({ id })
     		.first()
  },
}

module.exports = SkillService

	
// SELECT skill.id, primaryname.name, STRING_AGG (alternatename.name, ';') as "alternate_names"
// FROM skill
// JOIN apparatus ON skill.apparatus_id = apparatus.id
// JOIN action ON skill.action_id = action.id
// JOIN age ON skill.age_id = age.id
// JOIN class ON skill.class_id = class.id
// JOIN level ON skill.level_id = level.id
// JOIN priority ON skill.priority_id = priority.id
// JOIN name as primaryname ON skill.primary_name_id = primaryname.id
// JOIN name AS alternatename ON (skill.id = alternatename.skill_id and skill.primary_name_id != alternatename.id)
// GROUP BY skill.id, primaryname.name;


// SELECT skill.id, 
//   primaryname.name,
//   (select STRING_AGG (alternatename.name, ';') as "alternate_names" 
//   	from name as alternatename 
//   	where skill.id = alternatename.skill_id and skill.primary_name_id != alternatename.id
//   	)
// FROM skill
// JOIN apparatus ON skill.apparatus_id = apparatus.id
// JOIN action ON skill.action_id = action.id
// JOIN age ON skill.age_id = age.id
// JOIN class ON skill.class_id = class.id
// JOIN level ON skill.level_id = level.id
// JOIN priority ON skill.priority_id = priority.id
// JOIN name as primaryname ON skill.primary_name_id = primaryname.id

