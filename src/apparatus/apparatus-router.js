const path = require('path')
const express = require('express')
const ApparatusService = require('./apparatus-service')

const apparatusRouter = express.Router()
const jsonParser = express.json()
const serializeApparatus = apparatus => ({
	id: apparatus.id,
	apparatus: apparatus.apparatus,
})

apparatusRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		ApparatusService.getAllApparatus(knexInstance)
			.then(apparatus => {
				res.json(apparatus.map(serializeApparatus))
			})
		.catch(next)
	})
	.post(jsonParser, (req, res, next) => {
		const apparatus = req.body
		console.log('apparatus', apparatus)
	
			if (apparatus.apparatus == undefined) {
				return res.status(400).json({
					error: { message: `Missing apparatus in request body`}
				})
			}
		ApparatusService.insertApparatus(
			req.app.get('db'),
			apparatus
		)
			.then(apparatus => {
				res
					.status(201)
					.json(apparatus)
			})
			.catch(next)
	})

	

apparatusRouter
	.route('/:id')
	.all((req, res, next) => {
		ApparatusService.getById(req.app.get('db'), req.params.id)
			.then(apparatus => {
				if(!apparatus) {
					return res.status(404).json({
						error: { message: `Apparatus Not Found`}
					})
				}
				res.apparatus = apparatus
				next()
			})
			.catch( error => console.log('caught error ' , error))
		})

	.get((req, res, next) => {
		res.json(serializeApparatus(res.apparatus))
	})

	.delete((req, res, next) => {
		ApparatusService.deleteApparatus(
			req.app.get('db'),
			req.params.id
		)
			.then(numRowsAffected => {
				res.status(204).end()
			})
			.catch(next)
	})

	.patch(jsonParser, (req, res, next) =>{
		const { name } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues === 0) {
				return res.status(400).json({
					error: { message: `Request body must contain 'apparatus'`}
				})
			}
		ApparatusService.updateApparatus(
			req.app.get('db'),
			req.params.id,
			req.body
			)
				.then(numRowsAffected => {
					res.status(204).end()
				})
				.catch(next)
	})


module.exports = apparatusRouter