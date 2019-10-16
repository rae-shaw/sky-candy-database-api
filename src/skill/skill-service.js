function validate(obj, keys) {
  return keys.map( q => q in obj ? {[q]: obj[q]} : {})
    .reduce((res,o) => Object.assign(res,o), {});
}

const SkillService = {


	basicSkillQuery(knex) {
		return knex
			.select('*')
			.from('all_skills')
			//.groupBy('skill.id', 'primaryname.name')
	},

	getSkills(knex, queryParams) {
		console.log("** ** ** ", queryParams)
		newParams = validate(queryParams, ['action', 'age', 'apparatus', 'level', 'class', 'level', 'name'])		
		let query = knex
			.select('all_skills.*')
			.from('all_skills')
			.where(newParams)
		return query
	},

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
  	updateSkill(knex, id, updatedFields){
		return knex('skill')
			.where({ id })
			console.log(id)
			.update(updatedFields)
	},

	addSkill(knex, name, skillFields) {
		return knex('skill')
			.transaction(function(trx){

				//insert the primary name into the name table
				knex
				.insert(skillFields.primaryname)
				.into('name')
				.transacting(trx)
				.returning('id')
				.then(function(primaryNameId){
					skillFields.primary_name_id = primaryNameId

					//insert the skillfields into the skill table, including the primary_name_id
					knex
					.insert(skillFields.primaryNameId)
					.into('skill')
					.returning('id')
					.transacting(trx);
					})
					.then(function(skill_id) {
					//insert skill_id into alternate names
						skill_id = skill.id
						alt_names.forEach(
							knex
							.insert(alt_names[i], skill_id))
							.transacting(trx);
							})
						.then(function(skillFields) {
							knex
							.from('level')
							.select('id')
							.where(level = skillFields.level)
							.insert('id')
							.into('skill')
							.transacting(trx);
							})
						//is the above correct for inserting the rest of the fields? or does it need something else?
							.then(trx.commit)
							.catch(trx.rollback);
				})
	},
}

						
module.exports = SkillService

	


