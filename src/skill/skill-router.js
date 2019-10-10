const path = require('path')
const express = require('express')
//const xss = require('xss')
const SkillService = require('./skill-service')

const skillRouter = express.Router()
const jsonParser = express.json()

skillRouter
	.route('/') // this route always returns a list, even if empty, even if exactly 1 result.
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		SkillService.getSkills(knexInstance, req.query)
			.then(skills => {
				res.json(skills)
			})
		.catch(next)
	})

skillRouter
	.route('/id/:id') // This route is for returning exactly 1 result (or 0 for delete, etc), NOT a list
	.all((req, res, next) => {
		SkillService.getSkills(req.app.get('db'), req.params.id)
    	.then(skill => {
        	if(!skill) {
            //logger.error(`Level with id ${priority.id} not found.`)
            	return res.status(404).json({
                	error: { message: `Skill Not Found`}
            	})
        }

        res.skill = skill
        next()
    })
        .catch( error => console.log('caught error ' , error))
    })
    .patch(jsonParser, (req, res, next) =>{
		const { skill } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues === 0) {
				return res.status(400).json({
					error: { message: `Request body must contain 'action'`}
				})
			}
		SkillService.updateSkill(
			req.app.get('db'),
			req.params.id,
			req.body
			)
				.then(numRowsAffected => {
					res.status(204).end()
				})
				.catch(next)
	})
skillRouter
	.route('/name/:name') // This route should go in to '/' with query params (?name=foo;etc=bar)
	.get((req, res, next) => {
			SkillService.getSkills(req.app.get('db'), req.params.name)
				.then(skills => {
					res.json(skills)
				})
			.catch(next)

	})
module.exports = skillRouter