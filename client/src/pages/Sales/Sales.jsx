import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "../../components/Table";

const Sales = () => {
  const [allSales, setAllSales] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/sales").then(({ data }) => {
      setAllSales(data.reverse());
      setTableAction("");
    });
  }, [tableAction]);

  const columns = [
    { body: "linkCode", filter: "_id", header: "# CODE" },
    { field: "customers.name", filter: "customers.name", header: "CUSTOMER NAME" },
    { field: "shipmentStatus", filter: "shipment", header: "SHIPMENT" },
    { field: "paymentStatus", filter: "payment", header: "PAYMENT" },
    { field: "total", filter: "total", header: "₱ TOTAL" },
    { body: "buttons", header: "" },
  ];

  return (
    <Table
      dataValue={allSales}
      columns={columns}
      name={"sale"}
      tableAction={tableAction}
      setTableAction={setTableAction}
    />
  );
};

export default Sales;
