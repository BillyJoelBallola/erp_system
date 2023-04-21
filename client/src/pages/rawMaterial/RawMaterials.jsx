import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";

const RawMaterials = () => {
  const [allRawMaterials, setAllRawMaterials] = useState();

  useEffect(() => {
    axios.get("/raw-materials")
      .then(({ data }) => {
        setAllRawMaterials(data);
      });
  }, []);

  const columns = [
    {body: "linkCode", header: "# CODE"},
    {field: "name", header: "ITEM"},
    {field: "quantity", header: "QTY"},
    {body: "buttons", header: ""}
  ];

  return (
    <>
      <Table dataValue={allRawMaterials} columns={columns} name={"raw-material"}/>
    </>
  );
};

export default RawMaterials;
