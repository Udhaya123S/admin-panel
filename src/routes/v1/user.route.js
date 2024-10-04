const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/user.controller');
const { authenticate } = require('../../middlewares/auth');

router.get('/dashboard', authenticate, dashboardController.getDashboard);

router.get('/list',dashboardController. getUsers);

router.get('/',dashboardController.getdetail);

module.exports = router;
