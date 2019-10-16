const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('priority Endpoints', function() {
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

	describe('GET /api/priority', () => {
		context('Given no priorities', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/priority')
					.expect(200, []).catch(function(error) { console.error(error); }) 
			})
		})
		context('Given there are priorities in the database', () => {
			const testPriorities = helpers.makePriorityArray()

			beforeEach('insert priorities', async function() {
				return await db.insert(testPriorities).into('priority').returning('id').catch(function(error) { console.error(error); })
			})


			it('GET /api/priority responds with 200 and all of the priorities', () => {
				return supertest(app)
					.get('/api/priority/')
					.expect(200)
					.expect( res => {
						expect(res.body.priority).to.eql(testPriorities.priority)
						//expect(res.body).to.have.property('id')
					})
			})
				
		})
	})
	describe(`POST /api/priority`, () => {
		const testPriority = helpers.makePriorityArray()
		beforeEach('insert priority', async function() {
				return await db.insert(testPriority).into('priority').returning('id')
		})
		it(`responds with 400 missing 'priority' if not supplied`, () => {
			const newPriorityMissingPriority = {

			}
			return supertest(app)
				.post(`/api/priority`)
				.send(newPriorityMissingPriority)
				.expect(400, {
					error: { message: `Missing priority in request body`}
				})
		})
		it('creates an priority, responding with a 201 and the new priority', () => {
			const newPriority ={
				priority: 'new priority'
			}
			return supertest(app)
				.post(`/api/priority`)
				.send(newPriority)
				.expect(201)
				.expect( res => {
					expect(res.body.priority).to.eql(newPriority.priority)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					return supertest(app)
					.get(`/api/priority/${res.body.id}`)
					.expect(res.body)
				})
		})
	})

	describe('GET /api/priority/:id', () => {
		context(`Given no priorities`, () => {
			it(`responds 404 when the priority doesn't exist`, () => {
				return supertest(app)
					.get(`/api/priority/123`)
					.expect(404, {
						error: { message: `Priority Not Found` }
					})
			})
		})
		context(`Given there are priorities in the database`, () => {
			const testPriorities = helpers.makePriorityArray()


			beforeEach('insert priorities', async function() { 
				await db.insert(testPriorities).into('priority').returning('id').catch(function(error) { console.error(error); })
			})

			it('GET /api/priority/:id responds with 200 and the specified priority', () => {
				const priorityId = 2
				const expectedPriority = testPriorities[priorityId-1]
				console.log('expectedPriority', expectedPriority)
				return supertest(app)
					.get(`/api/priority/${priorityId}`)
					.expect(200)
					.expect( res => {
						expect(res.body.priority).to.eql(expectedPriority.priority)
						expect(res.body).to.have.property('id')
					})
			})
		})
	})
	describe('DELETE /api/priority/:id', () => {
		context(`Given no priorities`, () => {
			it(`responds 404 when the priority doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/priority/123`)
				.expect(404, {
					error: { message: `Priority Not Found` }
				})
			})
		})
		context('Given there are priorities in the database', () => {
			const testPriorities = helpers.makePriorityArray()

			beforeEach('insert priority', async function() {
				await db.insert(testPriorities).into('priority').returning('id')

			})
			it('removes the priority by ID', () => {
				const idToRemove = 2
				const expectedPriority = testPriorities.filter(level => level.id !== idToRemove)
					return supertest(app)
					.delete(`/api/priority/${idToRemove}`)
					console.log('id', idToRemove)
					.expect(204)
					.then(() =>
						supertest(app)
							.get(`/api/priority`)
							.expect(expectedPriority))
			})
		})
	})

	describe(`PATCH /api/priority/:id`, () => {
		context(`Given no priority`, () =>{
			it(`responds with 404`, () => {
				const priorityId = 123
				return supertest(app)
					.patch(`/api/priority/${priorityId}`)
					.expect(404, {
						error: { message: `Priority Not Found`}
					})
			})
		})
		context(`Given there are priorities in the database`, () => {
			const testPriority = helpers.makePriorityArray()

			beforeEach('insert priority', async function() {
				await db.insert(testPriority).into('priority').returning('id')

			})

			it('responds with 204 and updates the priority', () => {
				const idToUpdate = 2
				const updatePriority = {
					priority: 'updated priority',
				}
				const expectedPriority = {
					...testPriority[idToUpdate - 1],
					...updatePriority
				}
				return supertest(app)
				.patch(`/api/priority/${idToUpdate}`)
				.send(updatePriority)
				.expect(204)
				then( res =>
					supertest(app)
						.get(`/api/priority/${idToUpdate}`)
						.expect(expectedPriority)
					)
			})
		})

	})
})