require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const logger = require('./logger')

const authRouter = require('./auth/auth-router')
const apparatusRouter = require('./apparatus/apparatus-router')
const ageRouter = require('./age/age-router')
const actionRouter = require('./action/action-router')
const classRouter = require('./class/class-router')
const levelRouter = require('./level/level-router')
const priorityRouter = require('./priority/priority-router')
const skillRouter = require('./skill/skill-router')
const nameRouter = require('./name/name-router')
const primaryNameRouter = require('./name/primary-name-router')
const allSkillsRouter = require('./view_all_skills/view_all_skills-router')
// const skillIdRouter = require('./skill/skill-router')


const app = express()

const morganOption = (NODE_ENV === 'production')
 	? 'tiny'
 	: 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(
    cors(
        //origin: CLIENT_ORIGIN
    )
);

app.use('/api/auth', authRouter)
app.use('/api/apparatus', apparatusRouter)
app.use('/api/age', ageRouter)
app.use('/api/action', actionRouter)
app.use('/api/class', classRouter)
app.use('/api/level', levelRouter)
app.use('/api/priority', priorityRouter)
app.use('/api/name/primaryname', primaryNameRouter)
app.use('/api/name/name', nameRouter)
app.use('/api/skill', skillRouter)
app.use('/api/allskills', allSkillsRouter)
// app.use('api/skill/id/:id', skillRouter)



app.use(function errorHandler(error, req, res, next) {
	let response
	if (NODE_ENV === 'production') {
		logger.error(error)
		response = { error: { message: 'server error' } }
	} else {
		console.error(error)
		response = { message: error.message, error }
	}
	res.status(500).json(response)
})

module.exports = app