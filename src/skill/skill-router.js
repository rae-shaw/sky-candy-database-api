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
				//console.log('*********res.body', res.body)
			})

		.catch(next)
	})

	.post(jsonParser, (req, res, next) => {
		const { primaryname, alt_names, action, age, apparatus, cs, level, priority, details, prerequisites, warm_up, video } = req.body
			if (primaryname == undefined) {
			// for(const [key,value] of Object.entries(req.body)) {
			// if (value == null) {
				return res.status(400).json({
					error: { message: `Need at least one field to add in request body`}
				})
			}
		SkillService.addSkill(
			req.app.get('db'),
			req.body
		)

			.then(skill => {
				res
					.status(201)
					.json(skill)
			})
			.catch(next)
	})

skillRouter
	.route('/id/:id') // This route is for returning exactly 1 result (or 0 for delete, etc), NOT a list
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
    
	.get((req, res, next) => {
    	res.json(res.skill)
    })

    .delete((req, res, next) => {
        SkillService.deleteSkill(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    .patch(jsonParser, (req, res, next) =>{
		const { skill } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues === 0) {
				return res.status(400).json({
					error: { message: `Request body must contain at least one field to update`}
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
	.route('name/:id')
	.patch(jsonParser, (req, res, next) => {
		SkillService.getById(req.app.get('db'), req.params.id)
    	.then(skill => {
        	if(!skill) {
            //logger.error(`Level with id ${priority.id} not found.`)
            	return res.status(404).json({
                	error: { message: `Skill Not Found`}
            	})
        }
        const { skill_id } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues === 0) {
				return res.status(400).json({
					error: { message: `Request body must contain 'skill_id'`}
				})
			}
		SkillService.updatePrimaryNameFromExisting(
			req.app.get('db'),
			req.params.id,
			req.body
			)
				.then(numRowsAffected => {
					res.status(204).end()
				})
				.catch(next)
		})
	})

    //     res.skill = skill
    //     next()
    // })


// skillRouter
// 	.route('/skill/:skill') // This route should go in to '/' with query params (?name=foo;etc=bar)
// 	.get((req, res, next) => {
// 			SkillService.getSkills(req.app.get('db'), req.params.name)
// 				.then(skills => {
// 					res.json(skills)
// 				})
// 			.catch(next)

// 	})
module.exports = skillRouter




