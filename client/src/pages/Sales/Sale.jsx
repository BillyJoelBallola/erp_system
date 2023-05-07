import React, { useEffect, useRef, useState } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Sale = () => {
  const navigate = useNavigate();
  const toast = useRef(null)
  const id = useParams().id;
  const [salesInfo, setSalesInfo] = useState({});

  useEffect(() => {
      if(id){
          axios.get(`/sales/${id}`).then(({ data }) => {
              if(data) setSalesInfo(data);
          })
      }
  }, [id])

  const deleteSalesInfo = (e, id) => {
    confirmPopup({
    target: e.currentTarget,
    message: 'Do you want to delete this order info?',
    icon: 'pi pi-info-circle',
    acceptClassName: 'p-button-danger',
    accept: async () => {
        try {
            const { data } = await axios.delete(`/cancel_order/${id}`);
            if(typeof data === "object"){
                await axios.delete(`/sales/${id}`);
            }
            toast.current.show({ severity: 'info', summary: 'Delete', detail: 'Successfully deleted', life: 3000 });
            setTimeout(() => {
                navigate("/sales");
            }, [800])
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Failed to delete', life: 3000 });
        } 
      },
    });
  }
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
          ORDER INFORMATION
        </div>
        <div className="flex gap-2">
          <Link to={`/sales/form/${id}`} className="btn-outlined" >EDIT</Link>
          <button className="btn-red" onClick={(e) => deleteSalesInfo(e, id)}>DELETE</button>
        </div>
      </div>
      <div className="px-4 py-8 grid gap-6">
        <div className="text-sm mb-6 grid grid-cols-[200px_200px_200px]">
          <div className="grid gap-2 items-center">
            <span className="text-gray-500 font-semibold">
              ORDER'S CODE
            </span>
            <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
              #{salesInfo._id && salesInfo._id.substring(0, 10)}
            </span>
          </div>
          <div className="grid gap-2 items-center">
            <span className="text-gray-500 font-semibold">
              PAYMENT
            </span>
            <span 
              className={`text-xl bg-gray-200 p-1 px-2 rounded-md max-w-max 
                        ${salesInfo.payment === "Completed" ? 
                          "text-green-500" : 
                          salesInfo.payment === "In Progress" ? 
                          "text-blue-400" : 
                          "text-yellow-500" 
                        }`}>
              {salesInfo.payment}
            </span>
          </div>
          <div className="grid gap-2 items-center">
            <span className="text-gray-500 font-semibold">
              SHIPMENT
            </span>
            <span 
              className={`text-xl bg-gray-200 p-1 px-2 rounded-md max-w-max 
                        ${salesInfo.shipment === "Completed" ? 
                          "text-green-500" : 
                          salesInfo.shipment === "In progress" ? 
                          "text-blue-400" : 
                          "text-yellow-500" 
                        }`}>
              {salesInfo.shipment}
            </span>
          </div>
        </div>
      <div className="grid grid-cols-[200px_1fr] items-center">
          <span className="text-gray-500 text-sm font-semibold">CUSTOMER'S NAME</span>
          <span className="text-lg">{salesInfo.customers && salesInfo.customers.name}</span>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-[200px_1fr] items-center">
          <span className="text-gray-500 text-sm font-semibold">SHIPPING ADDRESS</span>
          <span className="text-lg">  
            {salesInfo.customers && `${salesInfo.customers.address.street}, ${salesInfo.customers.address.barangay}, ${salesInfo.customers.address.city}, ${salesInfo.customers.address.province}, ${salesInfo.customers.address.country}`}
          </span>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-[200px_1fr] items-center">
          <span className="text-gray-500 text-sm font-semibold">DATE ORDERED</span>
          <span className="text-lg">{moment(salesInfo.dateOrdered).format("MMMM D YYYY")}</span>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-[200px_1fr]">
          <span className="text-gray-500 text-sm font-semibold self-baseline">ORDER INFO</span>
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
              salesInfo.order &&
              salesInfo.order.length > 0 &&
              salesInfo.order.map((order) => (
                <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-5 py-4" key={order.item}>
                  <span>{order.name}</span>
                  <span>{order.uom}</span>
                  <span>{order.unitPrice}</span>
                  <span>{order.qty}</span>
                  <span>{order.discount ? order.discount : "0"}%</span>
                  <span>{order.total}</span>
                </div>
              ))
            }
          </div>
        </div>
        
        <div className="mt-2 border border-y-gray-300 flex justify-end px-10 py-4 bg-gray-100">
          <div className="w-[300px]">
            <div className="text-sm flex justify-between">
              <span>DISCOUNT</span>
              <span>{salesInfo.discount && salesInfo.discount.toFixed(2)}</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>SUBTOTAL</span>
              <span>{salesInfo.subTotal && salesInfo.subTotal.toFixed(2)}</span>
            </div>
            <div className="text-2xl font-bold flex justify-between">
              <span>TOTAL</span>
              <span>{salesInfo.total && salesInfo.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sale;
