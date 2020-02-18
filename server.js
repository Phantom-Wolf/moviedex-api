// imports
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./moviedex.json');

const app = express();

// middleware

app.use(morgan('dev'));

// authorization

app.use(function validateBearerToken(req, res, next) {
	const apiToken = process.env.API_TOKEN;
	const authToken = req.get('Authorization');
	if (!authToken || authToken.split(' ')[1] !== apiToken) {
		return res.status(401).json({ error: 'Unauthorized request' });
	}
	next();
});

// body

const validGenres = [
	'Animation',
	'Drama',
	'Romantic',
	'Comedy',
	'Spy',
	'Crime',
	'Thriller',
	'Adventure',
	'Documentary',
	'Horror',
	'Action',
	'Western',
	'History',
	'Biography',
	'Musical',
	'Fantasy',
	'War',
	'Grotesque',
];

const validCountries = [
	'United States',
	'Italy',
	'Isreal',
	'Great Britain',
	'France',
	'Hungary',
	'China',
	'Canada',
	'Spain',
	'Germany',
	'Japan',
];

function handleGetMovie(req, res) {
	let response = MOVIEDEX;
	const { genre, country, avg_vote } = req.query;

	if (genre) {
		response = response.filter(movie =>
			movie.genre.toLowerCase().includes(genre.toLowerCase())
		);
	}

	if (country) {
		response = response.filter(movie =>
			movie.country.toLowerCase().includes(country.toLowerCase())
		);
	}

	if (avg_vote) {
		response = response.filter(
			movie => Number(movie.avg_vote) >= Number(avg_vote)
		);
	}

	res.json(response);
}

app.get('/movie', handleGetMovie);

// server

console.log(process.env.API_TOKEN);

const PORT = 8000;

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
