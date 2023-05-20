import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios";

const Customers = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/customers").then(({ data }) => {
        setAllCustomers(data.reverse());
        setTableAction("");
    });
  }, [tableAction]);

  const columns = [
    { body: "linkCode", filter: "_id", header: "# CODE" },
    { field: "name", filter: "name", header: "CUSTOMER NAME" },
    { field: "business", filter: "business", header: "BUSINESS" },
    { field: "order", filter: "order", header: "# ORDERS" },
    { body: "buttons", header: "" },
  ];

  return (
    <Table
        dataValue={allCustomers}
        columns={columns}
        name={"customer"}
        tableAction={tableAction}
        setTableAction={setTableAction}
    />
  );
};

export default Customers;
