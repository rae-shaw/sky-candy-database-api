const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('sky_candy_curriculum Endpoints', function() {
	let db 

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		})
		app.set('db', db)
		db.debug()
	})


	before('clean the table', () => { db.raw("truncate table apparatus cascade").catch(function(error) { console.error(error); }) })

	afterEach('cleanup', () => { db.raw("truncate table apparatus cascade").catch(function(error) { console.error(error); }) })


	after('disconnect from db', () => db.destroy())




		
})
