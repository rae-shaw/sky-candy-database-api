const path = require('path')
const express = require('express')
//const xss = require('xss')
const NameService = require('./name-service')

const nameRouter = express.Router()
const primaryNameRouter = express.Router()
const jsonParser = express.json()
const serializeName = name => ({
	id: name.id,
	name: name.name,
	skill_id: name.skill_id,
})

nameRouter
	.route('/')
	.post(jsonParser, (req, res, next) =>{
		const { name, skill_id } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues === 0) {
				return res.status(400).json({
					error: { message: `Request body must contain 'name'`}
				})
			}
		NameService.addAlternateName(
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

nameRouter
	.route('/:id')
	.all((req, res, next) => {
		NameService.getById(req.app.get('db'), req.params.id)
    	.then(name => {
        	if(!name) {
            //logger.error(`Name with id ${priority.id} not found.`)
            	return res.status(404).json({
                	error: { message: `Name Not Found`}
            	})
        }

        res.name = name
        console.log('************************* name',name)
        next()
    	})
        .catch( error => console.log('caught error ' , error))
    })

    .get((req, res, next) => {
        res.json(serializeName(res.name))
    })

    .delete((req, res, next) => {
        NameService.deleteName(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                console.log(numRowsAffected)
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) =>{
        const { name, skill_id } = req.body

        const numberOfValues = Object.values(req.body).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: { message: `Request body must contain 'name'`}
                })
            }
        NameService.updateName(
            req.app.get('db'),
            req.params.id,
            req.body
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
    })

module.exports = nameRouter



