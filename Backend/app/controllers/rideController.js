'use strict';
const RideModel = require('../models/ride');
const UserModel = require('../models/user');
const mongoose = require('mongoose');

const rideController = {
    
    getRideByRequestId: async (req, res) => {
        try {
            const requestId = req.params.requestId; 
    
            // Tìm kiếm ride dựa trên requestId và nối thông tin user của requesterId
            const ride = await RideModel.find({ requesterId: requestId }).populate('requesterId').populate('driverId');
    
            if (!ride) {
                return res.status(404).json({ error: 'Ride not found' });
            }
    
            // Trả về thông tin của ride nếu tìm thấy
            res.status(200).json(ride);
        } catch (error) {
            console.error('Error getting ride by Request ID:', error);
            res.status(500).json({ error: 'Failed to get ride by Request ID' });
        }
    },

    createRide: async (req, res) => {
        try {
            const { requesterId, destination, pickupLocation, vehicleType, paymentMethod, total, kilometer } = req.body;
    
            const newRide = new RideModel({
                requesterId,
                destination,
                pickupLocation,
                vehicleType,
                paymentMethod,
                total,
                kilometer,
            });
    
            const ride = await newRide.save();
            res.status(201).json(ride);
        } catch (error) {
            console.error('Error creating ride:', error);
            res.status(500).json({ error: 'Failed to create ride' });
        }
    },
    

    updateRide: async (req, res) => {
        try {
            const rideId = req.params.id;
            const { destination, pickupLocation, vehicleType, paymentMethod, total, kilometer } = req.body;

            await RideModel.findByIdAndUpdate(rideId, {
                destination,
                pickupLocation,
                vehicleType,
                paymentMethod,
                total,
                kilometer
            });

            res.status(200).json({ message: 'Ride updated successfully' });
        } catch (error) {
            console.error('Error updating ride:', error);
            res.status(500).json({ error: 'Failed to update ride' });
        }
    },


    deleteRide: async (req, res) => {
        try {
            const rideId = req.params.id;

            await RideModel.findByIdAndDelete(rideId);

            res.status(200).json({ message: 'Ride deleted successfully' });
        } catch (error) {
            console.error('Error deleting ride:', error);
            res.status(500).json({ error: 'Failed to delete ride' });
        }
    },

    getRideById: async (req, res) => {
        try {
            const rideId = req.params.id;

            const ride = await RideModel.findById(rideId);

            if (!ride) {
                return res.status(404).json({ error: 'Ride not found' });
            }

            res.status(200).json(ride);
        } catch (error) {
            console.error('Error getting ride by ID:', error);
            res.status(500).json({ error: 'Failed to get ride by ID' });
        }
    },

    getAllRides: async (req, res) => {
        try {
            // Lấy tất cả rides và nối thông tin user của cả requesterId và driverId
            const rides = await RideModel.find().populate('requesterId').populate('driverId');
    
            res.status(200).json(rides);
        } catch (error) {
            console.error('Error getting all rides:', error);
            res.status(500).json({ error: 'Failed to get all rides' });
        }
    },

    searchRides: async (req, res) => {
        try {
            const keyword = req.query.keyword;

            const rides = await RideModel.find({
                $or: [
                    { destination: { $regex: keyword, $options: 'i' } },
                    { pickupLocation: { $regex: keyword, $options: 'i' } }
                ]
            });

            res.status(200).json(rides);
        } catch (error) {
            console.error('Error searching rides:', error);
            res.status(500).json({ error: 'Failed to search rides' });
        }
    },

    acceptRide: async (req, res) => {
        try {
            const rideId = req.params.id;
            const { driverId } = req.body;

            const user = await UserModel.findById(driverId);
            if (!user || user.role !== 'isRides') {
                return res.status(403).json({ error: 'Permission denied. Only drivers can accept rides.' });
            }

            await RideModel.findByIdAndUpdate(rideId, { status: 'accepted', driverId });

            res.status(200).json({ message: 'Ride accepted successfully' });
        } catch (error) {
            console.error('Error accepting ride:', error);
            res.status(500).json({ error: 'Failed to accept ride' });
        }
    },

    finalRide: async (req, res) => {
        try {
            const rideId = req.params.id;
            console.log(rideId)
            await RideModel.findByIdAndUpdate(rideId, { status: 'final' });
    
            res.status(200).json({ message: 'Ride final successfully' });
        } catch (error) {
            console.error('Error finalizing ride:', error);
            res.status(500).json({ error: 'Failed to finalize ride' });
        }
    },
    

    getAcceptedRides: async (req, res) => {
        try {
            const driverId = req.user.id;
            const rides = await RideModel.find({ driverId, status: 'accepted' });

            res.status(200).json(rides);
        } catch (error) {
            console.error('Error getting accepted rides:', error);
            res.status(500).json({ error: 'Failed to get accepted rides' });
        }
    }
};

module.exports = rideController;
