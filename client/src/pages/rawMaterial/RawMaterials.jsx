import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";

const RawMaterials = () => {
  const [allRawMaterials, setAllRawMaterials] = useState([]);
  const [tableAction, setTableAction] = useState("");

  useEffect(() => {
    axios.get("/raw-materials")
      .then(({ data }) => {
        setAllRawMaterials(data.reverse());
        setTableAction("");
      });
  }, [tableAction]);

  const columns = [
    {body: "linkCode", filter: "_id", header: "# CODE"},
    {field: "name", filter: "name", header: "ITEM"},
    {field: "quantity", filter: "quantity", header: "QTY"},
    {body: "buttons", header: ""}
  ];

  return (
    <>
      <Table dataValue={allRawMaterials} columns={columns} name={"raw-material"} setTableAction={setTableAction}/>
    </>
  );
};

export default RawMaterials;
