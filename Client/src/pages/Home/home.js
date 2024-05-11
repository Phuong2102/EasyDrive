import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { BackTop, Spin, Button, Radio, notification  } from "antd";
import L from "leaflet";
import "./home.css";

import rideApi from "../../apis/rideApi";
import * as geolib from 'geolib';
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import userApi from "../../apis/userApi";
import { useHistory } from "react-router-dom";

const Home = () => {
  const [mapKey, setMapKey] = useState(0);
  const [pickupLocation, setPickupLocation] = useState({ lat: null, lng: null });
  const [destination, setDestination] = useState({ lat: null, lng: null });
  const [distance, setDistance] = useState(null);
  const [vehicleType, setVehicleType] = useState("car"); // Mặc định là xe ô tô
  let history = useHistory();

  const icon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow
  });

  const latitude = 10.850491;
  const longitude = 106.619965;

  // Function to calculate distance
  const calculateDistance = () => {
    if (pickupLocation.lat !== null && pickupLocation.lng !== null && destination.lat !== null && destination.lng !== null) {
      const distanceInMeters = geolib.getDistance(
        { latitude: pickupLocation.lat, longitude: pickupLocation.lng },
        { latitude: destination.lat, longitude: destination.lng }
      );
      const distanceInKilometers = distanceInMeters / 1000;
      console.log(distanceInKilometers)
      setDistance(distanceInKilometers.toFixed(2));
    }
  };


  useEffect(() => {
    calculateDistance();
  }, [pickupLocation, destination]);

  const createRide = async () => {
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);
    if(!user){
      history.push("/login")
    }
    try {
      const newRide = await rideApi.createRide({
        destination,
        pickupLocation,
        kilometer: distance,
        total: distance * 11000,
        requesterId: user._id,
        vehicleType,
        paymentMethod: "cash",
      });
      console.log("New ride created:", newRide);
      notification.success({
        message: 'Đặt xe thành công',
        description: 'Xe đã được đặt thành công.',
      });
      history.push("/cart-history");
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  };

  const handlePickupLocationChange = (event) => {
    const { name, value } = event.target;
    setPickupLocation((prevLocation) => ({
      ...prevLocation,
      [name]: parseFloat(value),
    }));
  };

  const handleDestinationChange = (event) => {
    const { name, value } = event.target;
    setDestination((prevDestination) => ({
      ...prevDestination,
      [name]: parseFloat(value),
    }));
  };

  const handleVehicleTypeChange = (event) => {
    setVehicleType(event.target.value);
  };

  return (
    <Spin spinning={false}>
      <div className="bg-white overflow-hidden home pt-5 pb-5">
        <div className="bg-white banner-promotion">
          <div className="container-home">
            <div className="size">Vui lòng nhập thông tin phía dưới để đặt xe</div>
            <div style={{ fontSize: '16px', marginRight: '5px', marginTop: 10 }}>Điểm đón: </div>
            <div className="flex flex-wrap items-center">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                name="lat"
                value={pickupLocation.lat !== null ? pickupLocation.lat : ""}
                onChange={handlePickupLocationChange}
                className="mr-2 mb-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                name="lng"
                value={pickupLocation.lng !== null ? pickupLocation.lng : ""}
                onChange={handlePickupLocationChange}
                className="mr-2 mb-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div style={{ fontSize: '16px' }}>Điểm trả: </div>

            <div className="flex flex-wrap mb-4 items-center">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                name="lat"
                value={destination.lat !== null ? destination.lat : ""}
                onChange={handleDestinationChange}
                className="mr-2 mb-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                name="lng"
                value={destination.lng !== null ? destination.lng : ""}
                onChange={handleDestinationChange}
                className="mr-2 mb-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <Radio.Group onChange={handleVehicleTypeChange} value={vehicleType}>
                <Radio value="car">Xe ô tô</Radio>
                <Radio value="motorbike">Xe máy</Radio>
              </Radio.Group>
            </div>

            {distance && (
              <p className="mb-2">
                Khoảng cách giữa điểm đón và điểm đến: {distance} km
                <br />
                Giá tiền dự kiến: {(distance * 11000).toLocaleString('vi-VN')} VND
              </p>
            )}

            {pickupLocation.lat !== null && pickupLocation.lng !== null && destination.lat !== null && destination.lng !== null && (
              <Button type="primary" onClick={createRide} className="mb-4">Đặt Xe</Button>
            )}
            <MapContainer
              key={mapKey}
              center={[latitude, longitude]}
              zoom={13}
              scrollWheelZoom={false}
              className="map-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {pickupLocation.lat !== null && pickupLocation.lng !== null && (
                <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={icon}>
                  <Popup>
                    <div>
                      Pickup Location
                    </div>
                  </Popup>
                </Marker>
              )}
              {destination.lat !== null && destination.lng !== null && (
                <Marker position={[destination.lat, destination.lng]} icon={icon}>
                  <Popup>
                    <div>
                      Destination
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
      <BackTop style={{ textAlign: "right" }} />
    </Spin>

  );
};

export default Home;
