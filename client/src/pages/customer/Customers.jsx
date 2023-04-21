import React, { useState, useEffect, useMemo } from "react";
import Table from "../../components/Table";
import axios from 'axios';

const Customers = () => {
  const [allCustomers, setAllCustomers] = useState();

  useEffect(() => {
    axios.get("/customers")
      .then(({ data }) => {
        setAllCustomers(data)
      });
  }, []);

  const columns = [
    {body: "linkCode", header: "# CODE"},
    {field: "name", header: "CUSTOMER NAME"},
    {field: "business", header: "BUSINESS"},
    {field: "", header: "# ORDER"},
    {body: "buttons", header: ""},  
  ];

  return (
    <Table dataValue={allCustomers} columns={columns} name={"customer"} />
  );
};

export default Customers;
