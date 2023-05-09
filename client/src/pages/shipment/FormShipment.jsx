import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import axios from "axios";
import moment from "moment";

const FormShipment = () => {
    const toast = useRef();
    const navigate = useNavigate();
    const id = useParams().id;
    const [orders, setOrders] = useState([]);
    const [orderInfo, setOrderInfo] = useState({
        address: "",
        dateOrdered: "",
        discount: "",   
        subTotal: "",
        total: "",
        order: []
    })
    const [shipOrder, setShipOrder] = useState({
        salesOrder: "",
        address: "",
        dateShipment: ""
    })

    useEffect(() => {
        axios.get("/sales")
            .then(({ data }) => {
                if(data) return setOrders(data);
            })
    }, []);

    useEffect(() => {
      if(id){
        axios.get(`/shipment/${id}`)
            .then(({ data }) => {
                if(data) {
                  setShipOrder(data);
                  setOrderInfo(data.salesOrder);
                };
            })
      }
    }, [id]);

    const selectOrder = (e) => {
        const id = e.target.value;
        const selectedOrder = orders.filter((order) => (order._id === id));
        const dateOrdered = selectedOrder[0]?.dateOrdered;
        const order = selectedOrder[0]?.order;
        const address = selectedOrder[0]?.customers.address;
        const discount = selectedOrder[0]?.discount;
        const subTotal = selectedOrder[0]?.subTotal;
        const total = selectedOrder[0]?.total;
        let formattedAddress = "";
        if(address){
            formattedAddress = `${address?.street}, ${address?.barangay}, ${address?.city}, ${address?.province}, ${address?.country}`;
        }

        setOrderInfo((prev) => ({
            ...prev,
            address: formattedAddress,  
            dateOrdered: dateOrdered,
            discount: discount,
            subTotal: subTotal,
            total: total,
            order: order
        }))

        setShipOrder((prev) => ({
            ...prev,
            salesOrder: id,
            address: formattedAddress
        }))
    }

    const editShipment = (e) => {
      confirmPopup({
        target: e.currentTarget,
        message: "Do you want to edit this shipment info?",
        icon: "pi pi-info-circle",
        acceptClassName: "p-button-danger",
        accept: async () => {
          if (
            shipOrder.salesOrder === "" ||
            shipOrder.dateShipment === ""
          )
          return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });
  
          const { data } = await axios.put("/update_shipment", { ...shipOrder, id });
          
          if (data) {
            navigate(`/shipments/${data._id}`);
          } else {
            return toast.current.show({ severity: 'error', summary: 'Form message', detail: 'Failed to edit shipment.', life: 3000 });
          }
        }
      });
    }
  
    const addNewShipment = (e) => {
      confirmPopup({
        target: e.currentTarget,
        message: "Do you want to add this shipment info?",
        icon: "pi pi-info-circle",
        acceptClassName: "p-button-danger",
        accept: async () => {
          if (
            shipOrder.salesOrder === "" ||
            shipOrder.dateShipment === ""
          )
          return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });
  
          const { data } = await axios.post("/add_shipment", shipOrder);
          
          if (data) {
            navigate(`/shipments/${data._id}`);
          } else {
            return toast.current.show({ severity: 'error', summary: 'Form message', detail: 'Failed to add shipment.', life: 3000 });
          }
        }
      });
    }
  
    return (
      <>
        <Toast ref={toast} />
        <ConfirmPopup />
        <div className="bg-gray-100 flex items-center justify-between px-4 py-3 border-0 border-b">
          <div className="font-semibold text-blue-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            {id ? "EDIT SHIPMENT INFORMATION" : "ADD NEW SHIPMENT"}
          </div>
          <button
            className="btn-outlined"
            onClick={id ? editShipment : addNewShipment }
          >
            {id ? "SAVE EDIT" : "SAVE"}
          </button>
        </div>
        <div className="px-8 py-12">
          {id && (
            <div className="grid gap-2 items-center mb-10">
              <span className="text-gray-500 font-semibold">
                SHIPMENT'S CODE
              </span>
              <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                #{id.substring(0, 10)}
              </span>
            </div>
          )}
          <div className="grid gap-8">
            <div className="grid grid-cols-[200px_1fr] items-center">
              <span className="text-gray-500 font-semibold self-baseline">
                ORDER INFO<span className="text-red-400">*</span>
              </span>
              <div className="grid grid-cols-2 gap-10">
                <div className="grid row-2 gap-8">
                  <div className="grid gap-1">
                    <span className="text-gray-500 font-semibold text-xs">ORDER CODE - NAME</span>
                    <select name="customer" value={shipOrder.salesOrder._id ? shipOrder.salesOrder._id : shipOrder.salesOrder}  onChange={selectOrder}>
                      <option value="">Select order</option>
                      {
                        orders.length > 0 &&
                        orders.map((info) => {
                          if(info.shipment === "Pending"){
                            return (
                              <option value={info._id} key={info._id}>{info._id.toString().substring(0, 10)}-{info.customers.name}</option>
                            )
                          }
                        })
                      }
                    </select>
                  </div>
                  <div>
                    <div className="grid gap-1">
                        <span className="text-gray-500 font-semibold text-xs">SHIPPING ADDRESS</span>
                        <span className="text-gray-800">{`${shipOrder.address ? shipOrder.address : orderInfo.address ? orderInfo.address : "--"}`}</span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 font-semibold text-xs">DATE SHIPMENT</span>
                        <input type="date" name="dateOrdered" value={shipOrder.dateShipment.toString().slice(0, 10)} onChange={(e) => setShipOrder((prev) => ({...prev, dateShipment: e.target.value}))}/>
                    </div>
                    <div className="grid gap-1">
                        <span className="text-gray-500 font-semibold text-xs">DATE ORDERED</span>
                        <span className="text-gray-800">{`${orderInfo.dateOrdered ? moment(orderInfo.dateOrdered.toString().slice(0, 10)).format("MMM D YYYY") : "--"}`}</span>
                    </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="grid grid-cols-[200px_1fr] items-center">
              <span className="text-gray-500 font-semibold self-baseline">
                ORDERED ITEM/S
              </span>
              <div className="grid gap-5">
                <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-3 text-gray-500 font-semibold text-xs">
                    <span>ITEM</span>
                    <span>UOM</span>
                    <span>UNIT PRICE</span>
                    <span>QTY</span>
                    <span>DISCOUNT%</span>
                    <span>TOTAL</span>
                </div>
                <div className="grid gap-8">
                  <div className="grid gap-2 text-sm bg-white border border-x-0 p-3">
                    {
                      orderInfo.order &&
                      orderInfo.order.length > 0 ?
                      orderInfo.order.map((item) => (
                        <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-3 py-2 text-gray-800 text-sm" key={item.item}>
                          <span>{item.name}</span>
                          <span>{item.uom}</span>
                          <span>{item.unitPrice}</span>
                          <span>{item.qty}</span>
                          <span>{item.discount ? item.discount + "%" : "0%"}</span>
                          <span>{item.total}</span>
                        </div>
                      )) :
                      <div className="py-2">
                        <span>Empty item list.</span>
                      </div>
                    }
                  </div>
                  <div className="flex justify-end px-6 py-4 bg-green-100 border border-x-0 border-y-green-200">
                    <div className="w-[300px]">
                      <div className="text-sm flex justify-between">
                        <span>DISCOUNT</span>
                        <span>{orderInfo.discount ? orderInfo.discount.toFixed(2) : "0.00"}</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span>SUBTOTAL</span>
                        <span>{orderInfo.subTotal ? orderInfo.subTotal.toFixed(2) : "0.00"}</span>
                      </div>
                      <div className="text-2xl font-bold flex justify-between">
                        <span>TOTAL</span>
                        <span>{orderInfo.total ? orderInfo.total.toFixed(2) : "0.00"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default FormShipment;
