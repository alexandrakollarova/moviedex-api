require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

app.get('/movie', (req, res) => {
    const {genre, country, avg_vote} = req.query;
    let response = MOVIES.film_title;

    if(genre) {
        response = MOVIES.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }  
    
    if(country) {
        response = MOVIES.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase())
        )
    } 

    if(avg_vote) {
        if(Number.isNaN(avg_vote)) {
            return res
                .status(400)
                .send('Must be a number')
        }
        response = MOVIES.filter(movie => 
            movie.avg_vote >= avg_vote
        )
    }  
    

    res.json(response)
})

app.listen(8000, () => {
    console.log('server runs on port 8000')
})