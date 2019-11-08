const LevelService = {
    getAllLevels(knex){
        return knex.select('*').from('level')
    },
    insertLevel(knex, newLevel) {
        return knex
            .insert(newLevel)
            .into('level')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id){
        return knex
            .from('level')
            .select('*')
            .where({ id })
            .first()
    },
    deleteLevel(knex, id){
        return knex('level')
            .where({ id })
            .delete()
    },
    updateLevel(knex, id, updatedFields){
        return knex('level')
            .where({ id })
            .update(updatedFields)
    },
}

module.exports = LevelService