import React, { useEffect, useRef, useState } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Shipment = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const id = useParams().id;
    const [shipmentInfo, setShipmentInfo] = useState({});

    useEffect(() => {
        if (id) {
            axios.get(`/shipment/${id}`).then(({ data }) => {
                if (data) setShipmentInfo(data);
            });
        }
    }, [id]);

    const deleteShipmentInfo = (e, id) => {
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to delete this shipment info?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.delete(`/shipment/${id}`);
                    toast.current.show({
                        severity: "info",
                        summary: "Delete",
                        detail: "Successfully deleted",
                        life: 3000,
                    });
                    setTimeout(() => {
                        navigate("/shipments");
                    }, [800]);
                } catch (error) {
                    toast.current.show({
                        severity: "error",
                        summary: "Delete",
                        detail: "Failed to delete",
                        life: 3000,
                    });
                }
            },
        });
    };

    const finishShipment = async (e, orderId, shipmentId) => {
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to set as finish this shipment info?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.put("/finish_shipment", { orderId, shipmentId });
                    toast.current.show({
                        severity: "info",
                        summary: "Finish",
                        detail: "Shipment has been completed.",
                        life: 3000,
                    });
                    setTimeout(() => {
                        navigate("/shipments");
                    }, [800]);
                } catch (error) {
                    toast.current.show({
                        severity: "error",
                        summary: "Finish",
                        detail: "Failed to set as finish",
                        life: 3000,
                    });
                }
            },
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
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
                            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0  00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        ></path>
                    </svg>
                    SHIPMENT INFORMATION
                </div>
                <div className="flex gap-2">
                    {
                        shipmentInfo &&
                        shipmentInfo.status === "In progress" ?
                        <>
                            <button className="btn-primary px-4" onClick={(e) => finishShipment(e, shipmentInfo.salesOrder._id, id)}>
                            FINSIH
                            </button>
                            <Link to={`/shipments/form/${id}`} className="btn-outlined">
                                EDIT
                            </Link>
                            <button className="btn-red" onClick={(e) => deleteShipmentInfo(e, id)}>
                                DELETE
                            </button>
                        </>
                        :
                        <button className="btn-red" onClick={(e) => deleteShipmentInfo(e, id)}>
                            DELETE
                        </button>
                    }
                </div>
            </div>
            <div className="px-4 py-8 grid gap-6">
                <div className="text-sm mb-6 grid grid-cols-[200px_200px_200px]">
                    <div className="grid gap-2 items-center">
                        <span className="text-gray-500 font-semibold">
                            SHIPMET'S CODE
                        </span>
                        <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                            #{shipmentInfo._id && shipmentInfo._id.substring(0, 10)}
                        </span>
                    </div>
                    <div className="grid gap-2 items-center">
                        <span className="text-gray-500 font-semibold">
                            ORDER'S CODE
                        </span>
                        <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                            #{shipmentInfo.salesOrder && shipmentInfo.salesOrder._id.substring(0, 10)}
                        </span>
                    </div>
                    <div className="grid gap-2 items-center">
                        <span className="text-gray-500 font-semibold">
                            STATUS
                        </span>
                        <span
                            className={`text-xl bg-gray-200 p-1 px-2 rounded-md max-w-max ${
                                shipmentInfo.status === "In progress"
                                    ? "text-yellow-500"
                                    : "text-green-400"
                            }`}
                        >
                            {shipmentInfo.status}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-[200px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold">
                        SHIPPING ADDRESS
                    </span>
                    <span className="text-lg">
                        {shipmentInfo.address}
                    </span>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                <div className="grid grid-cols-[200px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold self-baseline">
                        DATES
                    </span>
                    <div className="grid grid-cols-2 items-center">
                        <div className="grid">
                            <span className="text-gray-500 mb-2 text-sm font-semibold">
                                DATE ORDERED
                            </span>
                            <span className="text-lg">
                                {shipmentInfo.salesOrder && moment(shipmentInfo.salesOrder.dateOrdered).format("MMMM D YYYY")}
                            </span>
                        </div>
                        <div className="grid">
                            <span className="text-gray-500 mb-2 text-sm font-semibold">
                                DATE SHIPMENT
                            </span>
                            <span className="text-lg">
                                {shipmentInfo.dateShipment && moment(shipmentInfo.dateShipment).format("MMMM D YYYY")}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                <div className="grid grid-cols-[200px_1fr]">
                    <span className="text-gray-500 text-sm font-semibold self-baseline">
                        ORDER INFO
                    </span>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-5 text-gray-500 font-semibold text-sm">
                            <span>ITEM</span>
                            <span>UOM</span>
                            <span>UNIT PRICE</span>
                            <span>QTY</span>
                            <span>DISCOUNT</span>
                            <span>TOTAL</span>
                        </div>
                        {
                            shipmentInfo.salesOrder &&
                            shipmentInfo.salesOrder.order.length > 0 &&
                            shipmentInfo.salesOrder.order.map((order) => (
                                <div
                                    className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-5 py-4"
                                    key={order.item}
                                >
                                    <span>{order.name}</span>
                                    <span>{order.uom}</span>
                                    <span>{order.unitPrice}</span>
                                    <span>{order.qty}</span>
                                    <span>
                                        {order.discount ? order.discount : "0"}%
                                    </span>
                                    <span>{order.total}</span>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="mt-2 border border-y-gray-300 flex justify-end px-10 py-4 bg-gray-100">
                    <div className="w-[300px]">
                        <div className="text-sm flex justify-between">
                            <span>DISCOUNT</span>
                            <span>
                                {shipmentInfo.salesOrder &&
                                    shipmentInfo.salesOrder.discount.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-sm flex justify-between">
                            <span>SUBTOTAL</span>
                            <span>
                                {shipmentInfo.salesOrder &&
                                    shipmentInfo.salesOrder.subTotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-2xl font-bold flex justify-between">
                            <span>TOTAL</span>
                            <span>
                                {shipmentInfo.salesOrder && 
                                    shipmentInfo.salesOrder.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shipment;
