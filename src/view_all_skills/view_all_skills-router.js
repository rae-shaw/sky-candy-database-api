const path = require('path')
const express = require('express')
//const xss = require('xss')
const SkillService = require('../skill/skill-service')

const allSkillsRouter = express.Router()
const jsonParser = express.json()

allSkillsRouter
	.route('/') // this route always returns a list, even if empty, even if exactly 1 result.
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		SkillService.getSkills(knexInstance, req.query)
			.then(skills => {
				res.json(skills)
			})

		.catch(next)
	})

allSkillsRouter
	.route('/id/:id') // This route is for returning exactly 1 result, NOT a list
 	.all((req, res, next) => {
		SkillService.getViewById(req.app.get('db'), req.params.id)
			.then(skill => {
				if(!skill) {
					//logger.error(`Apparatus with id ${apparatus.id} not found.`)
					return res.status(404).json({
						error: { message: `Apparatus Not Found`}
					})
				}
				res.skill = skill
				next()
			})
			.catch( error => console.log('caught error ' , error))
		})

	.get((req, res, next) => {
		res.json(res.skill)
	})

module.exports = allSkillsRouter