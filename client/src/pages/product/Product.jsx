import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup } from 'primereact/confirmpopup'; 
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';

import axios from 'axios';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";     
import ProductionModal from "../../components/ProductionModal";

const Product = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const id = useParams().id;
    const [visible, setVisible] = useState(false);
    const [rawData, setRawData] = useState([]);
    const [productInfo, setProductInfo] = useState({});
    const [production, setProduction] = useState({
        product: id,
        quantity: 0,
        dateFinish: "",
        status: "In progress"
    })

    useEffect(() => {
        if(id){
            axios.get(`/product/${id}`).then(({ data }) => {
                if(data) setProductInfo(data);
            })
        }
    }, [id]);

    useEffect(() => {
        axios.get("/raw-materials").then(({ data }) => {
            if (data) setRawData(data);
          });
    }, [])

    const deleteProductInfo = (e, id) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Do you want to delete this product info?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await axios.delete(`/product/${id}`);
                    toast.current.show({ severity: 'info', summary: 'Delete', detail: 'Successfully deleted', life: 3000 });
                    setTimeout(() => {
                        navigate("/products/overview");
                    }, [800]);
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Failed to delete', life: 3000 });
                } 
            },
        });
    }

    const submitProduction = async () => {
        let good = false;
        productInfo.rawMaterial.map((item) => {
            const computedQty = Number(production.quantity) * item.qty;
            rawData.map((raw) => {
                if(raw.quantity < computedQty){
                    return good = true;
                }
            })
        })  

        if(good){
            return toast.current.show({ severity: 'warn', summary: 'Production message', detail: 'Not enough raw materials to produce the product', life: 3000 });
        }

        if(production.product === "" || production.dateFinish === "") {
            return toast.current.show({ severity: 'warn', summary: 'Production message', detail: 'Fill up all fields', life: 3000 });
        }
        
        if(production.quantity === "" ||production.quantity <= 0 ) {
            return toast.current.show({ severity: 'warn', summary: 'Production message', detail: 'Qty should be greater than to zero [0].', life: 3000 });
        }

        try {
            axios.post("/add_production", production);
            toast.current.show({ severity: 'info', summary: 'Production message', detail: 'Successfully added', life: 3000 });
            setTimeout(() => {
                navigate("/products/overview/production");
            }, [800]);
        } catch (error) {
            return toast.current.show({ severity: 'error', summary: 'Production message', detail: 'Failed to produce', life: 3000 });
        } 
    }

    return ( 
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <ProductionModal 
                visible={visible}
                setVisible={setVisible}
                productInfo={productInfo}
                production={production}
                setProduction={setProduction}
                submitProduction={submitProduction}/>
            <div className="bg-gray-100 flex items-center justify-between px-4 py-3 border-b-[1px]">
                <div className="font-semibold text-blue-400 flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    ></path>
                </svg>
                PRODUCT INFORMATION
                </div>
                <div className="flex gap-2">
                    <button className="btn-primary px-6" onClick={() => setVisible(true)} >PRODUCE FROM RAW MATERIALS</button>
                    <Link to={`/products/form/${id}`} className="btn-outlined">EDIT</Link>
                    <button className="btn-red" onClick={(e) => deleteProductInfo(e, id)}>DELETE</button>
                </div>
            </div>
            <div className="px-4 py-8 grid gap-6">
                <div className="grid gap-2 mb-6">
                    <span className="text-3xl text-gray-600">{productInfo.name && productInfo.name}</span>
                    <span className="text-xl text-blue-400 bg-gray-200 max-w-max px-2 rounded-md">#{productInfo._id ? productInfo._id.substring(0,10) : ""}</span>
                </div>
                <div className="grid gap-4">
                <div className="grid grid-cols-[250px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold">CATEGORY</span>
                    <div className="text-lg">
                    {
                        productInfo.category &&
                        productInfo.category[0] !== "" &&
                        productInfo.category.length > 0 ?
                        <div className="flex flex-wrap gap-2">
                        {
                            productInfo.category.map((cat, idx) => (
                            <div className="bg-dark text-lighter px-2 rounded-lg items-center" key={idx}>
                                <span className="text-sm">{cat}</span>
                            </div> 
                            ))
                        }
                        </div>
                        : 
                        <span>N/A</span>
                    }
                    </div>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                <div className="grid grid-cols-[250px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold self-baseline">RAW MATERIAL/S</span>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="grid grid-cols-[1fr_50px_100px] gap-10">
                                <span className="text-gray-500 font-semibold text-md">ITEM</span>
                                <span className="text-gray-500 font-semibold text-md">UOM</span>
                                <span className="text-gray-500 font-semibold text-md">QTY</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                        {
                            productInfo.rawMaterial &&
                            productInfo.rawMaterial.map((raw, idx) => (
                                <div className="grid grid-cols-[1fr_50px_100px] gap-10 py-2" key={idx}>
                                    <span className="text-gray-500 text-sm">{raw.item}</span>
                                    <span className="text-gray-800 text-sm">{raw.oum}</span>
                                    <span className="text-gray-800 text-sm">{raw.qty}</span>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                <div className="grid grid-cols-[250px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold">IN STOCK QUANTITY</span>
                    <span className="text-lg">{productInfo.quantity && productInfo.maesurement ? `${productInfo.quantity} ${productInfo.maesurement}` : "N/A"}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                <div className="grid grid-cols-[250px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold">STORAGE LOCATION</span>
                    <span className="text-lg">{productInfo.storage && productInfo.storage.name}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                <div className="grid grid-cols-[250px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold">SELLING PRICE / ITEM</span>
                    <span className="text-lg">Php{productInfo.price && productInfo.price}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                </div>
            </div>
        </>
    );
};

export default Product;
