import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios";

const Shipments = () => {
    const [allShipments, setAllShipments] = useState([]);
    const [tableAction, setTableAction] = useState("");

    useEffect(() => {
      axios.get("/shipments")
        .then(({ data }) => {
          setAllShipments(data.reverse());
          setTableAction("");
        })
    }, [tableAction])

    console.log(allShipments);
  
    const columns = [
      {body: "linkCode", filter: "_id", header: "# SHIPMENT CODE"},
      {body: "link", filter: "salesOrder._id", header: "# ORDER CODE"},
      {field: "dateShipment", filter: "dateShipment",  header: "SHIPMENT DATE"},
      {field: "status", filter: "status", header: "STATUS"},
      {body: "shipment", header: ""},  
    ];
  
    return (
      <Table 
        dataValue={allShipments} 
        columns={columns} 
        name={"shipment"} 
        tableAction={tableAction} 
        setTableAction={setTableAction}/>
    );
};

export default Shipments;
