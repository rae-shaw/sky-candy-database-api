const SkillService = {


	basicSkillQuery(knex) {
		return knex
			.select('*')
			.from('all_skills')
			//.groupBy('skill.id', 'primaryname.name')
	},

	getSkills(knex, queryParams) {
		console.log("** ** ** ", queryParams)
		//validate query params
		let query = knex
			.select('all_skills.*')
			.from('all_skills')
			.where(queryParams)
		return query
	},
		



	// deleteSkill(knex, id){
 //   		return knex('skill')
 //     		.where({ id })
 //     		.delete()
 //  	},
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
			.update(updatedFields)
	}
// 	addSkill(knex, name, skillFields) {
// 		return knex('skill')
// 			.transaction(function(trx){

// 				// let primaryNameId = await knex
// 				// .insert(skillFields.primaryname)
// 				// .into('name')
// 				// .transacting(trx)
// 				// .returning('id')
// 				// .then()

// 				// let 

// 				knex
// 				.insert(skillFields.primaryname)
// 				.into('name')
// 				.transacting(trx)
// 				.returning('id')
// 				.then(function(primaryNameId){
// 					knex
// 					.insert(skillFields)
// 					.into('skill')
// 					.returning('id'))
// 					.transacting(trx)
// 					.then(function(skill_id) {
// 						// altNames.forEach()
// 						//for each name that isn't primaryname
// 						//await knex.insert(name[i]). ... .transacting(trx).then()

// 						// Update the primary name row that doesn't have skill_id yet
// 						// You know primaryNameId to find the row
// 						// You know skill_id to update the row.
// 						//await that too
// 					})
// 				})
// 				if(primaryname)
// 					thing I want it to do
// 				otherwise just
// 			//if the skill is the primary name, use the id to insert into the 'skill.primary_id'
// 				//then, insert the skill id into the name table
// 			//otherwise, update the skill table and then insert the skill id into the name table
// 			//have 2 different services? Or within the service?
// 			})
// 	}
// knex.transaction(function(trx) {

//   knex.insert({name: 'Old Books'}, 'id')
//     .into('catalogues')
//     .transacting(trx)
//     .then(function(ids) {
//       books.forEach((book) => book.catalogue_id = ids[0]);
//       return knex('books').insert(books).transacting(trx);
//     })
//     .then(trx.commit)
//     .catch(trx.rollback);
// })
// .then(function(inserts) {
//   console.log(inserts.length + ' new books saved.');
// })
// .catch(function(error) {
//   // If we get here, that means that neither the 'Old Books' catalogues insert,
//   // nor any of the books inserts will have taken place.
//   console.error(error);
// });
// 	},
}

module.exports = SkillService

	


