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
		return knex
		//validate data(ids) from client, use promise, if exist, oK, if not-throw an error
			.transaction(function(trx) {
				//insert the primary name into the name table
				return trx ('name')
				.insert({name: skillFields.primaryname})
				.returning('id')
				.then(function(primaryNameId){
					//insert the skillfields into the skill table, including the primary_name_id
					return trx
					.insert({ primary_name_id: primaryNameId[0] })
					.into('skill')
					.returning( 'id' )
					})
					.then(function(skill_id) {
						console.log('skill_id', skill_id)
						return trx
							const namesToInsert = skillFields.alt_names.map(name => 
  								({ alt_names: alt_names, skill_id: skill_id[0] })); 
								console.log('names to insert', namesToInsert)
							trx.insert(namesToInsert)
							})
						return skill_id
						.then(function(skill_id) {
							delete skillFields.alt_names
							delete skillFields.primary_name_id
							return trx('skill')
							.where('id', skill_id)
							.update( skillFields )
							})
							// .then(trx.commit)
							// .catch(trx.rollback);
				})
	},
}

						
module.exports = SkillService

	


