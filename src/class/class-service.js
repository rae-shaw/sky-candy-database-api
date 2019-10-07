const ClassService = {
	getAllClasses(knex){
		return knex.select('*').from('class')
	},
	insertClass(knex, newClass) {
		return knex
			.insert(newClass)
			.into('class')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},
	getById(knex, id){
		return knex
			.from('class')
			.select('*')
			.where({ id })
			.first()
	},
	deleteClass(knex, id){
		return knex('class')
			.where({ id })
			.delete()
	},
	updateClass(knex, id, updatedFields){
		return knex('class')
			.where({ id })
			.update(updatedFields)
	},

}

module.exports = ClassService