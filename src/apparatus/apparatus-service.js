const ApparatusService = {
	getAllApparatus(knex){
		return knex.select('*').from('apparatus')
	},
	insertApparatus(knex, newApparatus) {
		console.log(newApparatus)
		return knex
			.insert(newApparatus)
			.into('apparatus')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},
	getById(knex, id){
		return knex
			.from('apparatus')
			.select('*')
			.where({ id })
			.first()
	},
	deleteApparatus(knex, id){
		return knex('apparatus')
			.where({ id })
			.delete()
	},
	updateApparatus(knex, id, updatedFields){
		return knex('apparatus')
			.where({ id })
			.update(updatedFields)
	},

}

module.exports = ApparatusService