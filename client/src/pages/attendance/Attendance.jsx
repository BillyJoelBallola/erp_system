import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import moment from "moment";

const Attendance = () => {
  const [allAttenance, setAllAttendance] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/attendance").then(({ data }) => {
      setAllAttendance(data);
      setTableAction("");
    })
  }, [tableAction])
  
  const columns = [
    {field: "employee.name", header: "EMPLOYEE NAME"},
    {field: "timeIn", header: "TIME-IN"},
    {field: "timeOut", header: "TIME-OUT"},
    {body: "buttons", header: ""},  
  ];
  
  return (
    <Table  
      dataValue={allAttenance}
      columns={columns}
      name={"attendance"}
      tableAction={tableAction}
      setTableAction={setTableAction}
    />
  );
};

export default Attendance;
