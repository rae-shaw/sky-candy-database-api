const ActionService = {
	getAllActions(knex){
		return knex.select('*').from('action')
	},
	insertAction(knex, newAction) {
		console.log(newAction)
		return knex
			.insert(newAction)
			.into('action')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},
	getById(knex, id){
		return knex
			.from('action')
			.select('*')
			.where({ id })
			.first()
	},
	deleteAction(knex, id){
		return knex('action')
			.where({ id })
			.delete()
	},
	updateAction(knex, id, updatedFields){
		return knex('action')
			.where({ id })
			.update(updatedFields)
	},

}

module.exports = ActionService