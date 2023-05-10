import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import moment from "moment";

const Purchase = () => {
    const navigate = useNavigate();
    const id = useParams().id;
    const [purchaseInfo, setPurchaseInfo] = useState({});

    useEffect(() => {
        if (id) {
            axios.get(`/purchases/${id}`).then(({ data }) => {
                if (data) setPurchaseInfo(data);
            });
        }
    }, [id]);

    const deletePurchaseInfo = (e, id) => {
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to delete this purchase info?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.delete(`/purchase/${id}`);
                    toast.success("Successfully deleted", { position: toast.POSITION.TOP_RIGHT });
                    setTimeout(() => {
                        navigate("/purchases");
                    }, [800]);
                } catch (error) {
                    toast.error("Failed to delete.", { position: toast.POSITION.TOP_RIGHT });
                }
            },
        });
    };
    return (
        <>
            <ToastContainer 
                draggable={false}
            />
            <ConfirmPopup />
            <div className="bg-gray-100 flex items-center justify-between px-4 py-3 border-b-[1px]">
                <div className="font-semibold text-blue-400 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    PURCHASE INFORMATION
                </div>
                <div className="flex gap-2">
                    {
                        purchaseInfo.payment === "Unpaid" &&
                        <Link to={`/purchases/form/${id}`} className="btn-outlined">
                            EDIT
                        </Link>
                    }
                    <button
                        className="btn-red"
                        onClick={(e) => deletePurchaseInfo(e, id)}
                    >
                        DELETE
                    </button>
                </div>
            </div>
            <div className="px-4 py-8 grid gap-6">
                <div className="text-sm mb-6 grid grid-cols-[200px_200px]">
                    <div className="grid gap-2 items-center">
                        <span className="text-gray-500 font-semibold">
                            ORDER'S CODE
                        </span>
                        <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                            #{purchaseInfo._id && purchaseInfo._id.substring(0, 10)}
                        </span>
                    </div>
                    <div className="grid gap-2 items-center">
                        <span className="text-gray-500 font-semibold">
                            PAYMENT
                        </span>
                        <span
                            className={`text-xl bg-gray-200 p-1 px-2 rounded-md max-w-max ${
                                purchaseInfo.payment === "Unpaid"
                                    ? "text-yellow-500"
                                    : "text-green-400"
                            }`}
                        >
                            {purchaseInfo.payment}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-[200px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold">
                        SUPPLIER'S NAME
                    </span>
                    <span className="text-lg">
                        {purchaseInfo.supplier && purchaseInfo.supplier.name}
                    </span>
                </div>
                <div className="w-full h-[1px] bg-gray-200"></div>
                <div className="grid grid-cols-[200px_1fr] items-center">
                    <span className="text-gray-500 text-sm font-semibold">
                        DATE PURCHASE
                    </span>
                    <span className="text-lg">
                        {moment(purchaseInfo.dateOrdered).format("MMMM D YYYY")}
                    </span>
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
                        {purchaseInfo.order &&
                            purchaseInfo.order.length > 0 &&
                            purchaseInfo.order.map((order, idx) => (
                                <div
                                    className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-5 py-4"
                                    key={idx}
                                >
                                    <span>{order.item}</span>
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
                                {purchaseInfo.discount &&
                                    purchaseInfo.discount.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-sm flex justify-between">
                            <span>SUBTOTAL</span>
                            <span>
                                {purchaseInfo.subTotal &&
                                    purchaseInfo.subTotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-2xl font-bold flex justify-between">
                            <span>TOTAL</span>
                            <span>
                                {purchaseInfo.total && purchaseInfo.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Purchase;
