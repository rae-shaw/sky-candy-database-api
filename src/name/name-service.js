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
  //update service goes through skill table

}


module.exports = NameService