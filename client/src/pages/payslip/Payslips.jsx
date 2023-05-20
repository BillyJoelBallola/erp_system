import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";

const Payslips = () => {
  const [allPayslips, setAllPayslips] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/payslips").then(({ data }) => {
      setAllPayslips(data.reverse());
      setTableAction("");
    })
  }, [tableAction]);

  const columns = [
    // { body: "linkCode", header: "# CODE" },
    { field: "employee.name", filter: "employee.name", header: "EMPLOYEE NAME" },
    { field: "monthYearFormat", filter: "month", header: "MONTH - YEAR" },
    { field: "paymentStatus", filter: "payment", header: "PAYMENT" },
    { field: "netPay", filter: "netPay", header: "₱ NETPAY"},
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
