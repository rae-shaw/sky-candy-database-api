const AgeService = {
	getAllAges(knex){
		return knex.select('*').from('age')
	},
	insertAge(knex, newAction) {
		return knex
			.insert(newAction)
			.into('age')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},
	getById(knex, id){
		return knex
			.from('age')
			.select('*')
			.where({ id })
			.first()
	},
	deleteAge(knex, id){
		return knex('age')
			.where({ id })
			.delete()
	},
	updateAge(knex, id, updatedFields){
		return knex('age')
			.where({ id })
			.update(updatedFields)
	},

}

module.exports = AgeService