const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

const verifyToken = require('../utils/middleware');

// Routes

router.put('/final/:id', verifyToken.checkLogin, rideController.finalRide); 
router.get('/request/:requestId', verifyToken.checkLogin, rideController.getRideByRequestId); 
router.post('/', verifyToken.checkLogin, rideController.createRide);
router.put('/:id', verifyToken.checkLogin, rideController.updateRide);
router.delete('/:id', verifyToken.checkLogin, rideController.deleteRide);
router.get('/:id', verifyToken.checkLogin, rideController.getRideById);
router.get('/', verifyToken.checkLogin, rideController.getAllRides);
router.get('/search', verifyToken.checkLogin, rideController.searchRides);
router.put('/accept/:id', verifyToken.checkLogin, rideController.acceptRide);
router.get('/accepted', verifyToken.checkLogin, rideController.getAcceptedRides);

module.exports = router;
