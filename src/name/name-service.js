const NameService = {
  //getAllNames isn't necssary
  //insert service goes through skill table
  deleteName(knex, id){
   return knex('name')
     .where({ id })
     .delete()
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

  addPrimaryName(knex, newName, skill_id) {
    return knex
        .transaction(function(trx) {
                    //insert the primary name into the name table
            return trx ('name')
            .insert({ name: newName, skill_id: skill_id })
            .returning('id')
            .then(function(primaryNameId){
                return trx('skill')
                .update({ primary_name_id: primaryNameId[0] })
                .returning( 'id' )
            })
        })
    },

    updateName(knex, id, updatedFields) {
        return knex('name')
            .where({ id })
            .update(updatedFields)
    },
}

}


module.exports = NameService