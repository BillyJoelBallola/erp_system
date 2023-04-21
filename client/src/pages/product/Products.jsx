import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { useParams } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [productions, setProductions] = useState([]);
    const path = useParams().tab;

    useEffect(() => {
        axios.get("/products").then(({ data }) => {
            if (data) setProducts(data);
        });
        axios.get("/productions").then(({ data }) => {
            if (data) setProductions(data);
        });
    }, []);

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
        {
            path === "info" || path === undefined ?
            <Table dataValue={products} columns={infoComlumns} name={"product"} />
            :
            <Table dataValue={productions} columns={prodColumns} name={"production"} />
        }
        </>
    );
};

export default Products;
