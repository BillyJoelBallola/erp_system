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
      { body: "linkCode", header: "# CODE" },
      { field: "name", header: "SUPPLIER NAME" },
      { field: "business", header: "BUSINESS" },
      { field: "", header: "# PURCHASES" },
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
