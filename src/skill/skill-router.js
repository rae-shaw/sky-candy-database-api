const path = require('path')
const express = require('express')
//const xss = require('xss')
const SkillService = require('./skill-service')

const skillRouter = express.Router()
const jsonParser = express.json()

skillRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db')
		SkillService.basicSkillQuery(knexInstance)
			.then(skills => {
				res.json(skills)
			})
		.catch(next)
	})
module.exports = skillRouter