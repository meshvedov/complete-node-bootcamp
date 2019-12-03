// const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour ID is ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         })
//     };
//     next();
// }

// exports.getAllTours = (req, res) => {
// 	res.status(200).json({
// 		status: 'success',
// 		requestedAt: req.requestTime,
// 		results: tours.length,
// 		data: {
// 			tours
// 		}
// 	});
// };

exports.aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

// exports.getAllTours = catchAsync(async (req, res, next) => {
// 	const features = new APIFeatures(Tour.find(), req.query)
// 		.filter()
// 		.sort()
// 		.limitFields()
// 		.paginate();
// 	const tours = await features.query;

// 	res.status(200).json({
// 		status: 'success',
// 		results: tours.length,
// 		data: {
// 			tours
// 		}
// 	});
// try {
// 	//Build Query
// 	//1) Filtering

// 	//3) Sorting

// 	//3) Field Limiting
// 	// if (req.query.fields) {
// 	// 	const fields = req.query.fields.split(',').join(' ');
// 	// 	query = query.select(fields);
// 	// } else {
// 	// 	query = query.select('-__v');
// 	// }

// 	//4) Pagination
// 	//?page=2&limit=10
// 	// const page = req.query.page * 1 || 1;
// 	// const limit = req.query.limit * 1 || 100;
// 	// const skip = (page - 1) * limit;
// 	// query = query.skip(skip).limit(limit);

// 	// if (req.query.page) {
// 	// 	const numTours = await Tour.countDocuments();
// 	// 	if (skip > numTours) throw new Error('This page does not exist');
// 	// }

// 	//Execute Query
// 	const features = new APIFeatures(Tour.find(), req.query)
// 		.filter()
// 		.sort()
// 		.limitFields()
// 		.paginate();
// 	const tours = await features.query;

// 	res.status(200).json({
// 		status: 'success',
// 		results: tours.length,
// 		data: {
// 			tours
// 		}
// 	});
// } catch (error) {
// 	res.status(404).json({
// 		status: 'fail',
// 		message: error
// 	});
// }

// exports.getTour = (req, res) => {
// 	console.log(req.params);
// 	const id = req.params.id * 1;
// 	const tour = tours.find(el => el.id === id);

// 	if (!tour) {
// 	    return res.status(404).json({
// 	        status: 'fail',
// 	        message: 'Invalid ID'
// 	    })
// 	}

// 	res.status(200).json({
// 	    status: 'success',
// 	    results: tours.length,
// 	    data: {
// 	        tour
// 	    }
// 	});
// };
exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

// exports.createTour = (req, res) => {
//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({ id: newId }, req.body);
//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour,
//             }
//         });
//     })
//     // res.send('Done');
// };

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
// 	const tour = await Tour.findByIdAndDelete(req.params.id);

// 	if (!tour) {
// 		return next(new AppError('No tour found with that ID', 404));
// 	}
// 	res.status(204).json({
// 		status: 'success',
// 		data: null
// 	});
// });

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }

//     next();
// };

exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{ $match: { ratingsAverage: { $gte: 4.5 } } },
		{
			$group: {
				_id: { $toUpper: '$difficulty' },
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' }
			}
		},
		{ $sort: { avgPrice: 1 } }
		// { $match: { _id: { $ne: 'EASY' } } }
	]);

	res.status(200).json({
		status: 'success',
		data: {
			stats
		}
	});
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = req.params.year * 1;
	const plan = await Tour.aggregate([
		{
			$unwind: '$startDates'
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`)
				}
			}
		},
		{
			$group: {
				_id: { $month: '$startDates' },
				numTourStarts: { $sum: 1 },
				tours: { $push: '$name' }
			}
		},
		{
			$addFields: { month: '$_id' }
		},
		{
			$project: {
				_id: 0
			}
		},
		{
			$sort: { numTourStarts: -1 }
		},
		{
			$limit: 6
		}
	]);

	res.status(200).json({
		status: 'success',
		results: plan.length,
		data: {
			plan
		}
	});
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');

	const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng) {
		next(new AppError('Please provide latitude and longitude', 400));
	}

	const tours = await Tour.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
	});

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			data: tours
		}
	});
});

exports.getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');

	const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

	if (!lat || !lng) {
		next(
			new AppError(
				'Please provide latitude and longitude! (getDistances)',
				400
			)
		);
	}
	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [lng * 1, lat * 1]
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier
			}
		},
		{
			$project: {
				distance: 1,
				name: 1
			}
		}
	]);

	res.status(200).json({
		status: 'success',
		data: {
			data: distances
		}
	});
});
