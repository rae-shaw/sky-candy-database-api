const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('name Endpoints', function() {
	let db 

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		})
		app.set('db', db)
		db.debug()
	})

	before('cleanup', () => { 
		return helpers.cleanTables(db).catch(function(error) { 
			console.error(error); }) })

  	afterEach('cleanup', () => { console.log ('running after each'); 
  		return helpers.cleanTables(db).catch(function(error) { console.error(error); }) })


	after('disconnect from db', () => db.destroy())

	describe(`POST /api/alternatename`, () => {
		const testApparatus = helpers.makeApparatusArray()
		const testAge = helpers.makeAgeArray()
		const testAction = helpers.makeActionArray()
		const testLevel = helpers.makeLevelArray()
		const testClass = helpers.makeClassArray()
		const testPriority = helpers.makePriorityArray()
		const testSkills = helpers.makeSkillArray()
		const testNames = helpers.makeNameArray()

		beforeEach('insert name', async function() {

			await db.insert(testApparatus) .into('apparatus') .catch(function(error) { console.error(error); })
			await db.insert(testAction)    .into('action')    .catch(function(error) { console.error(error); })
			await db.insert(testAge)       .into('age')       .catch(function(error) { console.error(error); })
			await db.insert(testLevel)     .into('level')     .catch(function(error) { console.error(error); })
			await db.insert(testClass)     .into('class')     .catch(function(error) { console.error(error); })
			await db.insert(testPriority)  .into('priority')  .catch(function(error) { console.error(error); })
			await db.insert(testNames)     .into('name')      .catch(function(error) { console.error(error); })
			await db.insert(testSkills)    .into('skill')    .returning('*')  .catch(function(error) { console.error(error); })
			return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
		})

		it(`responds with 400 missing 'name' if not supplied`, () => {
			const newNameMissingName = {

			}
			return supertest(app)
				.post(`/api/alternatename`)
				.send(newNameMissingName)
				.expect(400, {
					error: { message: `Request body must contain 'name'`}
				})
		})
		
		it('creates a name, responding with a 201 and the new name', () => {
			const newName ={
				name: 'new name',
				skill_id: 1,
			}
			return supertest(app)
				.post(`/api/alternatename`)
				.send(newName)
				.expect(201)
				.expect( res => {
					expect(res.body.name).to.eql(newName.name)
					expect(res.body.skill_id).to.eql(newName.skill_id)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					return supertest(app)
					.get(`/api/alternatename/${res.body.id}`)
					.expect(res.body)
				})	
		})
	})
})



