import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/suppliers").then(({ data }) => {
      setSuppliers(data.reverse());
      setTableAction("");
    });
  }, [tableAction]);

  const columns = [
      { body: "linkCode", filter: "_id", header: "# CODE" },
      { field: "name", filter: "name", header: "SUPPLIER NAME" },
      { field: "business", filter: "business", header: "BUSINESS" },
      { field: "order", filter: "order", header: "# PURCHASES" },
      { body: "buttons", header: "" },
  ];

  return (
    <Table 
      dataValue={suppliers} 
      columns={columns} 
      name="supplier" 
      tableAction={tableAction}
      setTableAction={setTableAction}/>
  );
};

export default Suppliers;
