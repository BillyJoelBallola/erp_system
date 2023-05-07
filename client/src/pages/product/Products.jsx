import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { useParams } from "react-router-dom";

const Products = () => {
    const path = useParams().tab;
    const [products, setProducts] = useState([]);
    const [productions, setProductions] = useState([]);
    const [tableAction, setTableAction] = useState("");

    useEffect(() => {
        axios.get("/products").then(({ data }) => {
            setProducts(data.reverse());
            setTableAction("");
        });
        axios.get("/productions").then(({ data }) => {
            setProductions(data.reverse());
            setTableAction("");
        });
    }, [tableAction]);

    const infoComlumns = [
        { body: "linkCode", header: "# CODE" },
        { field: "name", header: "PRODUCT" },
        { field: "quantity", header: "QTY" },
        { field: "price", header: "SELLING PRICE" },
        { body: "buttons", header: "" },
    ];

    const prodColumns = [
        { body: "linkCode", header: "# CODE" },
        { field: "quantity", header: "FINISH QTY" },
        { field: "status", header: "STATUS" },
        { field: "dateCreated", header: "DATE CREATED" },
        { field: "dateFinish", header: "DATE FINISH" },
        { body: "production", header: "" },
    ];

    return (
        <>
            {path === "info" || path === undefined ? (
                <Table
                    dataValue={products}
                    columns={infoComlumns}
                    name={"product"}
                    tableAction={tableAction}
                    setTableAction={setTableAction}
                />
            ) : (
                <Table
                    dataValue={productions}
                    columns={prodColumns}
                    name={"production"}
                    tableAction={tableAction}
                    setTableAction={setTableAction}
                />
            )}
        </>
    );
};

export default Products;
