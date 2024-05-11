import axiosClient from "./axiosClient";

const rideApi = {
    createRide(rideData) {
        const url = '/ride';
        return axiosClient.post(url, rideData);
    },
    updateRide(rideId, rideData) {
        const url = `/ride/${rideId}`;
        return axiosClient.put(url, rideData);
    },
    deleteRide(rideId) {
        const url = `/ride/${rideId}`;
        return axiosClient.delete(url);
    },
    getRideById(rideId) {
        const url = `/ride/${rideId}`;
        return axiosClient.get(url);
    },
    getRideByRequestId(rideId) {
        const url = `/ride/request/${rideId}`;
        return axiosClient.get(url);
    },
    getAllRides() {
        const url = '/ride';
        return axiosClient.get(url);
    },
    searchRides(keyword) {
        const url = `/ride/search?keyword=${keyword}`;
        return axiosClient.get(url);
    },
    acceptRide(rideId, userId) {
        const data = {
            driverId: userId
        }
        const url = `/ride/accept/${rideId}`;
        return axiosClient.put(url, data);
    },
    finalRide(rideId) {
        const url = `/ride/final/${rideId}`;
        return axiosClient.put(url);
    },
    getAcceptedRides(userId) {
      
        const url = '/ride/accepted';
        return axiosClient.get(url);
    }
};

export default rideApi;
