const PriorityService = {
    getAllPriorities(knex){
        return knex.select('*').from('priority')
    },
    insertPriority(knex, newPriority) {
        return knex
            .insert(newPriority)
            .into('priority')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id){
        return knex
            .from('priority')
            .select('*')
            .where({ id })
            .first()
    },
    deletePriority(knex, id){
        return knex('priority')
            .where({ id })
            .delete()
    },
    updatePriority(knex, id, updatedFields){
        return knex('priority')
            .where({ id })
            .update(updatedFields)
    },
}

module.exports = PriorityService