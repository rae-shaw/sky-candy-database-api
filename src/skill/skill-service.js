function validateGet(obj, keys) {
  return keys.map( q => q in obj ? {[q]: obj[q]} : {})
    .reduce((res,o) => Object.assign(res,o), {});
}

function validatePost

const SkillService = {

	getSkills(knex, queryParams) {
		console.log("** ** ** ", queryParams)
		newParams = validateGet(queryParams, ['action', 'age', 'apparatus', 'level', 'class', 'name'])		
		let query = knex
			.from('all_skills')
			.select('all_skills.*')
			.where(newParams)
		return query

	},

	deleteSkill(knex, id){
		//need to add code so that you can't delete a primary name
   		return knex('skill')
     		.where({ id })
     		.del()
  	},

  	getById(knex, id){
   		return knex
     		.from('skill')
     		.select('id')
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
		return knex
		//validate data(ids) from client, use promise, if exist, oK, if not-throw an error
			.transaction(function(trx) {
				//insert the primary name into the name table
				let skillid
				return trx ('name')
				.insert({ name: skillFields.primaryname })
				.returning('id')
				.then(function(primaryNameId){
					//insert insert the name.id from the primaryname insert into the primary_name_id row of the skill table
					return trx
						.insert({ primary_name_id: primaryNameId[0] })
						.into('skill')
						.returning( 'id' )
				})
				.then(function(skill_id) {
					//insert the skill_id field into the name table
					skillid = skill_id
					return trx('name')
						.where({ name: skillFields.primaryname })
						.update({ skill_id: skillid[0] })
				})
				.then( () => {
					//insert all the alt_names with the skill_id  into the name table
					const namesToInsert = skillFields.alt_names.map(name => {
						return {name: name, skill_id: skillid[0]}
					})
					return trx
						.insert( namesToInsert )
						.into('name')
				})									
				.then( () => {
					//delete alt_names and primaryname from skillFields and insert the rest of the fields into the skill table
					delete skillFields.alt_names
					delete skillFields.primaryname
					return trx('skill')
					.where({ id: skillid[0] })
					.update( skillFields )
					.returning('*')
				})
				// .then( function(primaryNameId) {
	   //            return trx
	   //            .select('*')
	   //            .from('name')
	   //            .where({ id: primaryNameId[0] })
	   //            .first()
	   //          })
			})
	},

	updatePrimaryNameFromExisting(knex, id, skill_id){
        return knex('skill')
        	.where({ id })
        	.update({ primary_name_id: skill_id })

    }
}

						
module.exports = SkillService

	


