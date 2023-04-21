import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from 'primereact/api';
import { ConfirmPopup } from 'primereact/confirmpopup'; 
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";       

import ProductionModal from "./ProductionModal";

const Table = ({ dataValue, columns, name}) => {
    const activeTab = useParams().tab; 
    const [visible, setVisible] = useState(false);
    const [production, setProduction] = useState([]);
    const [action, setAction] = useState("");
    const path = useLocation().pathname.split("/");
    const toast = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const finish = async (productId, productionId, qty) => {
        try {
            await axios.put("/update_qty_product", { productId, productionId, qty });
            toast.current.show({ severity: 'info', summary: 'Finish Message', detail: 'Production finished successfully.', life: 3000 });
            setTimeout(() => {
                window.location.reload();
            }, [800]);
        } catch (error) {
            toast.current.show({ severity: 'info', summary: 'Finish Message', detail: 'Failed to finish this production.', life: 3000 });
        }
    }

    const handleDelete = (e, id) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to delete this ${name} info?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await axios.delete(`/${name}/${id}`);
                    toast.current.show({ severity: 'info', summary: 'Delete Message', detail: 'Successfully deleted', life: 3000 });
                    setTimeout(() => {
                        window.location.reload();
                    }, [800])
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Failed to delete', life: 3000 });
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
                    await axios.delete(`/cancel_${name}/${id}`);
                    toast.current.show({ severity: 'info', summary: 'Cancel Message', detail: 'Successfully cancelled', life: 3000 });
                    setTimeout(() => {
                        window.location.reload();
                    }, [800])
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Cancel Message', detail: 'Failed to cancel', life: 3000 });
                } 
            },
        });
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
        return <Link className="underline text-blue-400" to={`/${name}s/${_id}`}>{_id.substring(0, 10)}</Link>
    }

    const actionBodyTemplate = (rowData) => {
        const { _id } = rowData;
        return (
            <>
                <Toast ref={toast} />
                <ConfirmPopup />
                <div className="flex gap-4 justify-center">
                    <Link to={`/${name}s/form/${_id}`} className="hover:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                    </Link>
                    <button className="hover:text-red-400" onClick={(e) => handleDelete(e, _id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </>
        );
    }

    const dateFormat = (dateValue) => {
        return <span>{moment(dateValue).format("MMM D YYYY")}</span>;
    }

    const dateCreated = (rowData) => {
        const { dateCreated } = rowData;
        return dateFormat(dateCreated);
    }

    const dateFinish = (rowData) => {
        const { dateFinish } = rowData;
        return dateFormat(dateFinish);
    }

    const statusStyle = (rowData) => {
        const { status } = rowData;
        if(status === "In progress"){
            return <span className="bg-yellow-400 font-semibold p-1 rounded-xl text-sm">{status}</span>
        }
        if(status === "Completed"){
            return <span className="bg-blue-400 font-semibold p-1 rounded-xl text-sm">{status}</span>
        }
    }

    const submitProduction = async () => {
        if(production.product === "" ||
            production.dateFinish === "" 
        ) return toast.current.show({ severity: 'warn', summary: 'Production message', detail: 'Fill up all fields', life: 3000 });
        
        if(production.quantity === "" ||
            production.quantity <= 0 
        ) return toast.current.show({ severity: 'warn', summary: 'Production message', detail: 'Qty should be greater than to zero [0].', life: 3000 });
        
        try {
            axios.put("/update_production", production);
            toast.current.show({ severity: 'info', summary: 'Production message', detail: 'Successfully added', life: 3000 });
            setVisible(false);
            setTimeout(() => {
                window.location.reload();
            }, [800])
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Production message', detail: 'Failed to produce', life: 3000 });
        } 
    }

    const productionActions = (rowData) => {
        const { _id, quantity, product, status} = rowData;
        return (
            <>
                <Toast ref={toast} />
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
    
    return (
        <>
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
            <div className="p-4 bg-gray-200/[.6] flex items-center gap-4 border border-t-0 border-gray-300">
                <Link to={`/${name === "production" ? "product" : name}s/form`} className="btn-primary px-16 uppercase">{`add new ${name === "production" ? "product" : name?.split("-").join(" ")}`}</Link>
                <div className="h-8 w-[1px] bg-gray-300"></div>
                <div className="flex items-center pl-2 rounded-md bg-gray-300/[.9] w-4/12">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                    type="search"
                    placeholder="Type to search"
                    className="text-sm py-1 px-2 ml-2 rounded-r-md rounded-e-md border border-gray-300 w-full"
                    onChange={(e) => setFilters({global: {value: e.target.value, matchMode: FilterMatchMode.CONTAINS}})}
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
            <div className="px-4 py-8">
                <DataTable
                    value={dataValue}
                    filters={filters}
                    rows={10}
                    paginator
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}">
                    {
                        columns.map((item, idx) => (
                            <Column
                            key={idx}
                            field={
                                item.field === "dateCreated" ?
                                dateCreated :
                                item.field === "dateFinish" ?
                                dateFinish : 
                                item.field === "status" ?
                                statusStyle : item.field
                            }
                            header={item.header}
                            body={
                                item.body === "linkCode" ?
                                tableLink :
                                item.body === "buttons" ?
                                actionBodyTemplate : 
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
