import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "../../components/Table";

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [tableAction, setTableAction] = useState("");

    useEffect(() => {
        axios.get("/purchases")
        .then(({ data }) => {
            setPurchases(data.reverse());
            setTableAction("")
        })
    }, [tableAction])

    const columns = [
        {body: "linkCode", header: "# CODE"},
        {field: "supplier.name", header: "SUPPLIER NAME"},
        {field: "paymentStatus", header: "PAYMENT"},
        {field: "total", header: "₱ TOTAL"},
        {body: "buttons", header: ""},  
    ];

    return (
        <Table 
            dataValue={purchases} 
            columns={columns} 
            name={"purchase"}  
            tableAction={tableAction}
            setTableAction={setTableAction}
        />
    );
};

export default Purchases;
