const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('DB connection successful!');
	});

//Read JSON file
const tours = fs.readFileSync('./tours-simple.json', 'utf-8');

//Import data into DB
const importData = async () => {
	try {
		await Tour.create(tours);
	} catch (err) {}
};
