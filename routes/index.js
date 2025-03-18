const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.use('/rotas', require('./rotaRoutes'));
router.use('/despesas', require('./despesaRoutes'));
router.get('/dashboard', dashboardController.getDashboardData);

module.exports = router;