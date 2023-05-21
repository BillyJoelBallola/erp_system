import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from 'primereact/api';
import { ConfirmPopup } from 'primereact/confirmpopup'; 
import { confirmPopup } from 'primereact/confirmpopup';

import { ToastContainer, toast } from 'react-toastify';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";       

import ProductionModal from "./ProductionModal";
import AdjustmentModal from "./AdjustmentModal";
import AttendanceModal from "./AttendanceModal";
``
const Table = ({ dataValue, columns, name, setTableAction}) => {
    const activeTab = useParams().tab;  
    const [visible, setVisible] = useState(false);
    const [production, setProduction] = useState([]);
    const [adjustmentId, setAdjustmentId] = useState("");
    const [action, setAction] = useState("");
    const [rawData, setRawData] = useState([]);
    const [products, setProducts] = useState([]);
    const path = useLocation().pathname.split("/");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        if(name === "production" || name === "adjustment") {
            axios.get("/raw-materials").then(({ data }) => {
                if (data) setRawData(data);
            });
        }
        if(name === "adjustment"){
            axios.get("/products").then(({ data }) => {
                if (data) setProducts(data);
            });
        }
    }, [name])

    const toastMsgBox = (severity, detail ) => {
        switch(severity){
            case "info":
                toast.info(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            case "success":
                toast.success(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            case "warning":
                toast.warning(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            case "error":
                toast.error(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            default:
                break;
        }
    }   

    const finish = async (productId, productionId, qty) => {
        try {
            await axios.put("/update_qty_product", { productId, productionId, qty });
            toastMsgBox('success', 'Production finished successfully.');
            setTableAction("finish");
        } catch (error) {
            toastMsgBox('error', 'Failed to set as finish this production.');        
        }
    }

    const finishShipment = (e, orderId, shipmentId) => {
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to set as finish this shipment info?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                await axios.put("/finish_shipment", { orderId, shipmentId }).then(() => {
                    toastMsgBox('success', 'Shipment has been completed.');
                    setTableAction("finish-shipment");
                }).catch(() => {
                    toastMsgBox('error', 'Failed to set as finish this shipment.');    
                })
            },
        });
    }

    const handleDelete = (e, id) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to delete this ${name} info?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    if(name === "sale"){
                        const { data } = await axios.delete(`/cancel_order/${id}`);
                        if(typeof data === "object"){
                            await axios.delete(`/sales/${id}`);
                        }
                    }else{
                        await axios.delete(`/${name === "sale" ? "sales" : name}/${id}`);
                    }
                    setTableAction("deleted");
                    toastMsgBox('success', 'Successfully deleted.');   
                } catch (error) {
                    const action = name === "shipment" ? "cancel" : "delete";
                    toastMsgBox('error', `Failed to ${action}`); 
                } 
            },
        });
    }

    const handleCancel = (e, id) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to cancel this ${name} info?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    if(name === "shipment"){
                        await axios.delete(`/shipment/${id}`);
                    }else{
                        await axios.delete(`/cancel_${name}/${id}`);
                    }
                    setTableAction("cancel");
                    toastMsgBox('success', "Successfully cancelled."); 
                } catch (error) {
                    toastMsgBox('error', "Failed to cancel.");
                } 
            },
        });
    }

    const linkCode = (rowData) => {
        const { salesOrder, item } = rowData;

        if(item){
            const filteredRawMaterials = rawData.filter((raw) => (raw._id === item.itemId));
            const filteredProducts = products.filter((products) => (products._id === item.itemId));

            if(filteredRawMaterials.length > 0){
                return <Link className="underline text-blue-400" to={`/raw-materials/${item.itemId}`}>{item.itemId.substring(0, 10)}</Link>
            }
            if(filteredProducts.length > 0){
                return <Link className="underline text-blue-400" to={`/products/${item.itemId}`}>{item.itemId.substring(0, 10)}</Link>
            }

        }

        if(salesOrder){
            return <Link className="underline text-blue-400" to={`/sales/${salesOrder._id}`}>{salesOrder._id.substring(0, 10)}</Link>
        }else{
            return <span className="text-red-500 font-semibold">Order Deleted</span>
        }

        
    }
    
    const tableLink = (rowData) => {
        const { _id } = rowData;
        if(name === "production"){
            return <button 
                        className="underline text-blue-400" 
                        onClick={() => {
                                setVisible(true);
                                setAction("view");
                                setProduction(rowData);
                            }}>
                            {_id.substring(0, 10)}
                    </button>
        }

        if(name === "adjustment"){
            return <button 
                        className="underline text-blue-400" 
                        onClick={() => {
                                setVisible(true);
                                setAction("view");
                                setAdjustmentId(_id);
                            }}>
                            {_id.substring(0, 10)}
                    </button>
        }

        return <Link className="underline text-blue-400" to={`/${name}s/${_id}`}>{_id.substring(0, 10)}</Link>
    }

    const actionBodyTemplate = (rowData) => {
        const { _id, shipment, payment } = rowData;

        const handleEdit = () => {
            setVisible(true);
            setAction("edit");
            setAdjustmentId(_id);
        };

        const renderEditButton = () => (
            <button className="hover:text-blue-400" onClick={handleEdit}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            </button>
        );

        const renderLinkButton = () => (
            <Link to={`/${name}s/form/${_id}`} className="hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            </Link>
        );

        return (
            <>
                <ConfirmPopup />
                <div className="flex gap-4 justify-center items-center">
                    {name === "adjustment" && renderEditButton()}
                    {(name === "sale" && (shipment !== "Pending" || payment !== "Unpaid")) || (name === "purchase" && payment !== "Unpaid") || name === "attendance" || name === "adjustment" ? null : renderLinkButton()}
                    <button className="hover:text-red-400" onClick={(e) => handleDelete(e, _id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    </button>
                </div>
            </>
        );
    };

    const dateFormat = (dateValue) => {
        return <span>{moment(dateValue).format("MMM D YYYY")}</span>;
    }

    const dateCreated = (rowData) => {
        const { dateCreated } = rowData;
        return dateFormat(dateCreated);
    }

    const dateShipment = (rowData) => {
        const { dateShipment } = rowData;
        return dateFormat(dateShipment);
    }

    const dateFinish = (rowData) => {
        const { dateFinish } = rowData;
        return dateFormat(dateFinish);
    }

    const paymentStyle = (rowData) => {
        const { payment } = rowData;

        if(payment === "Unpaid"){
            return <div className="bg-gradient-to-r from-yellow-400 to-orange-400 font-semibold p-1 rounded-xl text-sm max-w-min">{payment}</div>
        }   
        if(payment === "Paid"){
            return <div className="bg-gradient-to-r from-green-300 to-green-500 font-semibold p-1 rounded-xl text-sm max-w-min">{payment}</div>
        }
    }

    const shipmentStyle = (rowData) => {
        const { shipment } = rowData;

        if(shipment === "Pending"){
            return <div className="bg-gradient-to-r from-yellow-400 to-orange-400 font-semibold p-1 rounded-xl text-sm max-w-min">{shipment}</div>
        }
        if(shipment === "In progress"){
            return <span className="bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold p-1 rounded-xl text-sm max-w-min whitespace-nowrap">{shipment}</span>
        }
        if(shipment === "Completed"){
            return <span className="bg-gradient-to-r from-green-300 to-green-500 font-semibold p-1 rounded-xl text-sm max-w-min">{shipment}</span>
        }
    }

    const statusStyle = (rowData) => {
        const { status } = rowData;

        if(status === "In progress"){
            return <div className="bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold p-1 rounded-xl text-sm max-w-min whitespace-nowrap">{status}</div>
        }
        if(status === "Completed"){
            return <div className="bg-gradient-to-r from-green-400 to-green-600 font-semibold p-1 rounded-xl text-sm max-w-min">{status}</div>
        }
    }

    const submitProduction = async () => {
        let good = false;
        production.product.rawMaterial.map((item) => {
            const computedQty = production.quantity * Number(item.qty);
            rawData.map((raw) => {
                if(raw.quantity < computedQty){
                    return good = true;
                }
            })
        })

        if(good){
            toastMsgBox('warning', "Not enough raw materials to produce the product.");
        }

        if(production.product === "" || production.dateFinish === "" ){
            toastMsgBox('warning', "Fill up all fields.");
        }
        
        if(production.quantity === "" || production.quantity <= 0 ){
            toastMsgBox('warning', "Qty should be greater than to zero [0].");
        } 
 
        try {
            const { _id, quantity } = production;
            const rawMaterialsRes = await axios.put("/update_production_raw_material", { _id, quantity });
            if(typeof rawMaterialsRes === "object"){
                const productionRes = await axios.put("/update_production", production);
                if(typeof productionRes === "object"){
                    setTableAction("submit-production");
                    setVisible(false);
                    toastMsgBox('success', "Successfully edited.");
                }
            }
        } catch (error) {
            toastMsgBox('error', 'Failed to produce');
        } 
    }

    const productionActions = (rowData) => {
        const { _id, quantity, product, status} = rowData;
        return (
            <>
                <ConfirmPopup />
                <div className="flex gap-1 justify-center">
                    {
                        status === "In progress" ?
                        <>
                            <button className="hover:text-green-400 text-sm font-bold" onClick={() => finish(product._id, _id, quantity)}>
                             FINISH
                            </button>
                            <div className="w-[1px] bg-gray-500"></div>
                            <button className="hover:text-blue-400 text-sm font-bold" 
                                onClick={() => {
                                    setVisible(true);
                                    setProduction(rowData);
                                }}>
                                EDIT
                            </button>
                            <div className="w-[1px] bg-gray-500"></div>
                            <button className="hover:text-red-400 text-sm font-bold" onClick={(e) => handleCancel(e, _id)}>
                                CANCEL
                            </button>
                        </>
                        :
                        <button className="hover:text-red-400 text-sm font-bold" onClick={(e) => handleDelete(e, _id)}>
                            DELETE
                        </button>
                    }
                 
                </div>
            </> 
        )
    }

    const shipmentActions = (rowData) => {
        const { _id, status, salesOrder } = rowData;
        console.log(salesOrder);
        return (
            <>
                <ConfirmPopup />
                <div className="flex gap-1 justify-center text-sm font-bold">
                    {
                        status === "In progress" &&
                        salesOrder !== null ?
                        <>
                            <button 
                                className="hover:text-green-400"
                                onClick={(e) => {
                                    finishShipment(e, salesOrder._id, _id);
                                }}>
                                FINISH
                            </button>
                            <div className="w-[1px] bg-gray-500" />
                            <Link to={`/shipments/form/${_id}`} className="hover:text-blue-400">
                                EDIT
                            </Link>
                            <div className="w-[1px] bg-gray-500" />
                            <button className="hover:text-red-400" onClick={(e) => handleCancel(e, _id)}>
                                CANCEL
                            </button>
                        </>
                        :
                        <button className="hover:text-red-400" onClick={(e) => handleDelete(e, _id)}>
                            DELETE
                        </button>
                    }
                </div>
            </>
        )
    }

    const timeInFormat = (rowData) => {
        const { timeIn } = rowData;

        if(timeIn){
            return <span>{moment(timeIn).format("LT")}</span>
        }
    }
    
    const timeOutFormat = (rowData) => {
        const { timeOut } = rowData;

        if(timeOut){
            return <span>{moment(timeOut).format("LT")}</span>
        }
    }

    const monthYearFormat = (rowData) => {
        const { monthYear } = rowData;
        return <span>{moment(monthYear).format("MMMM YYYY")}</span>
    }
    
    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            {
                name === "adjustment" ?
                <AdjustmentModal 
                    visible = {visible}
                    setVisible = {setVisible}
                    action={action}
                    setAction={setAction}
                    id={adjustmentId}
                    setTableAction={setTableAction}
                    setAdjustmentId={setAdjustmentId}
                />
                :
                name === "attendance" ?
                <AttendanceModal 
                    visible={visible}
                    setVisible={setVisible}
                    setTableAction={setTableAction}
                    attendanceData={name === "attendance" ? dataValue : null}
                />
                :
                <ProductionModal 
                    visible = {visible}
                    setVisible = {setVisible}
                    productInfo = {production?.product}
                    production = {production}
                    setProduction = {setProduction}
                    submitProduction = {submitProduction}
                    action={action}
                    setAction={setAction}
                />
            }
            <div className="p-4 bg-gray-200/[.6] flex items-center gap-4 border border-t-0 border-gray-300 max-md:flex-col text-center">
                {
                    name === "adjustment" || name === "attendance"? 
                    <button 
                        className="btn-primary px-16 uppercase max-md:w-full"
                        onClick={() => {
                            setVisible(true);
                        }}>{
                            `${name === "attendance" ? "scan qr code" : `add new ${name}`}`
                        }</button>
                    :
                    <Link to={`/${name === "production" ? "product" : name}s/form`} className="btn-primary px-16 uppercase max-md:w-full">{`add new ${name === "production" ? "product" : name === "sale" ? "order" : name?.split("-").join(" ")}`}</Link>
                }
                <div className="h-8 w-[1px] bg-gray-300 block max-md:hidden"/>
                <div className="flex items-center pl-2 rounded-md bg-gray-300/[.9] w-4/12 max-md:w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Type to search"
                        className="text-sm py-1 px-2 ml-2 rounded-r-md rounded-e-md border border-gray-300 w-full"
                        onChange={(e) => setFilters({global: {value: e.target.value, matchMode: FilterMatchMode.CONTAINS }})}
                    />
                </div>
            </div>
            {
                path.includes("products") &&
                <div className="sub_nav bg-white text-dark border border-gray-300 border-x-0 border-t-0 w-full py-2 px-5 text-sm flex gap-4 font-semibold">
                    <NavLink to={'/products/overview/info'} className={activeTab === "info" || !activeTab ? "active" : ""}>INFO</NavLink>
                    <NavLink to={'/products/overview/production'} className={activeTab === "production" ? "active" : ""}>PRODUCTION</NavLink>
                </div>
            }
            <div className="px-4 mt-6 mb-2">
                <h2 className="font-bold text-dark text-2xl uppercase">{name}s</h2>
            </div>
            <div className="px-4 pb-8 overflow-hidden rounded-lg">
                <DataTable
                    value={dataValue}
                    filters={filters}
                    globalFilterFields={columns.map((item) => (item.filter))}
                    rows={10}
                    paginator
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}">
                    {
                        columns.map((item, idx) => (
                            <Column
                                key={idx}
                                header={item.header}    
                                field={
                                    item.field === "dateCreated" ?
                                    dateCreated :
                                    item.field === "dateFinish" ?
                                    dateFinish : 
                                    item.field === "dateShipment" ?
                                    dateShipment:
                                    item.field === "paymentStatus" ?
                                    paymentStyle :
                                    item.field === "shipmentStatus" ?
                                    shipmentStyle :
                                    item.field === "timeInFormat" ?
                                    timeInFormat :
                                    item.field === "timeOutFormat" ?
                                    timeOutFormat :
                                    item.field === "status" ?
                                    statusStyle :
                                    item.field === "monthYearFormat" ?
                                    monthYearFormat : item.field
                            }
                            body={
                                item.body === "linkCode" ?
                                tableLink :
                                item.body === "link" ?
                                linkCode :
                                item.body === "buttons" ?
                                actionBodyTemplate : 
                                item.body === "shipment" ? 
                                shipmentActions :
                                item.body === "production" ? 
                                productionActions : ""
                            }/>
                        ))
                    }
                </DataTable>
            </div>
        </>
    );
};

export default Table;
