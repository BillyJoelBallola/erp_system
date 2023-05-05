import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "../../components/Table";

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        axios.get("/purchases")
        .then(({ data }) => {
            setPurchases(data);
        })
    }, [])

    const columns = [
        {body: "linkCode", header: "# CODE"},
        {field: "supplier.name", header: "SUPPLIER NAME"},
        {field: "paymentStatus", header: "PAYMENT"},
        {field: "total", header: "TOTAL"},
        {body: "buttons", header: ""},  
    ];

    return (
        <Table dataValue={purchases} columns={columns} name={"purchase"} />
    );
};

export default Purchases;
