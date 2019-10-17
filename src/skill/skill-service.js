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

	addSkill(knex, skillFields) {
		console.log('skillFields', skillFields)
		return knex('skill')
		//validate data(ids) from client, use promise, if exist, oK, if not-throw an error
			.transaction(function(trx) {
				//insert the primary name into the name table
				return trx
				.insert(skillFields.primaryname)
				.into('name')
				//.transacting(trx)
				.returning('id')
				.then(function(primaryNameId){
					skillFields.primary_name_id = primaryNameId

					//insert the skillfields into the skill table, including the primary_name_id
					return trx
					.insert(skillFields.primaryNameId)
					.into('skill')
					.returning('id')
					//.transacting(trx);
					})
					.then(function(skill_id) {
					//insert skill_id into alternate names
						//skill_id = skill.id
						skillFields.alt_names.forEach(
							trx
							.insert(skillFields.alt_names[i], skill_id)
							.into('name'))
							//.transacting(trx);
							})
						return skill_id
						.then(function(skill_id) {
							delete skillFields.alt_names
							delete skillFields.primary_name_id
							return trx('skill')
							.where('id', skill_id)
							.update( skillFields )
							//.transacting(trx);
							})
						//is the above correct for inserting the rest of the fields? or does it need something else?
							// .then(trx.commit)
							// .catch(trx.rollback);
				})
	},
}

						
module.exports = SkillService

	


