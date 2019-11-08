const NameService = {

    deleteName(knex, id){
        return knex
            .transaction(function(trx) {
                return trx
                    .select('primary_name_id')
                    .from('skill')
                    .where({ primary_name_id : id })
                    .returning('*')
                    .then(function(ids){
                        console.log('****************', ids.length)
                        
                        if (ids.length !== 0){
                            
                            return ({ error: {message: 'Cannot delete, name is a primary name'}
                            })
                        }else{
                            return trx
                                .select('*')
                                .from('name')
                                .where({ id })
                                .delete() 
                        }
                    })
            })
    },
    
    getById(knex, id){
        return knex
            .from('name')
            .select('*')
            .where({ id })
            .first()
    },

    addAlternateName(knex, newName, skill_id){
        return knex
            .insert(newName, skill_id)
            .into('name')
            .returning('*')
            .then( rows => {
                return rows[0]
            })
    },

    addPrimaryName(knex, newName) {
        return knex
            .transaction(function(trx) {
              //insert the primary name into the name table
                return trx
                .insert(newName)
                .into('name')
                .returning('id')
                //insert the id of the primary name into the skills table
                .then(function(primaryNameId){
                    return trx('skill')
                    .where({ id: newName.skill_id})
                    .update({ primary_name_id: primaryNameId[0] })
                    .returning('primary_name_id')
                })
                //select the primary name from the name table where the id is equal to the primary name id from the skills table
                .then( function(primaryNameId) {
                    return trx
                    .select('*')
                    .from('name')
                    .where({ id: primaryNameId[0] })
                    .first()
                })
            })
    },

    updateName(knex, id, updatedFields) {
        return knex('name')
            .where({ id })
            .update(updatedFields)
    },
}



module.exports = NameService