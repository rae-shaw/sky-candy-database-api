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

	before('cleanup', () => { 
		return helpers.cleanTables(db).catch(function(error) { 
			console.error(error); }) })

  	afterEach('cleanup', () => { console.log ('running after each'); helpers.cleanTables(db).catch(function(error) { console.error(error); }) })


	after('disconnect from db', () => db.destroy())

	describe('GET /api/skill', () => {
		context('Given no skills', () => {
			it('responds with 200 and an empty list', () => {
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
			// testData (db, data, table) {
			// 	return await db.insert(data).into(table).returning('id').catch(function(error) { console.error(error); })
			// }

			// testData(db, testApparatus, 'apparatus')
			// testData(db, testAction,    'action')
			// testData(db, testAge,       'age')
			await db.insert(testApparatus) .into('apparatus') .catch(function(error) { console.error(error); })
			await db.insert(testAction)    .into('action')    .catch(function(error) { console.error(error); })
			await db.insert(testAge)       .into('age')       .catch(function(error) { console.error(error); })
			await db.insert(testLevel)     .into('level')     .catch(function(error) { console.error(error); })
			await db.insert(testClass)     .into('class')     .catch(function(error) { console.error(error); })
			await db.insert(testPriority)  .into('priority')  .catch(function(error) { console.error(error); })
			await db.insert(testNames)     .into('name')      .catch(function(error) { console.error(error); })

			await db.insert(testSkills)    .into('skill')    .returning('*')  .catch(function(error) { console.error(error); })
			return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
			 // let allSkills = await db.select('*').from('all_skills')
			// console.log("*****allSkills*****", allSkills)
		})

			it('GET /api/skill responds with 200 and all of the skills', () => {
				const expectedSkill = [{
    				id: 1,
    				name: 'single knee spin',
				    alternate_names: 'tornado spin;fun spin'
				  }]
				return supertest(app)
					.get('/api/skill?apparatus=lyra%20boy&level=intro')
					.expect(200)
					.expect( res => {
						expect(res.body).to.eql(expectedSkill)
						expect(res.body[0]).to.have.property("id")
					})
			})
			it('GET /api/skill/name/:name responds with 200 and all of the skills', () => {
				const expectedSkill = [{
    				id: 1,
    				name: 'single knee spin',
				    alternate_names: 'tornado spin;fun spin'
				  }]
				return supertest(app)
					.get(`/api/skill/name/${expectedSkill[0].name}`) // NEED TO URLENCODE/DECODE
					//.get(`/api/skill/?name=;`)
					.expect(200)
					.expect( res => {
						expect(res.body).to.eql(expectedSkill)
						expect(res.body[0]).to.have.property("id")
					})
			})
				
		})
	})
	describe('DELETE /api/skill/id/:id', () => {
		context(`Given no skills`, () => {
			it(`responds 404 when the level doesn't exist`, () => {
				return supertest(app)
				.delete(`/api/skill/id/123`)
				.expect(404, {
					error: { message: `Skill Not Found` }
				})
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
				await db.insert(testApparatus).into('apparatus').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testAction).into('action').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testAge).into('age').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testLevel).into('level').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testClass).into('class').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testPriority).into('priority').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testNames).into('name').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testSkills).into('skill').returning('*').catch(function(error) { console.error(error); })
				await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
			})

			it('removes the skill by ID', () => {
				const idToRemove = 1
				const expectedSkill = testSkills.filter(skill => skill.id !== idToRemove)
					return supertest(app)
					.delete(`/api/skill/id/${idToRemove}`)
					console.log('id', idToRemove)
					.expect(204)
					.then(() =>
						supertest(app)
							.get(`/api/skill`)
							.expect([]))
			})
		})
	})
	describe(`PATCH /api/skill/id/:id`, () => {
		context(`Given no skill`, () =>{
			it(`responds with 404`, () => {
				const skillId = 123
				return supertest(app)
					.patch(`/api/skill/id/${skillId}`)
					.expect(404, {
						error: { message: `Skill Not Found`}
					})
			})
		})
		context(`Given there are skills in the database`, () => {
			const testApparatus = helpers.makeApparatusArray()
			const testAge = helpers.makeAgeArray()
			const testAction = helpers.makeActionArray()
			const testLevel = helpers.makeLevelArray()
			const testClass = helpers.makeClassArray()
			const testPriority = helpers.makePriorityArray()
			const testSkills = helpers.makeSkillArray()
			const testNames = helpers.makeNameArray()

			beforeEach('insert data in skills and names', async function(){
				await db.insert(testApparatus).into('apparatus').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testAction).into('action').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testAge).into('age').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testLevel).into('level').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testClass).into('class').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testPriority).into('priority').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testNames).into('name').returning('id').catch(function(error) { console.error(error); })
				await db.insert(testSkills).into('skill').returning('*').catch(function(error) { console.error(error); })
				await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
			})

			it('responds with 204 and updates the skill', () => {
				const idToUpdate = 1
				const updateSkill = {
					details: 'updated details',
            		prerequisites: 'updated series',
            		warm_up: 'updated warm-up here',
            		video: 'https://updatedvideolink.com'
				}
				const expectedSkill = {
					...testSkills[idToUpdate - 1],
					...updateSkill
				}
				return supertest(app)
				.patch(`/api/skill/${idToUpdate}`)
				.send(updateSkill)
				.expect(204)
				then( res =>
					supertest(app)
						.get(`/api/skill/${idToUpdate}`)
						.expect(expectedSkill)
					)

			})
		})

	})
	

})
//POST 
//transaction
// 1. start
// 2. name w/o skill id
// 3. post skill
// 4. update name table with skill_id
// 5. commit/rollback trx

//adding queries to the view query?


//patch-> how will this come through from the client-side?
