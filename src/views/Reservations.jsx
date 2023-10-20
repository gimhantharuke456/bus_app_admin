import React, { useEffect, useState } from "react";
import { Table, Space, Button, Modal } from "antd";
import ReservationService from "../services/reservation_service";
import BusService from "../services/bus_service";
import UserService from "../services/user_service";

const Reservations = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [buses, setBuses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    ReservationService.getInstance()
      .getBusReservations()
      .then((res) => {
        setTickets(res);
        // Fetch usernames for all reservations
        const createdByUserIds = res.map(
          (reservation) => reservation.createdBy
        );
        fetchUsernames(createdByUserIds);
      });

    BusService.getInstance()
      .getBuses()
      .then((res) => {
        setBuses(res);
      });
  }, []);

  const fetchUsernames = (userIds) => {
    // Fetch usernames for the given user IDs
    Promise.all(
      userIds.map((userId) =>
        UserService.getInstance().getTravellerById(userId)
      )
    )
      .then((usernames) => {
        const usernameMap = {};
        usernames.forEach((user, index) => {
          if (user) {
            usernameMap[userIds[index]] = user.name;
          }
        });
        setUsernames(usernameMap);
      })
      .catch((err) => console.error("Error fetching usernames:", err));
  };

  const columns = [
    {
      title: "Route Number",
      dataIndex: "busId",
      key: "busId",
      render: (_, record) => {
        let bus = "kollupitiya";
        let b = buses.filter((bus) => bus.id == record.busId);
        if (b.length > 0) {
          console.log(b);
          bus = b[0].routeNumber;
        }
        return <p> {bus}</p>;
      },
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) => <p>{usernames[record.createdBy]}</p>,
    },
    {
      title: "Seat Numbers",
      dataIndex: "seatIds",
      key: "seatIds",
      render: (seatIds) => seatIds.map((id) => <p key={id}>{id}</p>),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setSelectedReservation(record);
    setModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this reservation?",
      icon: "exclamation-circle",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        ReservationService.getInstance()
          .deleteReservation(record.res_id)
          .then(() => {
            setTickets(
              tickets.filter((ticket) => ticket.res_id !== record.res_id)
            );
          })
          .catch((error) =>
            console.error("Error deleting reservation:", error.message)
          );
      },
    });
  };

  const handleModalOk = (values) => {
    if (selectedReservation) {
      // Update existing reservation
      ReservationService.getInstance()
        .updateReservation(selectedReservation.id, values)
        .then(() => {
          setTickets(
            tickets.map((ticket) =>
              ticket.id === selectedReservation.id
                ? { ...ticket, ...values }
                : ticket
            )
          );
          setModalVisible(false);
          setSelectedReservation(null);
        })
        .catch((error) =>
          console.error("Error updating reservation:", error.message)
        );
    } else {
      // Create new reservation
      ReservationService.getInstance()
        .createReservation(values)
        .then((newReservationId) => {
          setTickets([...tickets, { id: newReservationId, ...values }]);
          setModalVisible(false);
        })
        .catch((error) =>
          console.error("Error creating reservation:", error.message)
        );
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedReservation(null);
  };

  return (
    <div>
      <h2>Reservations</h2>

      <Table dataSource={tickets} columns={columns} />

      <Modal
        title={selectedReservation ? "Edit Reservation" : "Add Reservation"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        {/* Your form for editing/adding reservations goes here */}
      </Modal>
    </div>
  );
};

export default Reservations;
