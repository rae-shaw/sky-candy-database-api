const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('skill Endpoints', function() {
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

  	//afterEach('cleanup', () => { console.log ('running after each'); helpers.cleanTables(db).catch(function(error) { console.error(error); }) })


	//after('disconnect from db', () => db.destroy())

	describe.only('GET /api/skill', () => {
		context('Given no skills', () => {
			xit('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/skill')
					.expect(200, []).catch(function(error) { console.error(error); }) 
			})
		})
		context('Given there are skills in the database', () => {
			const testApparatus = helpers.makeApparatusArray()
			const testAge = helpers.makeAgeArray()
			const testAction = helpers.makeActionArray()
			const testLevel = helpers.makeLevelArray()
			const testClass = helpers.makeClassArray()
			const testPriority = helpers.makePriorityArray()
			const testSkills = helpers.makeSkillArray()
			const testNames = helpers.makeNameArray()

		
		beforeEach('insert data in skills and names', async function(){
			console.log('running beforeEach');
			let apparatus = await db.insert(testApparatus).into('apparatus').returning('id').catch(function(error) { console.error(error); })
			console.log('apparatus =', apparatus)
			let app_data = await db.select('*').from('apparatus')
			console.log('app_data', app_data)
			let action = await db.insert(testAction).into('action').returning('id').catch(function(error) { console.error(error); })
			console.log('action', action)
			let age = await db.insert(testAge).into('age').returning('id').catch(function(error) { console.error(error); })
			console.log('age', age)
			let level = await db.insert(testLevel).into('level').returning('id').catch(function(error) { console.error(error); })
			console.log('level', level)
			let c_s = await db.insert(testClass).into('class').returning('id').catch(function(error) { console.error(error); })
			console.log('c_s', c_s)
			let priority = await db.insert(testPriority).into('priority').returning('id').catch(function(error) { console.error(error); })
			console.log('priority', priority)
			let name = await db.insert(testNames).into('name').returning('id').catch(function(error) { console.error(error); })
			console.log('name', name)
			
			return await db.insert(testSkills).into('skill').returning('id').catch(function(error) { console.error(error); })
			//return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).catch(function(error) { console.error(error); })
			// await db('name').where('id', '=', '2').update({ skill_id: 1}).catch(function(error) { console.error(error); })
			// return await db('name').where('id', '=', '3').update({ skill_id: 1}).catch(function(error) { console.error(error); })
		})

			// beforeEach('insert data in skills and names', () => {
			// 	db.insert(testApparatus).into('apparatus').returning('id').catch(function(error) { console.error(error); })
			// 	.then(() => db.insert(testAction).into('action').returning('id').catch(function(error) { console.error(error); })
			// 	.then(() => db.insert(testAge).into('age').returning('id').catch(function(error) { console.error(error); })
			// 	.then(() => db.insert(testLevel).into('level').returning('id').catch(function(error) { console.error(error); })
			// 	.then(() => db.insert(testClass).into('class').returning('id').catch(function(error) { console.error(error); })
			// 	.then(() => db.insert(testPriority).into('priority').returning('id').catch(function(error) { console.error(error); })
			// 	.then(() => db.insert(testNames).into('name').returning('id').catch(function(error) { console.error(error); })
			// 	.then(() => db.insert(testSkills).into('skill').returning('id').catch(function(error) { console.error(error); }))
			// 	//return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).catch(function(error) { console.error(error); })
			// 	// await db('name').where('id', '=', '2').update({ skill_id: 1}).catch(function(error) { console.error(error); })
			// 	// return await db('name').where('id', '=', '3').update({ skill_id: 1}).catch(function(error) { console.error(error); })
			// })


			it('GET /api/skill responds with 200 and all of the skills', () => {
				return supertest(app)
					.get('/')
					.expect(200)
			})
				
		})
	})
		describe('DELETE /api/skill/:id', () => {
			context(`Given no skills`, () => {
				it(`responds 404 when the level doesn't exist`, () => {
					return supertest(app)
					.delete(`/api/skill/123`)
					.expect(404, {
						error: { message: `Skill Not Found` }
					})
				})
			})
			// context('Given there are levels in the database', () => {
			// 	const testLevels = helpers.makeLevelArray()

			// 	beforeEach('insert level', async function() {
			// 		await db.insert(testLevels).into('level').returning('id')

			// 	})
			// 	it('removes the level by ID', () => {
			// 		const idToRemove = 2
			// 		const expectedLevel = testLevels.filter(level => level.id !== idToRemove)
			// 			return supertest(app)
			// 			.delete(`/api/level/${idToRemove}`)
			// 			console.log('id', idToRemove)
			// 			.expect(204)
			// 			.then(() =>
			// 				supertest(app)
			// 					.get(`/api/level`)
			// 					.expect(expectedLevel))
			// 	})
			// })
		})
})
