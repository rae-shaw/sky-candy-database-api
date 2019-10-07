const path = require('path')
const express = require('express')
//const xss = require('xss')
const AgeService = require('./age-service')

const ageRouter = express.Router()
const jsonParser = express.json()
const serializeAge = age => ({
	id: age.id,
	age: age.age,
})

ageRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		AgeService.getAllAges(knexInstance)
			.then(ages => {
				res.json(ages.map(serializeAge))
			})
		.catch(next)
	})
	.post(jsonParser, (req, res, next) => {
		const age = req.body
	
			if (age.age == undefined) {
				return res.status(400).json({
					error: { message: `Missing age in request body`}
				})
			}
		AgeService.insertAge(
			req.app.get('db'),
			req.body
		)
			.then(age => {
				res
					.status(201)
					.json(age)
			})
			.catch(next)
	})

ageRouter
	.route('/:id')
	.all((req, res, next) => {
		AgeService.getById(req.app.get('db'), req.params.id)
			.then(age => {
				if(!age) {
					//logger.error(`Apparatus with id ${apparatus.id} not found.`)
					return res.status(404).json({
						error: { message: `Age Not Found`}
					})
				}
				res.age = age
				next()
			})
			.catch( error => console.log('caught error ' , error))
		})

	.get((req, res, next) => {
		res.json(serializeAge(res.age))
	})
	.delete((req, res, next) => {
		AgeService.deleteAge(
			req.app.get('db'),
			req.params.id
		)
			.then(numRowsAffected => {
				res.status(204).end()
			})
			.catch(next)
	})

	.patch(jsonParser, (req, res, next) =>{
		const { age } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues === 0) {
				return res.status(400).json({
					error: { message: `Request body must contain 'age'`}
				})
			}
		AgeService.updateAge(
			req.app.get('db'),
			req.params.id,
			req.body
			)
				.then(numRowsAffected => {
					res.status(204).end()
				})
				.catch(next)
	})

module.exports = ageRouter