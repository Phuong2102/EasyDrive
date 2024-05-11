const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    destination: { type: Object, required: true },
    pickupLocation: { type: Object, required: true },
    vehicleType: { type: String, required: true },
    paymentMethod: { type: String, default: 'cash' },
    status: { type: String, default: 'pending' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total: { type: Number, required: true },
    kilometer: { type: Number, required: true },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });


module.exports = mongoose.model('Ride', rideSchema);
