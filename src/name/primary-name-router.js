const path = require('path')
const express = require('express')
//const xss = require('xss')
const NameService = require('./name-service')

const primaryNameRouter = express.Router()
const jsonParser = express.json()
const serializeName = name => ({
	//id: name.id,
	name: name.name,
	skill_id: name.skill_id,
})



primaryNameRouter
	.route('/')
	.post(jsonParser, (req, res, next) =>{
		const { name, skill_id } = req.body

		const numberOfValues = Object.values(req.body).filter(Boolean).length
			if (numberOfValues < 2) {
				return res.status(400).json({
					error: { message: `Request body must contain 2 fields, 'name' and 'skill_id'`}
				})
			}
		NameService.addPrimaryName(
			req.app.get('db'),
			req.body
			)
				.then(name => {
				console.log("****** res.body", res.body)
                res
                    .status(201)
                    .json(name)

            	})
				.catch(next)
	})

module.exports = primaryNameRouter