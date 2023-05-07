import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";

const Adjusments = () => {
  const [allAdjustment, setAllAdjustment] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/adjustments").then(({ data }) => {
      setAllAdjustment(data.reverse());
      setTableAction("");
    })
  }, [tableAction]);

  const columns = [
    {body: "linkCode", header: "# ADJUSTMENT CODE"},
    {body: "link", header: "# ITEM CODE"},
    {field: "item.oldQty", header: "OLD QTY"},
    {field: "item.newQty", header: "NEW QTY"},
    {field: "remarks", header: "REMARKS"},
    {body: "buttons", header: ""},  
  ];

  return (
    <Table 
      dataValue={allAdjustment} 
      columns={columns} 
      name={"adjustment"} 
      tableAction={tableAction} 
      setTableAction={setTableAction} />
  );
};

export default Adjusments;
