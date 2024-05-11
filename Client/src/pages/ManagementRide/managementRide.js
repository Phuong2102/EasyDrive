import {
  Breadcrumb, Card,
  Spin, Table, Tag, Button, notification
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import rideApi from "../../apis/rideApi";

const ManagementRide = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "Người đặt",
      dataIndex: "requesterId",
      key: "requesterId",
      render: (requesterId, record) => {
        if (requesterId) {
          return <span>{requesterId?.username}</span>;
        } else {
          return <span>Null</span>;
        }
      },
    },
    {
      title: "Điểm đón",
      dataIndex: "pickupLocation",
      key: "pickupLocation",
      render: (pickupLocation) => (
        <div>
          Latitude: {pickupLocation.lat}, Longitude: {pickupLocation.lng}
        </div>
      ),
    },
    {
      title: "Điểm trả",
      dataIndex: "destination",
      key: "destination",
      render: (destination) => (
        <div>
          Latitude: {destination.lat}, Longitude: {destination.lng}
        </div>
      ),
    },
    {
      title: "Loại xe",
      dataIndex: "vehicleType",
      key: "vehicleType",
      render: (vehicleType) => {
        return vehicleType === 'car' ? 'Ô tô' : vehicleType === 'motorbike' ? 'Xe máy' : vehicleType;
      },
    },
    
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod) => {
        return paymentMethod === 'cash' ? 'Tiền mặt' : paymentMethod;
      },
    },
    
    {
      title: "Tài xế",
      dataIndex: "driverId",
      key: "driverId",
      render: (driverId, record) => {
        if (driverId) {
          return <span>{driverId?.username}</span>; // Nếu có driverId, hiển thị driverId
        } else {
          // Nếu không có driverId, hiển thị thông báo tài xế đang nhận cuốc
          return <span>Tài xế đang nhận cuốc</span>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let statusText = '';
        switch (status) {
          case 'pending':
            statusText = 'Chờ xác nhận';
            break;
          case 'accepted':
            statusText = 'Đã chấp nhận';
            break;
          case 'final':
            statusText = 'Hoàn thành';
            break;
          default:
            statusText = 'Không xác định';
        }
        return <span>{statusText}</span>;
      },
    },

    {
      title: "Giá tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <div>
          {total.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      ),
    },
    {
      title: "Số kilomet",
      dataIndex: "kilometer",
      key: "kilometer",
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <span>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "status",
      key: "action",
      render: (status, record) => {
        if (status === "accepted") {
          return (
            <Button type="primary" onClick={() => finalRide(record._id)}>Hoàn thành</Button>
          );
        }
        if (status === "pending") {
          return (
            <Button type="primary" onClick={() => acceptRide(record._id)}>Nhận cuốc</Button>
          );
        }
         
     
      },
    },
  ];

  const finalRide = async (rideId) => {
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);
    try {
      await rideApi.finalRide(rideId).then((item) => {
        if (item) {
          notification.success({
            message: 'Thông Báo',
            description: 'Bạn đã hoàn thành cuốc thành công.',
          });
        }
      });
      handleList();
    } catch (error) {
      console.log("Failed to accept ride:", error);
      notification.error({
        message: 'Lỗi khi hoàn thành cuốc',
        description: 'Đã xảy ra lỗi khi hoàn thành cuốc, vui lòng thử lại sau.',
      });
    }
  };

  const acceptRide = async (rideId) => {
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);
    try {
      await rideApi.acceptRide(rideId, user._id).then((item) => {
        if (item) {
          notification.success({
            message: 'Nhận cuốc thành công',
            description: 'Bạn đã nhận cuốc thành công.',
          });
        }
      });
      handleList();
    } catch (error) {
      console.log("Failed to accept ride:", error);
      notification.error({
        message: 'Lỗi khi nhận cuốc',
        description: 'Đã xảy ra lỗi khi nhận cuốc, vui lòng thử lại sau.',
      });
    }
  };

  const handleList = () => {
    (async () => {
      try {
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);

        await rideApi.getAllRides().then((item) => {
          console.log(item);
          setOrderList(item);
        });
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
  }

  useEffect(() => {
    handleList();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Quản lý nhận cuốc </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div className="container" style={{ marginBottom: 30 }}>

              <br></br>
              <Card>
                <Table
                  columns={columns}
                  dataSource={orderList}
                  rowKey="_id"
                  pagination={{ position: ["bottomCenter"] }}
                />
              </Card>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ManagementRide;
