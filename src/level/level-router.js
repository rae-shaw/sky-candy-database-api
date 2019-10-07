const path = require('path')
const express = require('express')
//const xss = require('xss')
const LevelService = require('./level-service')

const levelRouter = express.Router()
const jsonParser = express.json()
const serializeLevel = level => ({
	id: level.id,
	level: level.level,
})

levelRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		LevelService.getAllLevels(knexInstance)
			.then(level => {
				res.json(level.map(serializeLevel))
			})
		.catch(next)
	})
    .post(jsonParser, (req, res, next) => {
        const level = req.body
    
            if (level.level == undefined) {
                return res.status(400).json({
                    error: { message: `Missing level in request body`}
                })
            }
        LevelService.insertLevel(
            req.app.get('db'),
            req.body
        )
            .then(level => {
                res
                    .status(201)
                    .json(level)
            })
            .catch(next)
    })

levelRouter
	.route('/:id')
	.all((req, res, next) => {
		LevelService.getById(req.app.get('db'), req.params.id)
    	.then(level => {
        	if(!level) {
            //logger.error(`Level with id ${priority.id} not found.`)
            	return res.status(404).json({
                	error: { message: `Level Not Found`}
            	})
        }

        res.level = level
        next()
    })
        .catch( error => console.log('caught error ' , error))
    })
    .get((req, res, next) => {
        res.json(serializeLevel(res.level))
    })

    .delete((req, res, next) => {
        LevelService.deleteLevel(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    .patch(jsonParser, (req, res, next) =>{
        const { level } = req.body

        const numberOfValues = Object.values(req.body).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: { message: `Request body must contain 'level'`}
                })
            }
        LevelService.updateLevel(
            req.app.get('db'),
            req.params.id,
            req.body
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
    })

module.exports = levelRouter