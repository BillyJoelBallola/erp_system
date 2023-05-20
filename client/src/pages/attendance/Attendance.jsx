import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import moment from "moment";

const Attendance = () => {
  const [allAttenance, setAllAttendance] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/current_attendance").then(({ data }) => {
      setAllAttendance(data.reverse());
      setTableAction("");
    })
  }, [tableAction])
    
  const columns = [
    {field: "employee.name", filter: "employee.name", header: "EMPLOYEE NAME"},
    {field: "timeInFormat", filter: "timeIn", header: "TIME-IN"},
    {field: "timeOutFormat", filter: "timeOut", header: "TIME-OUT"},
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
