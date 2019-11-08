const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('action Endpoints', function() {
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

	describe('GET /api/action', () => {
		context('Given no actions', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/action')
					.expect(200, []).catch(function(error) { console.error(error); }) 
			})
		})
		context('Given there are actions in the database', () => {
			const testActions = helpers.makeActionArray()

			beforeEach('insert actions', () => {
				db.insert(testActions).into('action').returning('id').catch(function(error) { console.error(error); })
			})


			it('GET /api/action responds with 200 and all of the actions', () => {
				return supertest(app)
					.get('/api/action/')
					.expect(200)
					.expect( res => {
						expect(res.body.action).to.eql(testActions.action)
					})
			})
				
		})
	})
	describe(`POST /api/action`, () => {
		const testAction = helpers.makeActionArray()
		beforeEach('insert action', async function() {
				return await db.insert(testAction).into('action').returning('id')
		})
		it(`responds with 400 missing 'action' if not supplied`, () => {
			const newActionMissingAction = {

			}
			return supertest(app)
				.post(`/api/action`)
				.send(newActionMissingAction)
				.expect(400, {
					error: { message: `Missing action in request body`}
				})
		})
		it('creates an action, responding with a 201 and the new action', () => {
			const newAction ={
				action: 'new action'
			}
			return supertest(app)
				.post(`/api/action`)
				.send(newAction)
				.expect(201)
				.expect( res => {
					expect(res.body.action).to.eql(newAction.action)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					return supertest(app)
					console.log('response body', res.body.id)
					.get(`/api/action/${res.body.id}`)
					.expect(res.body)
				})
			
		})
	})

	describe('GET /api/action/:id', () => {
		context(`Given no actions`, () => {
			it(`responds 404 when the action doesn't exist`, () => {
				return supertest(app)
					.get(`/api/action/123`)
					.expect(404, {
						error: { message: `Action Not Found` }
					})
			})
		})

		context(`Given there are actions in the database`, () => {
			const testAction = helpers.makeActionArray()

			beforeEach('insert action', async function() { 
				return await db.insert(testAction).into('action').returning('id').catch(function(error) { console.error(error); })
			})

			it('GET /api/action/:id responds with 200 and the specified action', () => {
				const actionId = 2
				const expectedAction = testAction[actionId-1]
				console.log('expectedAction', expectedAction)
				return supertest(app)
					.get(`/api/action/${actionId}`)
					.expect(200)
					.expect( res => {
						expect(res.body.action).to.eql(expectedAction.action)
					})
			})
		})
	})
	describe('DELETE /api/action/:id', () => {
		context(`Given no actions`, () => {
			it(`responds 404 when the action doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/action/123`)
				.expect(404, {
					error: { message: `Action Not Found` }
				})
			})
		})
		context('Given there are actions in the database', () => {
			const testAction = helpers.makeActionArray()

			beforeEach('insert action', async function() {
				await db.insert(testAction).into('action').returning('id')

			})
			it('removes the action by ID', () => {
				const idToRemove = 2
				const expectedAction = testAction.filter(ap => ap.id !== idToRemove)
					return supertest(app)
					.delete(`/api/action/${idToRemove}`)
					console.log('id', idToRemove)
					.expect(204)
					.then(() => {
						supertest(app)
							.get(`/api/action`)
							.expect(expectedAction)
				
					})
			})
		})
	})
	describe(`PATCH /api/action/:id`, () => {
		context(`Given no action`, () =>{
			it(`responds with 404`, () => {
				const actionId = 123
				return supertest(app)
					.patch(`/api/action/${actionId}`)
					.expect(404, {
						error: { message: `Action Not Found`}
					})
			})
		})
		context(`Given there are action in the database`, () => {
			const testAction = helpers.makeActionArray()

			beforeEach('insert action', async function() {
				return await db.insert(testAction).into('action').returning('id')

			})

			it('responds with 204 and updates the action', () => {
				const idToUpdate = 2
				const updateAction = {
					action: 'updated action',
				}
				const expectedAction = {
					...testAction[idToUpdate - 1],
					...updateAction
				}
				return supertest(app)
				.patch(`/api/action/${idToUpdate}`)
				.send(updateAction)
				.expect(204)
				then( res => 
					supertest(app)
						.get(`/api/action/${idToUpdate}`)
						.expect(updateAction)
					)
			})
		})

	})
})
