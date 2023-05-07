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
    { body: "linkCode", header: "# CODE" },
    { field: "customers.name", header: "CUSTOMER NAME" },
    { field: "shipmentStatus", header: "SHIPMENT" },
    { field: "paymentStatus", header: "PAYMENT" },
    { field: "total", header: "TOTAL" },
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
