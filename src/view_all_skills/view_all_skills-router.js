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

module.exports = allSkillsRouter