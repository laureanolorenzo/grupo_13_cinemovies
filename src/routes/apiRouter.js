const express = require('express');
const router = express.Router();
const {getUpcoming} = require('../controllers/tmdbTestController');

router.get('/upcoming',getUpcoming);

module.exports = router;