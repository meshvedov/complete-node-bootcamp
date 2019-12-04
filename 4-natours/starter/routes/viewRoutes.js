const express = require('express');
const viewsController = require('./../controllers/viewsController');

const router = express.Router();

router.get('/tour/:slug', viewsController.getTour);

router.get('/', viewsController.getOverview);

module.exports = router;
