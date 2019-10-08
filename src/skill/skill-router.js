const path = require('path')
const express = require('express')
//const xss = require('xss')
const SkillService = require('./skill-service')

const skillRouter = express.Router()
const jsonParser = express.json()

skillRouter
	.route('/')
	.get((req, res, next) => {
		console.log('running skill router')
		const knexInstance = req.app.get('db')
		SkillService.basicSkillQuery(knexInstance)
			.then(skills => {
				res.json(skills)
			})
		.catch(next)
	})

skillRouter
	.route('/:id')
	.all((req, res, next) => {
		SkillService.getById(req.app.get('db'), req.params.id)
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
module.exports = skillRouter