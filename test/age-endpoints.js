const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('age Endpoints', function() {
	let db 

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		})
		app.set('db', db)
	})

	before('cleanup', () => { 
		return helpers.cleanTables(db).catch(function(error) { console.error(error); }) })

  	afterEach('cleanup', () => { 
  		return helpers.cleanTables(db).catch(function(error) { console.error(error); }) })

	after('disconnect from db', () => db.destroy())

	describe('GET /api/age/', () => {
		context('Given no age', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/age')
					.expect(200, []).catch(function(error) { console.error(error); }) 
			})
		})
		context('Given there are ages in the database', () => {
			const testAge = helpers.makeAgeArray()

			beforeEach('insert age', async function() {
				return await db.insert(testAge).into('age').returning('id').catch(function(error) { console.error(error); })
			})


			it('GET /api/age responds with 200 and all of the notes', () =>{
				return supertest(app)
					.get('/api/age')
					.expect( res => {
						expect(res.body.age).to.eql(testAge.age)
						expect(res.body[0]).to.have.property("id")
						//.catch(function(error) { console.error(error) }); 
					})
			})
				
		})
	})
	describe('GET /api/age/:id', () => {
		context(`Given no ages`, () => {
			it(`responds 404 when the ages doesn't exist`, () => {
				return supertest(app)
					.get(`/api/age/123`)
					.expect(404, {
						error: { message: `Age Not Found` }
					})
			})
		})
		context(`Given there are ages in the database`, () => {
			const testAge = helpers.makeAgeArray()

			beforeEach('insert age', async function() { 
				return await db.insert(testAge).into('age').returning('id').catch(function(error) { console.error(error); })
			})

			it('GET /api/age/:id responds with 200 and the specified age', () => {
				const ageId = 2
				const expectedAge = testAge[ageId-1]
				console.log('expectedAge', expectedAge)
				return supertest(app)
					.get(`/api/age/${ageId}`)
					.expect( res => {
						expect(200)
						expect(res.body.age).to.eql(expectedAge.age)
					})
			})
		})
	})
	describe(`POST /api/age`, () => {
		const testAge = helpers.makeAgeArray()
		beforeEach('insert age', async function() {
				return await db.insert(testAge).into('age').returning('id')
		})
		it(`responds with 400 missing 'age' if not supplied`, () => {
			const newAgeMissingAge = {

			}
			return supertest(app)
				.post(`/api/age`)
				.send(newAgeMissingAge)
				.expect(400, {
					error: { message: `Missing age in request body`}
				})
		})
		it('creates an age, responding with a 201 and the new age', () => {
			const newAge ={
				age: 'new age'
			}
			return supertest(app)
				.post(`/api/age`)
				.send(newAge)
				.expect(201)
				.expect( res => {
					expect(res.body.age).to.eql(newAge.age)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					supertest(app)
					.get(`/api/age/${res.body.id}`)
					.expect(res.body)
				})
				
			})
	})
	describe('DELETE /api/age/:id', () => {
		context(`Given no ages`, () => {
			it(`responds 404 when the age doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/age/123`)
				.expect(404, {
					error: { message: `Age Not Found` }
				})
			})
		})
		context('Given there are ages in the database', () => {
			const testAge = helpers.makeAgeArray()

			beforeEach('insert age', async function() {
				await db.insert(testAge).into('age').returning('id')

			})
			it('removes the age by ID', () => {
				const idToRemove = 2
				const expectedAge = testAge.filter(ap => ap.id !== idToRemove)
					return supertest(app)
					.delete(`/api/age/${idToRemove}`)
					console.log('id', idToRemove)
					.expect(204)
					.then(() =>
						supertest(app)
							.get(`/api/age`)
							.expect(expectedAge))
			})
		})
	})
	describe(`PATCH /api/age/:id`, () => {
		context(`Given no age`, () =>{
			it(`responds with 404`, () => {
				const ageId = 123
				return supertest(app)
					.patch(`/api/age/${ageId}`)
					.expect(404, {
						error: { message: `Age Not Found`}
					})
			})
		})
		context(`Given there are ages in the database`, () => {
			const testAge = helpers.makeAgeArray()

			beforeEach('insert age', async function() {
				return await db.insert(testAge).into('age').returning('id')

			})

			it('responds with 204 and updates the age', () => {
				const idToUpdate = 2
				const updateAge = {
					age: 'updated age',
				}
				const expectedAge = {
					...testAge[idToUpdate - 1],
					...updateAge
				}
				return supertest(app)
				.patch(`/api/age/${idToUpdate}`)
				.send(updateAge)
				.expect(204)
				then( res =>
					supertest(app)
						.get(`/api/age/${idToUpdate}`)
						.expect(expectedAge)
					)
			})
		})

	})
})