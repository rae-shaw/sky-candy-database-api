const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('level Endpoints', function() {
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
		return helpers.cleanTables(db).catch(function(error) { console.error(error); }) })

  	afterEach('cleanup', () => { 
  		return helpers.cleanTables(db).catch(function(error) { console.error(error); }) })

	after('disconnect from db', () => db.destroy())

	describe('GET /api/level/', () => {
		context('Given no levels', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/level')
					.expect(200, []).catch(function(error) { console.error(error); }) 
			})
		})
		context('Given there are levels in the database', () => {
			const testLevels = helpers.makeLevelArray()

			beforeEach('insert levels', async function() {
				return await db.insert(testLevels).into('level').returning('id').catch(function(error) { console.error(error); })
			})


			it('GET /api/level responds with 200 and all of the levels', () => {
				return supertest(app)
					.get('/api/level/')
					.expect(200)
					.expect( res => {
						expect(res.body.level).to.eql(testLevels.level)
						//expect(res.body).to.have.property('id')
					})
			})
				
		})
	describe(`POST /api/level`, () => {
		const testLevel = helpers.makeLevelArray()
		beforeEach('insert level', async function() {
				return await db.insert(testLevel).into('level').returning('id')
		})
		it(`responds with 400 missing 'level' if not supplied`, () => {
			const newLevelMissingLevel = {

			}
			return supertest(app)
				.post(`/api/level`)
				.send(newLevelMissingLevel)
				.expect(400, {
					error: { message: `Missing level in request body`}
				})
		})
		it('creates an level, responding with a 201 and the new level', () => {
			const newLevel ={
				level: 'new level'
			}
			return supertest(app)
				.post(`/api/level`)
				.send(newLevel)
				.expect(201)
				.expect( res => {
					expect(res.body.level).to.eql(newLevel.level)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					return supertest(app)
					.get(`/api/level/${res.body.id}`)
					.expect(res.body)
				})	
		})
	})
	describe('GET /api/level/:id', () => {
		context(`Given no levels`, () => {
			it(`responds 404 when the level doesn't exist`, () => {
				return supertest(app)
					.get(`/api/level/123`)
					.expect(404, {
						error: { message: `Level Not Found` }
					})
			})
		})
		context(`Given there are levels in the database`, () => {
			const testLevels = helpers.makeLevelArray()


			beforeEach('insert levels', async function() { 
				return await db.insert(testLevels).into('level').returning('id').catch(function(error) { console.error(error); })
			})

			it('GET /api/level/:id responds with 200 and the specified level', () => {
				const levelId = 2
				const expectedLevel = testLevels[levelId-1]
				console.log('expectedLevel', expectedLevel)
				return supertest(app)
					.get(`/api/level/${levelId}`)
					.expect(200)
					.expect( res => {
						expect(res.body.level).to.eql(expectedLevel.level)
						expect(res.body).to.have.property('id')
					})
			})
		})
	})
	describe('DELETE /api/level/:id', () => {
		context(`Given no levels`, () => {
			it(`responds 404 when the level doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/level/123`)
				.expect(404, {
					error: { message: `Level Not Found` }
				})
			})
		})
		context('Given there are levels in the database', () => {
			const testLevels = helpers.makeLevelArray()

			beforeEach('insert level', async function() {
				await db.insert(testLevels).into('level').returning('id')

			})
			it('removes the level by ID', () => {
				const idToRemove = 2
				const expectedLevel = testLevels.filter(level => level.id !== idToRemove)
					return supertest(app)
					.delete(`/api/level/${idToRemove}`)
					console.log('id', idToRemove)
					.expect(204)
					.then(() => {
						return supertest(app)
							.get(`/api/level`)
							.expect(expectedLevel)
					})
			})
		})
	})

	describe(`PATCH /api/level/:id`, () => {
		context(`Given no levels`, () =>{
			it(`responds with 404`, () => {
				const levelId = 123
				return supertest(app)
					.patch(`/api/level/${levelId}`)
					.expect(404, {
						error: { message: `Level Not Found`}
					})
			})
		})
		context(`Given there are levels in the database`, () => {
			const testLevel = helpers.makeLevelArray()

			beforeEach('insert level', async function() {
				await db.insert(testLevel).into('level').returning('id')

			})

			it('responds with 204 and updates the level', () => {
				const idToUpdate = 2
				const updateLevel = {
					level: 'updated level',
				}
				const expectedLevel = {
					...testLevel[idToUpdate - 1],
					...updateLevel
				}
				return supertest(app)
				.patch(`/api/level/${idToUpdate}`)
				.send(updateLevel)
				.expect(204)
				then( res =>
					supertest(app)
						.get(`/api/level/${idToUpdate}`)
						.expect(expectedLevel)
					)
			})
		})

	})
})

})