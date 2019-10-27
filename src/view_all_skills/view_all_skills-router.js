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
	.get((req, res, next) => {
		SkillService.getViewById(req.app.get('db'), req.params.id)
    	.then(skill => {
        	if(!skill) {
            //logger.error(`Level with id ${priority.id} not found.`)
            	return res.status(404).json({
                	error: { message: `Skill Not Found`}
            	})
        	}
    		res.json(res.skill)
    	})
        .catch( error => console.log('caught error ' , error))
    })

module.exports = allSkillsRouter