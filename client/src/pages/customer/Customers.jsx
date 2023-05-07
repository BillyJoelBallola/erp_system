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
    { body: "linkCode", header: "# CODE" },
    { field: "name", header: "CUSTOMER NAME" },
    { field: "business", header: "BUSINESS" },
    { field: "order", header: "# ORDER" },
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
