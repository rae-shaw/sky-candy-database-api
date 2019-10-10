const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const Article = require('./models').Article;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Function to handle the root path
skillRouter
	.get('/', (req, res, next) => {

    // Access the provided 'level' and 'age' query parameters
    let level = req.query.level;
    let age = req.query.age;

    let skills = await Article.findAll().paginate({page: page, limit: limit}).exec();

    // Return the articles to the rendering engine
    res.render('index', {
        articles: articles
    });
});

let server = app.listen(8080, function() {
    console.log('Server is listening on port 8080')
});

    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        PriorityService.getAllPriorities(knexInstance)
            .then(priorities => {
                res.json(priorities.map(serializePriority))
            })
        .catch(next)
    })

        .get((req, res, next) => {
      res.json(serializePriority(res.priority))
    })