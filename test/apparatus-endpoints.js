const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('apparatus Endpoints', function() {
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

	describe('GET /api/apparatus/', () => {
		context('Given no apparatus', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/apparatus')
					.expect(200, []).catch(function(error) { console.error(error); }) 
			})
		})
		context('Given there are apparatus in the database', () => {
			const testApparatus = helpers.makeApparatusArray()

			beforeEach('insert apparatus', () => {
				db.insert(testApparatus).into('apparatus').returning('id').catch(function(error) { console.error(error); })
			})


			it('GET /api/apparatus responds with 200 and all of the apparatus', () =>{
				return supertest(app)
					.get('/api/apparatus/')
					.expect(200)
					.expect( res => {
						expect(res.body.apparatus).to.eql(testApparatus.apparatus)
					})
			})
				
		})
	})
	describe(`POST /api/apparatus`, () => {
		const testApparatus = helpers.makeApparatusArray()
		beforeEach('insert apparatus', async function() {
			return await db.insert(testApparatus).into('apparatus').returning('id')
		})
		it(`responds with 400 missing 'apparatus' if not supplied`, () => {
			const newApparatusMissingApparatus = {
			}
			return supertest(app)
				.post(`/api/apparatus`)
				.send(newApparatusMissingApparatus)
				.expect(400, {
					error: { message: `Missing apparatus in request body`}
				})
		})

		it('creates an apparatus, responding with a 201 and the new apparatus', () => {
			const newApparatus ={
				apparatus: 'new apparatus'
			}
			return supertest(app)
				.post('/api/apparatus')
				.send(newApparatus)
				.expect(201)
				.expect( res => {
					expect(res.body.apparatus).to.eql(newApparatus.apparatus)
					expect(res.body).to.have.property('id')
				})
				.then(res => {
					return supertest(app)
					.get(`/api/apparatus/${res.body.id}`)
				 	.expect(200)
					.expect(res.body)
				})
		})
	})

	describe('GET /api/apparatus/:id', () => {
		context(`Given no apparatus`, () => {
			it(`responds 404 when the apparatus doesn't exist`, () => {
				return supertest(app)
					.get(`/api/apparatus/123`)
					.expect(404, {
						error: { message: `Apparatus Not Found` }
					})
			})
		})
		context(`Given there are apparatus in the database`, () => {
			const testApparatus = helpers.makeApparatusArray()


			beforeEach('insert apparatus', async function() { 
				await db.insert(testApparatus).into('apparatus').returning('id').catch(function(error) { console.error(error); })
			})

			it('GET /api/apparatus/:id responds with 200 and the specified apparatus', () => {
				const apparatusId = 2
				const expectedApparatus = testApparatus[apparatusId-1]
				return supertest(app)
					.get(`/api/apparatus/${apparatusId}`)
					.expect(200)
					.expect( res => {
						expect(res.body.apparatus).to.eql(expectedApparatus.apparatus)
						expect(res.body).to.have.property('id')
					})
			})
		})
	})

	describe('DELETE /api/apparatus/:id', () => {
		context(`Given no apparatus`, () => {
			it(`responds 404 when the apparatus doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/apparatus/123`)
				.expect(404, {
					error: { message: `Apparatus Not Found` }
				})
			})
		})
		context('Given there are apparatus in the database', () => {
			const testApparatus = helpers.makeApparatusArray()

			beforeEach('insert apparatus', async function() {
				await db.insert(testApparatus).into('apparatus').returning('id')

			})
			it('removes the apparatus by ID', () => {
				const idToRemove = 2
				const expectedApparatus = testApparatus.filter(ap => ap.id !== idToRemove)
					return supertest(app)
					.delete(`/api/apparatus/${idToRemove}`)
					.expect(204)
					.then(() =>
						supertest(app)
							.get(`/api/apparatus`)
							.expect(expectedApparatus))
			})
		})
	})
	describe(`PATCH /api/apparatus/:id`, () => {
		context(`Given no apparatus`, () =>{
			it(`responds with 404`, () => {
				const apparatusId = 123
				return supertest(app)
					.patch(`/api/apparatus/${apparatusId}`)
					.expect(404, {
						error: { message: `Apparatus Not Found`}
					})
			})
		})
		context(`Given there are apparatus in the database`, () => {
			const testApparatus = helpers.makeApparatusArray()

			beforeEach('insert apparatus', async function() {
				await db.insert(testApparatus).into('apparatus').returning('id')

			})

			it('responds with 204 and updates the apparatus', () => {
				const idToUpdate = 2
				const updateApparatus = {
					apparatus: 'updated apparatus',
				}
				const expectedApparatus = {
					...testApparatus[idToUpdate - 1],
					...updateApparatus
				}
				return supertest(app)
				.patch(`/api/apparatus/${idToUpdate}`)
				.send(updateApparatus)
				.expect(204)
				then( res =>
					supertest(app)
						.get(`/api/apparatus/${idToUpdate}`)
						.expect(expectedApparatus)
					)
			})
		})

	})
})