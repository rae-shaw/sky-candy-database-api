const path = require('path')
const express = require('express')
const ClassService = require('./class-service')

const classRouter = express.Router()
const jsonParser = express.json()
const serializeClass = cs => ({
	id: cs.id,
	class: cs.class,
})

classRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		ClassService.getAllClasses(knexInstance)
			.then(classes => {
				res.json(classes.map(serializeClass))
			})
		.catch(next)
	})

    .post(jsonParser, (req, res, next) => {
        const cs = req.body
    
        const numberOfValues = Object.values(req.body).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: { message: `Missing class in request body`}
                })
            }
        ClassService.insertClass(
            req.app.get('db'),
            req.body
        )
            .then(cs => {
                res
                    .status(201)
                    .json(cs)
            })
            .catch(next)
    })
classRouter
	.route('/:id')
	.all((req, res, next) => {
		ClassService.getById(req.app.get('db'), req.params.id)
    	.then(cs_id => {
        	if(!cs_id) {
            	return res.status(404).json({
                	error: { message: `Class Not Found`}
            	})
        }

        res.cs_id = cs_id
        next()
    })
    .catch( error => console.log('caught error ' , error))
})
    
    .get((req, res, next) => {
        res.json(serializeClass(res.cs_id))
    })

    .patch(jsonParser, (req, res, next) =>{
        const { cs } = req.body

        const numberOfValues = Object.values(req.body).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: { message: `Request body must contain 'class'`}
                })
            }
        ClassService.updateClass(
            req.app.get('db'),
            req.params.id,
            req.body
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
    })

    .delete((req, res, next) => {
        ClassService.deleteClass(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
})

module.exports = classRouter