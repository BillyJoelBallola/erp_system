import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const FormSales = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [totals, setTotals] = useState({
    discount: 0,
    subTotal: 0,
    total: 0
  })
  const [customerData, setCustomerData] = useState({
    id: "",
    name: "",
    address: "" 
  })
  const [itemInfo, setItemInfo] = useState({
    item: "",
    name: "",
    uom: "",
    unitPrice: "",
    qty: "",
    discount: "",
    total: ""
  })
  const [salesOrder, setSalesOrder] = useState({
    customer: "",
    order: [],
    dateOrdered: "",
  })

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

  useEffect(() => {
    axios.get("/customers")
      .then(({ data }) => {
        if(data) setCustomers(data);
      })

    axios.get("/products")
      .then(({ data }) => {
        if(data) setProducts(data);
      })
  }, [])

  useEffect(() => { 
    if(id){
      axios.get(`/sales/${id}`)
        .then(({ data }) => {
          setSalesOrder(data);
          setCustomerData((prev) => ({
           ...prev, 
            id: data.customers._id,
            address: data.customers.address.street + ", " + data.customers.address.barangay + ", " + data.customers.address.city + ", " + data.customers.address.province + ", " + data.customers.address.country
          }))
        })
    }
  }, [id])

  const selectCustomer = (e) => {
    const selectedId = e.target.value;
    const customer = customers.filter(({ _id }) => (_id === selectedId));
    const id = customer[0]?._id;
    const name = customer[0]?.name;
    const address = customer[0]?.address;
    let formattedAddress = "";
    if(address){
      formattedAddress = `${address.street ? address.street + ", " : ""}${address.barangay ? address.barangay + ", " : ""}${address?.city}, ${address?.province}, ${address?.country}`;
    }
    setCustomerData((prev) => ({
      ...prev,
      id: id,
      name: name,
      address: formattedAddress
    }))

    setSalesOrder((prev) => ({
      ...prev,
      customer: id
    }))
  }

  const inputForm = (e) => {
    setSalesOrder((prev) => ({
      ...prev,
      dateOrdered: e.target.value
    }))
  }

  const selectItem = (e) => {
    const selectedId = e.target.value;
    const orderItem = products.filter(({ _id }) => (_id === selectedId));
    const id = orderItem[0]?._id;
    const name = orderItem[0]?.name;
    const uom = orderItem[0]?.maesurement;
    const price = orderItem[0]?.price;

    setItemInfo((prev) => ({
      ...prev,
      item: id,
      name: name,
      uom: uom,
      unitPrice: price
    }))
  }

  const totalValue = (value) => {
    let qty = value;
    const price = itemInfo.unitPrice;
    let total = price * Number(qty);
    setItemInfo((prev) => ({
      ...prev,
      total: total
    }))
  }

  const inputItemInfo = (e) => {
    setItemInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if(e.target.name === "qty"){ 
      totalValue(e.target.value);
    }
  }

  const resetItemInfo = () => {
    setItemInfo({
      item: "",
      name: "",
      uom: "",
      unitPrice: "",
      qty: "",
      discount: "",
      total: ""
    })
  }

  const addItem = (e, itemId) => {
    e.preventDefault();
    let good = false;
    products.map((item) => {
      if(item._id === itemId){
        if(itemInfo.qty > item.quantity){
          return good = true;
        }
      }
    })

    if(good){
      return toastMsgBox("warning", "Qty should be less than or equal to the in stock quantity.");
    }

    if(itemInfo.item === ""){
      return toastMsgBox("warning", "Pleas select an item.");
    }

    if(itemInfo.qty === 0 || itemInfo.qty === ""){
      return toastMsgBox("warning", "Qty should be greater than to one[1].");
    }

    const existingItem = salesOrder.order.filter((item) => (item.item === itemInfo.item));
    if(existingItem.length > 0){
      resetItemInfo();
      return toastMsgBox("warning", "Item is already in the list. Try other items.");
    }

    setSalesOrder((prev) => ({
      ...prev, 
      order: [...prev.order, itemInfo],
    }))

    resetItemInfo();
  }

  const removeItem = (idx, id) => {
    const removingItem = salesOrder.order.filter((item) => (item.item === id));
    const currentDiscount = removingItem[0]?.discount / 100;
    const currentSubTotal = removingItem[0]?.total - (currentDiscount * removingItem[0]?.unitPrice);
    setTotals((prev) => ({
      ...prev,
      discount: prev.discount - currentDiscount,
      subTotal:  prev.subTotal - removingItem[0]?.total,
      total: prev.total - currentSubTotal
    }))

    const newItemInfo = [...salesOrder.order];
    newItemInfo.splice(idx, 1);
    setSalesOrder((prev) => ({
      ...prev,
      order: newItemInfo
    }));
  }

  useEffect(() => {
    const getTotalValue = () => {
      let discount = 0;
      let subTotal = 0;
  
      if(salesOrder.order && salesOrder.order.length > 0){
        salesOrder.order.map((item) => {
          discount += Number(item.discount);
          subTotal += Number(item.total);
        })  
      }

      let totalDiscount = discount / 100 * subTotal;

      setTotals((prev) => ({
        ...prev, 
        discount: discount / 100,
        subTotal: subTotal,
        total: subTotal - totalDiscount
      }));
    }
    getTotalValue();
  }, [itemInfo, salesOrder])
  
  const editSalesOrder = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to add this sales order?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          salesOrder.customer === "" ||
          salesOrder.order < 0 ||
          salesOrder.dateOrdered === "" ||
          totals.total === ""
        )
        return toastMsgBox("warning", "Fill up all fields.");

        const { discount, total, subTotal } = totals;
        const { customers, order, dateOrdered } = salesOrder;
        const { _id } = customers;
        const { data } = await axios.put("/update_sales", { _id, order, dateOrdered, discount, subTotal, total, id });
        if (data) {
          axios.put("/reduce_sales_product_qty", { order });
          navigate(`/sales/${data._id}`);
        } else {
          return toastMsgBox("error", "Failed to edit order info.");
        }
      }
    });
  }

  const addNewSalesOrder= (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to add this sales order?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          salesOrder.customer === "" ||
          salesOrder.order <= 0 ||
          salesOrder.dateOrdered === "" ||
          totals.total === ""
        )
        return toastMsgBox("warning", "Fill up all fields.");

        const { discount, total, subTotal } = totals;
        const { customer, order, dateOrdered } = salesOrder;
        const { data } = await axios.post("/add_sales", { customer, order, dateOrdered, discount, subTotal, total });
        if (data) {
          axios.put("/reduce_sales_product_qty", { order });
          navigate(`/sales/${data._id}`);
        } else {
          return toastMsgBox("error", "Failed to add order.");
        }
      }
    });
  }

  return (
    <>
      <ToastContainer 
        draggable={false}
        hideProgressBar={true}
      />
      <ConfirmPopup />
      <div className="bg-gray-100 flex items-center justify-between px-4 py-3 border-0 border-b">
        <div className="font-semibold text-blue-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          {id ? "EDIT SALES ORDER INFORMATION" : "ADD NEW SALES ORDER"}
        </div>
        <button
          className="btn-outlined"
          onClick={id ? editSalesOrder : addNewSalesOrder}
        >
          {id ? "SAVE EDIT" : "SAVE"}
        </button>
      </div>
      <div className="px-8 py-12">
        {id && (
          <div className="text-sm mb-10 grid grid-cols-[200px_200px_200px]">
            <div className="grid gap-2 items-center">
              <span className="text-gray-500 font-semibold">
                ORDER'S CODE
              </span>
              <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                #{id.substring(0, 10)}
              </span>
            </div>
            <div className="grid gap-2 items-center">
              <span className="text-gray-500 font-semibold">
                PAYMENT
              </span>
              <span 
                className={`text-xl bg-gray-200 p-1 px-2 rounded-md max-w-max 
                          ${salesOrder.payment === "Unpaid" ? 
                          "text-yellow-500" : "text-green-500"
                          }`}>
                {salesOrder.payment}
              </span>
            </div>
            <div className="grid gap-2 items-center">
              <span className="text-gray-500 font-semibold">
                SHIPMENT
              </span>
              <span  
                className={`text-xl bg-gray-200 p-1 px-2 rounded-md max-w-max 
                        ${salesOrder.shipment === "Completed" ? 
                          "text-green-500" : 
                          salesOrder.shipment === "In progress" ? 
                          "text-blue-400" : 
                          "text-yellow-500" 
                        }`}>
                {salesOrder.shipment}
              </span>
            </div>
          </div>
        )}
        <div className="grid gap-8">
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold self-baseline">
              CUSTOMER INFO<span className="text-red-400">*</span>
            </span>
            <div className="grid grid-cols-2 gap-10">
              <div className="grid row-2 gap-8">
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">CUSTOMER</span>
                  <select name="customer" value={customerData.id} onChange={selectCustomer}>
                    <option value="">Select customer name</option>
                    {
                      customers.length > 0 &&
                      customers.map((info) => (
                        <option value={info._id} key={info._id}>{info.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">SHIPPING ADDRESS</span>
                  <span className="text-gray-800">{`${customerData.address ? customerData.address : "--"}`}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-xs">DATE ORDER</span>
                <input type="date" name="dateOrdered" value={salesOrder.dateOrdered.toString().slice(0, 10)} onChange={inputForm}/>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold self-baseline">
              ITEM INFO<span className="text-red-400">*</span>
            </span>
            <div className="grid gap-8">
              <form className="grid grid-cols-[1fr_100px_100px_100px_100px_100px_50px] gap-3">
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">ITEM</span>
                  <select name="item" value={itemInfo.item} onChange={selectItem}>
                    <option value="">Select item</option>
                    {
                      products &&
                      products.map((item) => (
                        <option value={item._id} key={item._id}>{item.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">UOM</span>
                  <span className="text-gray-700 text-sm">{itemInfo.uom ? itemInfo.uom : "--"}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">UNIT PRICE</span>
                  <span className="text-gray-700 text-sm">{itemInfo.unitPrice ? itemInfo.unitPrice : "--"}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">QTY</span>
                  <input type="number" name="qty" placeholder="Qty" value={itemInfo.qty} onChange={inputItemInfo}/>
                </div>
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">DISCOUNT%</span>
                  <input type="number" name="discount" placeholder="Discount" value={itemInfo.discount} onChange={inputItemInfo}/>
                </div>
                <div className="grid gap-1">
                  <span className="text-gray-500 font-semibold text-xs">TOTAL</span>
                  <span className="text-gray-700 text-sm">{itemInfo.total ? itemInfo.total : ""}</span>
                </div>
                <div className="grid place-items-center">
                  <button className="bg-blue-400 text-white rounded p-1" onClick={(e) => addItem(e, itemInfo.item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </form>
              <div className="grid gap-8">
                <div className="grid gap-2 text-sm bg-white border border-x-0 p-3">
                  {
                    salesOrder.order &&
                    salesOrder.order.length > 0 ?
                    salesOrder.order.map((item, idx) => (
                      <div className="grid grid-cols-[1fr_50px_50px_50px_50px_50px_50px] gap-10 py-2 text-gray-800 text-sm" key={item.item}>
                        <span>{item.name}</span>
                        <span>{item.uom}</span>
                        <span>{item.unitPrice}</span>
                        <span>{item.qty}</span>
                        <span>{item.discount ? item.discount + "%" : "0%"}</span>
                        <span>{item.total}</span>
                        <button onClick={() => removeItem(idx, item.item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )) :
                    <div className="py-2">
                      <span>No selected item</span>
                    </div>
                  }
                </div>
                <div className="flex justify-end px-6 py-4 bg-yellow-100 border border-x-0 border-y-yellow-200">
                  <div className="w-[300px]">
                    <div className="text-sm flex justify-between">
                      <span>DISCOUNT</span>
                      <span>{totals.discount.toFixed(2)}</span>
                    </div>
                    <div className="text-sm flex justify-between">
                      <span>SUBTOTAL</span>
                      <span>{totals.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-2xl font-bold flex justify-between">
                      <span>TOTAL</span>
                      <span>{totals.total.toFixed(2)}</span>
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

export default FormSales;
