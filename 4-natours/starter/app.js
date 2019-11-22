const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//1. Global Middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in a hour'
});
app.use('/api', limiter);

//1) MIDDLEWARE
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	console.log('Hello from middleware!!!');
	next();
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

//3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	// const err = new Error(`Can't find ${req.originalUrl} on this server!`);
	// err.status = 'fail';
	// err.statusCode = 404;

	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
