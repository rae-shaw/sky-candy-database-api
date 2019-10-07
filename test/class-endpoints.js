const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('class Endpoints', function() {
	let db 

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		})
		app.set('db', db)
		db.debug()
	})

	before('cleanup', () => { helpers.cleanTables(db).catch(function(error) { console.error(error); }) })

  	afterEach('cleanup', () => { helpers.cleanTables(db).catch(function(error) { console.error(error); }) })

	after('disconnect from db', () => db.destroy())

	describe('GET /api/class/', () => {
		context('Given no classes', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/class')
					.expect(200, []).catch(function(error) { console.error(error); }) 
			})
		})
		context('Given there are classes in the database', () => {
			const testClasses = helpers.makeClassArray()

			beforeEach('insert classes', () => {
				db.insert(testClasses).into('class').returning('id').catch(function(error) { console.error(error); })
			})


			it('GET /api/action responds with 200 and all of the classes', () => {
				return supertest(app)
					.get('/api/class/')
					.expect(200, testClasses)
			})
				
		})
	})
	describe(`POST /api/class`, () => {
		const testClass = helpers.makeClassArray()
		beforeEach('insert class', async function() {
				return await db.insert(testClass).into('class').returning('id')
		})
		it(`responds with 400 missing 'class' if not supplied`, () => {
			const newClassMissingClass = {

			}
			return supertest(app)
				.post(`/api/class`)
				.send(newClassMissingClass)
				.expect(400, {
					error: { message: `Missing class in request body`}
				})
		})
		it('creates an class, responding with a 201 and the new class', () => {
			const newClass ={
				class: 'new class'
			}
			return supertest(app)
				.post(`/api/class`)
				.send(newClass)
				.expect(201)
				.expect( res => {
					expect(res.body.class).to.eql(newClass.class)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					supertest(app)
					.get(`/api/class/${res.body.id}`)
					.expect(res.body)
				})
				
			})
	})
	describe('GET /api/class/:id', () => {
		context(`Given no class`, () => {
			it(`responds 404 when the class doesn't exist`, () => {
				return supertest(app)
					.get(`/api/class/123`)
					.expect(404, {
						error: { message: `Class Not Found` }
					})
			})
		})
		context(`Given there are classes in the database`, () => {
			const testClasses = helpers.makeClassArray()


			beforeEach('insert classes', async function() { 
				await db.insert(testClasses).into('class').returning('id').catch(function(error) { console.error(error); })
			})

			it('GET /api/class/:id responds with 200 and the specified class', () => {
				const classId = 2
				const expectedClass = testClasses[classId-1]
				console.log('expectedClass', expectedClass)
				return supertest(app)
					.get(`/api/class/${classId}`)
					.expect(200, expectedClass)
			})
		})
	})
	describe('DELETE /api/class/:id', () => {
		context(`Given no classes`, () => {
			it(`responds 404 when the class doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/class/123`)
				.expect(404, {
					error: { message: `Class Not Found` }
				})
			})
		})
		context('Given there are classes in the database', () => {
			const testClass = helpers.makeClassArray()

			beforeEach('insert class', async function() {
				await db.insert(testClass).into('class').returning('id')

			})
			it('removes the class by ID', () => {
				const idToRemove = 2
				const expectedClass = testClass.filter(cl => cl.id !== idToRemove)
					return supertest(app)
					.delete(`/api/class/${idToRemove}`)
					console.log('id', idToRemove)
					.expect(204)
					.then(() =>
						supertest(app)
							.get(`/api/class`)
							.expect(expectedClass))
			})
		})
	})

	describe(`PATCH /api/class/:id`, () => {
		context(`Given no class`, () =>{
			it(`responds with 404`, () => {
				const classId = 123
				return supertest(app)
					.patch(`/api/class/${classId}`)
					.expect(404, {
						error: { message: `Class Not Found`}
					})
			})
		})
		context(`Given there are classes in the database`, () => {
			const testClass = helpers.makeClassArray()

			beforeEach('insert class', async function() {
				await db.insert(testClass).into('class').returning('id')

			})

			it('responds with 204 and updates the action', () => {
				const idToUpdate = 2
				const updateClass = {
					class: 'updated class',
				}
				const expectedClass = {
					...testClass[idToUpdate - 1],
					...updateClass
				}
				return supertest(app)
				.patch(`/api/class/${idToUpdate}`)
				.send(updateClass)
				.expect(204)
				then( res =>
					supertest(app)
						.get(`/api/class/${idToUpdate}`)
						.expect(expectedClass)
					)
			})
		})

	})
})