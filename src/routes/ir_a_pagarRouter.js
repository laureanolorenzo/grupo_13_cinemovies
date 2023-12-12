const express = require('express');
const router = express.Router();
const ir_a_pagarController = require('../controllers/ir_a_pagarController');

router.get('/ir_a_pagar', ir_a_pagarController.ir_a_pagarView);

module.exports = router;