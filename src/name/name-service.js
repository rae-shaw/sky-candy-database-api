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
  //update service goes through skill table

}

module.exports = NameService