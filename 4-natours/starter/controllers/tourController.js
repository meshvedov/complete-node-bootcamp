// const fs = require('fs');
const Tour = require('./../models/tourModel');
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

exports.getAllTours = async (req, res) => {
	try {
		const tours = await Tour.find(req.body);

		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: {
				tours
			}
		});
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		});
	}
};

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

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err
		});
	}
};

// exports.updateTour = (req, res) => {
// 	res.status(200).json({
// 		status: 'success',
// 		data: {
// 			tour: '<Updating success...>'
// 		}
// 	});
// };

exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: 'Invalid data sent!'
		});
	}
};

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});
		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err
		});
	}
};

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

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success',
			data: null
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err
		});
	}
};

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }

//     next();
// };
