const path = require('path')
const express = require('express')
//const xss = require('xss')
const PriorityService = require('./priority-service')

const priorityRouter = express.Router()
const jsonParser = express.json()
const serializePriority = priority => ({
  id: priority.id,
  priority: priority.priority,
})

priorityRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        PriorityService.getAllPriorities(knexInstance)
            .then(priorities => {
                res.json(priorities.map(serializePriority))
            })
        .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const priority = req.body
            if (priority.priority == undefined) {
                return res.status(400).json({
                    error: { message: `Missing priority in request body`}
                })
            }
        PriorityService.insertPriority(
            req.app.get('db'),
            req.body
        )
            .then(priority => {
                res
                    .status(201)
                    .json(priority)
            })
            .catch(next)
    })

priorityRouter
    .route('/:id')
    .all((req, res, next) => {
        PriorityService.getById(req.app.get('db'), req.params.id)
        .then(priority => {
            if(!priority) {
                //logger.error(`Priority with id ${priority.id} not found.`)
                return res.status(404).json({
                    error: { message: `Priority Not Found`}
                })
            }
            console.log( 'priority', priority.id)

            res.priority = priority
            next()
        })
        .catch( error => console.log('caught error ' , error))
    })
    .get((req, res, next) => {
      res.json(serializePriority(res.priority))
    })

    .delete((req, res, next) => {
        PriorityService.deletePriority(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) =>{
        const { priority } = req.body

        const numberOfValues = Object.values(req.body).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: { message: `Request body must contain 'priority'`}
                })
            }
        PriorityService.updatePriority(
            req.app.get('db'),
            req.params.id,
            req.body
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
    })


module.exports = priorityRouter