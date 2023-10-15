import React, { useEffect, useState } from "react";
import { Table, Space } from "antd";
import { getTickets } from "../services/croud_service";

const CrowdedStates = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then((res) => {
      setTickets(res);
      console.log(tickets);
    });
  }, []);

  const columns = [
    {
      title: "Route Number",
      dataIndex: "routeNumber",
      key: "routeNumber",
    },
    {
      title: "Sold Ticket Count",
      dataIndex: "numOfSeats",
      key: "numOfSeats",
    },
    {
      title: "Number of seats",
      dataIndex: "numSeats",
      key: "numSeates",
    },
  ];

  return (
    <div>
      <h2>Crowded States</h2>
      <Table dataSource={tickets} columns={columns} />
    </div>
  );
};

export default CrowdedStates;
