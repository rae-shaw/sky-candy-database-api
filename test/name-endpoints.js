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

	describe(`POST /api/name/name`, () => {
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
				.post(`/api/name/name`)
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
				.post(`/api/name/name`)
				.send(newName)
				.expect(201)
				.expect( res => {
					expect(res.body.name).to.eql(newName.name)
					expect(res.body.skill_id).to.eql(newName.skill_id)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					return supertest(app)
					.get(`/api/name/name/${res.body.id}`)
					.expect(res.body)
				})	
		})
	})

	describe('GET /api/name/name/:id', () => {
		context(`Given no names`, () => {
			it(`responds 404 when the name doesn't exist`, () => {
				return supertest(app)
					.get(`/api/name/name/123`)
					.expect(404, {
						error: { message: `Name Not Found` }
					})
			})
		})
		context(`Given there are names in the database`, () => {
			const testApparatus = helpers.makeApparatusArray()
			const testAge = helpers.makeAgeArray()
			const testAction = helpers.makeActionArray()
			const testLevel = helpers.makeLevelArray()
			const testClass = helpers.makeClassArray()
			const testPriority = helpers.makePriorityArray()
			const testSkills = helpers.makeSkillArray()
			const testNames = helpers.makeNameArray()

			beforeEach('insert into tables', async function() {

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


			it('GET /api/name/:id responds with 200 and the specified name', () => {
				const nameId = 2
				const expectedName = testNames[nameId-1]
				return supertest(app)
					.get(`/api/name/name/${nameId}`)
					.expect(200)
					.expect( res => {
						expect(res.body.name).to.eql(expectedName.name)
						expect(res.body).to.have.property('id')
						expect(res.body).to.have.property('skill_id')
					})
			})
		})
	})
	describe.only('DELETE /api/name/name/:id', () => {
		context(`Given no names`, () => {
			it(`responds 404 when the name doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/name/name/123`)
				.expect(404, {
					error: { message: `Name Not Found` }
				})
			})
		})
		context('Given there are names in the database', () => {
			const testApparatus = helpers.makeApparatusArray()
			const testAge = helpers.makeAgeArray()
			const testAction = helpers.makeActionArray()
			const testLevel = helpers.makeLevelArray()
			const testClass = helpers.makeClassArray()
			const testPriority = helpers.makePriorityArray()
			const testSkills = helpers.makeSkillArray()
			const testNames = helpers.makeNameArray()

			beforeEach('insert into tables', async function() {

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

			it('removes the name by ID', () => {
				const idToRemove = 3
				const expectedNames = testNames.filter(name => name.id !== idToRemove)
					return supertest(app)
					.delete(`/api/name/name/${idToRemove}`)
					.expect(204)
					.then(() => {
						return supertest(app)
							.get(`/api/name/name`)
							.expect(expectedNames)
					})
			})
		})
	})

	describe(`PATCH /api/name/:id`, () => {
		context(`Given no name`, () =>{
			it(`responds with 404`, () => {
				const nameId = 123
				return supertest(app)
					.patch(`/api/name/name/${nameId}`)
					.expect(404, {
						error: { message: `Name Not Found`}
					})
			})
		})
		context(`Given there are names in the database`, () => {
			const testApparatus = helpers.makeApparatusArray()
			const testAge = helpers.makeAgeArray()
			const testAction = helpers.makeActionArray()
			const testLevel = helpers.makeLevelArray()
			const testClass = helpers.makeClassArray()
			const testPriority = helpers.makePriorityArray()
			const testSkills = helpers.makeSkillArray()
			const testNames = helpers.makeNameArray()

			beforeEach('insert into tables', async function() {

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

			it('responds with 204 and updates the name', () => {
				const idToUpdate = 2
				const updateName = {
					name: 'updated name',
					skill_id: 2,
				}
				const expectedName = {
					...testNames[idToUpdate - 1],
					...updateName
				}
				return supertest(app)
				.patch(`/api/name/name/${idToUpdate}`)
				.send(updateName)
				.expect(204)
				then( res => {
					return supertest(app)
						.get(`/api/name/name/${idToUpdate}`)
						.expect(expectedName)
				})
			})
		})

	})

	describe(`POST /api/name/primaryname`, () => {
		const testApparatus = helpers.makeApparatusArray()
		const testAge = helpers.makeAgeArray()
		const testAction = helpers.makeActionArray()
		const testLevel = helpers.makeLevelArray()
		const testClass = helpers.makeClassArray()
		const testPriority = helpers.makePriorityArray()
		const testSkills = helpers.makeSkillArray()
		const testNames = helpers.makeNameArray()

		beforeEach('insert primary name', async function() {

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
			const newNameMissingFields = {

			}
			return supertest(app) 
				.post(`/api/name/primaryname`)
				.send(newNameMissingFields)
				.expect(400, {
					error: { message: `Request body must contain 2 fields, 'name' and 'skill_id'`}
				})
		})
		
		it('creates a name, responding with a 201 and the new name', () => {
			const newName ={
				name: 'new name',
				skill_id: 1
			}
			return supertest(app)
				.post(`/api/name/primaryname`)
				.send(newName)
				.expect(201)
				.expect( res => {
					expect(res.body.name).to.eql(newName.name)
					expect(res.body.skill_id).to.eql(newName.skill_id)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					return supertest(app)
					.get(`/api/name/name/${res.body.id}`)
					.expect(res.body)
				})	
		})
	})
})



