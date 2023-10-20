import React, { useEffect, useState } from "react";
import { Table, Space } from "antd";
import { getTickets } from "../services/croud_service";
import ReservationService from "../services/reservation_service";

const Reservations = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    ReservationService.getInstance()
      .getBusReservations()
      .then((res) => {
        setTickets(res);
        console.log(tickets);
      });
  }, []);

  const columns = [
    {
      title: "Bus Id",
      dataIndex: "busId",
      key: "busId",
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Seat Numbers",
      dataIndex: "seat numbers",
      key: "sn",
      render: (_, record) => (
        <>
          {record.seatIds.map((id) => (
            <p>{id}</p>
          ))}
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Reservations</h2>
      <Table dataSource={tickets} columns={columns} />
    </div>
  );
};

export default Reservations;
