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
		newParams = validate(queryParams, ['action', 'age', 'apparatus', 'level', 'class', 'name'])		
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
				let skillid
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
							skillid = skill_id
							return trx('name')
								.where({ name: skillFields.primaryname })
								.update({ skill_id: skillid[0] })
						})
								.then( () => {
									const namesToInsert = skillFields.alt_names.map(name => {
										return {name: name, skill_id: skillid[0]}
									})
									return trx
										.insert( namesToInsert )
										.into('name')
								})
									//return skillid
									
										.then( () => {
											console.log('*********************skillid', skillid)
											console.log('skillFields', skillFields)
											delete skillFields.alt_names
											delete skillFields.primaryname
											return trx('skill')
											.where({ id: skillid[0] })
											.update( skillFields )
										})
										// .then(trx.commit)
										// .catch(trx.rollback);
			})
	},
}

						
module.exports = SkillService

	


