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
			console.error(error); }) 
	})

  	afterEach('cleanup', () => { console.log ('running after each'); 
  		return helpers.cleanTables(db).catch(function(error) { console.error(error); }) 
  	})


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

			it('GET /api/skill responds with 200 and all of the skills', () => {
				const expectedSkill = [
					{
			            name: 'single knee spin',
			            apparatus: 'lyra',
			            level: '1',
			            age: 'adult',
			            priority: 'every series',
			            class: 'spin',
			            action: 'skill',
			            details: 'example details',
			            prerequisites: 'intro series',
			            warm_up: 'example warm-up here',
			            video: 'https://examplevideolink.com'
					}
				]
				return supertest(app)
					.get('/api/skill?name=single%20knee%20spin&age=adult')
					.expect(200)
					.expect( res => {
						console.log('****** res.body', res.body[0])
						expect(res.body[0].apparatus).to.eql(expectedSkill[0].apparatus)
						expect(res.body[0].level).to.eql(expectedSkill[0].level)
						expect(res.body[0].priority).to.eql(expectedSkill[0].priority)
						expect(res.body[0].class).to.eql(expectedSkill[0].class)
						expect(res.body[0].action).to.eql(expectedSkill[0].action)
						expect(res.body[0].details).to.eql(expectedSkill[0].details)
						expect(res.body[0].prerequisites).to.eql(expectedSkill[0].prerequisites)
						expect(res.body[0].warm_up).to.eql(expectedSkill[0].warm_up)
						expect(res.body[0].video).to.eql(expectedSkill[0].video)
						expect(res.body[0]).to.have.property("id")
					})
			})
		})
	})

	describe(`POST /api/skill`, () => {
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
				return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
			})
			it(`responds with 400 missing 'skill' if not supplied`, () => {
				const newSkillMissingFields = {

				}
				return supertest(app)
					.post(`/api/skill`)
					.send(newSkillMissingFields)
					.expect(400, {
						error: { message: `Need at least one field to add in request body`}
					})
			})
			it('creates an skill, responding with a 201 and the new skill', () => {
				const newSkill ={
					primaryname: 'new name',
					prerequisites: 'awesome warm-ups'
				}
				return supertest(app)
					.post(`/api/skill`)
					.send(newSkill)
					.expect(201)
					.expect( res => {
						expect(res.body[0]).to.have.property('primary_name_id')
						expect(res.body[0]).to.have.property('id')
					})
					.then(res => {
						return supertest(app)
						.get(`/api/skill/id/${res.body[0].id}`)
						.expect(res.body[0])
					})
				
			})
		})
	})

	describe('GET /api/skill/id/:id', () => {
		context(`Given no skills`, () => {
			it(`responds 404 when the skill doesn't exist`, () => {
				return supertest(app)
					.get(`/api/skill//id/123`)
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
				await db.insert(testApparatus)	.into('apparatus')	.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testAction)		.into('action')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testAge)		.into('age')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testLevel)		.into('level')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testClass)		.into('class')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testPriority)	.into('priority')	.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testNames)		.into('name')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testSkills)		.into('skill')		.returning('*')		.catch(function(error) { console.error(error); })
				return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
			})

			it('GET /api/skill/id/:id responds with 200 and the specified priority', () => {
				const skillId = 2
				const expectedSkill = testSkills[skillId-1]
				return supertest(app)
					.get(`/api/skill/id/${skillId}`)
					.expect(200)
					.expect( res => {
						expect(res.body.id).to.eql(skillId)
						expect(res.body).to.have.property('id')
					})
			})
		})
	})

	describe.only('DELETE /api/skill/id/:id', () => {
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
				await db.insert(testApparatus)	.into('apparatus')	.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testAction)		.into('action')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testAge)		.into('age')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testLevel)		.into('level')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testClass)		.into('class')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testPriority)	.into('priority')	.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testNames)		.into('name')		.returning('id')	.catch(function(error) { console.error(error); })
				await db.insert(testSkills)		.into('skill')		.returning('*')		.catch(function(error) { console.error(error); })
				return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
			})

			it('removes the skill by ID', () => {
				const idToRemove = 3
				const expectedSkill = testSkills.filter(skill => skill.id !== idToRemove)
					return supertest(app)
					.delete(`/api/skill/id/${idToRemove}`)
					.expect(204)
					.then(() => {
						return supertest(app)
							.get(`/api/skill`)
							.expect([])
					})
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
				return await db('name').whereIn( 'id', [ 1, 2, 3] ).update({ skill_id: 1}).returning('*').catch(function(error) { console.error(error); })
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
				.patch(`/api/skill/id/${idToUpdate}`)
				.send(updateSkill)
				.expect(204)
				then( res => {
					return supertest(app)
						.get(`/api/skill/${idToUpdate}`)
						.expect(expectedSkill)
					})

			})
		})

	})	

})


