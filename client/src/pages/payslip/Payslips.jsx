import React, { useEffect, useRef, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { Toast } from "primereact/toast";

const Payslips = () => {
  const [allPayslips, setAllPayslips] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/payslips").then(({ data }) => {
      setAllPayslips(data);
      setTableAction("");
    })
  }, [tableAction]);

  const columns = [
    { body: "linkCode", header: "# CODE" },
    { field: "employee.name", header: "EMPLOYEE NAME" },
    { field: "monthFormat", header: "MONTH" },
    { field: "year", header: "YEAR" },
    { field: "paymentStatus", header: "PAYMENT" },
    { body: "buttons", header: "" },
  ];

  return (
    <>
      <Table 
        dataValue={allPayslips}
        columns={columns}
        name={"payslip"}
        tableAction={tableAction}
        setTableAction={setTableAction}
      />
    </>
  );
};

export default Payslips;
