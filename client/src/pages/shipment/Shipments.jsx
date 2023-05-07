import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios";

const Shipments = () => {
    const [allShipments, setAllShipments] = useState([]);

    useEffect(() => {
      axios.get("/shipments")
        .then(({ data }) => {
          setAllShipments(data.reverse());
        })
    }, [])
  
    const columns = [
      {body: "linkCode", header: "# SHIPMENT CODE"},
      {body: "link", header: "# ORDER CODE"},
      {field: "dateShipment", header: "SHIPMENT DATE"},
      {field: "status", header: "STATUS"},
      {body: "shipment", header: ""},  
    ];
  
    return (
      <Table dataValue={allShipments} columns={columns} name={"shipment"} />
    );
};

export default Shipments;
