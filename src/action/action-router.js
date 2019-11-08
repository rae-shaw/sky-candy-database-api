const path = require('path')
const express = require('express')
const ActionService = require('./action-service')

const actionRouter = express.Router()
const jsonParser = express.json()
const serializeAction = action => ({
	id: action.id,
	action: action.action,
})

actionRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		ActionService.getAllActions(knexInstance)
			.then(actions => {
				res.json(actions.map(serializeAction))
			})
		.catch(next)
	})
	.post(jsonParser, (req, res, next) => {
		const action = req.body
	
			if (action.action == undefined) {
				return res.status(400).json({
					error: { message: `Missing action in request body`}
				})
			}
		ActionService.insertAction(
			req.app.get('db'),
			req.body
		)
			.then(action=> {
				res
					.status(201)
					.json(action)
			})
			.catch(next)
	})

actionRouter
	.route('/:id')
	.all((req, res, next) => {
		ActionService.getById(req.app.get('db'), req.params.id)
			.then(action => {
				if(!action) {
					return res.status(404).json({
						error: { message: `Action Not Found`}
					})
				}
				res.action = action
				next()
			})
			.catch( error => console.log('caught error ' , error))
		})

	.get((req, res, next) => {
		res.json(serializeAction(res.action))
	})
	.delete((req, res, next) => {
		ActionService.deleteAction(
			req.app.get('db'),
			req.params.id
		)
			.then(numRowsAffected => {
				res.status(204).end()
			})
			.catch(next)
	})

	.patch(jsonParser, (req, res, next) =>{
		const { action } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues === 0) {
				return res.status(400).json({
					error: { message: `Request body must contain 'action'`}
				})
			}
		ActionService.updateAction(
			req.app.get('db'),
			req.params.id,
			req.body
			)
				.then(numRowsAffected => {
					res.status(204).end()
				})
				.catch(next)
	})

module.exports = actionRouter