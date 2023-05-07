import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";

const Employees = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/employees").then(({ data }) => {
      setAllEmployees(data.reverse());
      setTableAction("");
    });
  }, [tableAction]);

  const columns = [
    { body: "linkCode", header: "# CODE" },
    { field: `name`, header: "EMPLOYEE NAME" },
    { field: "position.name", header: "POSITION" },
    { body: "buttons", header: "" },
  ];

  return (
    <Table
        dataValue={allEmployees}
        columns={columns}
        name={"employee"}
        tableAction={tableAction}
        setTableAction={setTableAction}
    />
  );
};

export default Employees;
