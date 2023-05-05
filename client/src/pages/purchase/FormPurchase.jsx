import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import axios from "axios";

const FormPurchase = () => {
    const toast = useRef();
    const navigate = useNavigate();
    const id = useParams().id;
    const [suppliers, setSuppliers] = useState([]);
    const [totals, setTotals] = useState({
        discount: 0,
        subTotal: 0,
        total: 0
    });
    const [itemData, setItemData] = useState({
        item: "",
        uom: "",
        unitPrice: "",
        qty: "",
        discount: "",
        total: ""
    });
    const [purchaseData, setPurchaseData] = useState({
        supplier: "",
        datePurchase: "",
        order: []
    });

    useEffect(() => {
        axios.get("/suppliers")
            .then(({ data }) => {
                if(data) setSuppliers(data);
            })
    }, [])

    useEffect(() => {
        if(id){
            axios.get(`/purchases/${id}`)
            .then(({ data }) => {
                if(data) setPurchaseData(data);
            })
        }
    }, [id])

    const totalValue = (value) => {
        let qty = value;
        const price = itemData.unitPrice;
        let total = price * Number(qty);
        setItemData((prev) => ({
            ...prev,
            total: total
        }))
    }

    const inputItem = (e) => {
        setItemData((prev) => ({
            ...prev,
            [e.target.name] : e.target.value
        }))

        if(e.target.name === "qty"){ 
            totalValue(e.target.value);
        }
    }

    const selectSupplier = (e) => {
        const value = e.target.value;
        const selectedSupplier = suppliers.filter((supplier) => (supplier._id === value));
        const id = selectedSupplier[0]?._id;

        setPurchaseData((prev) => ({
            ...prev,
            supplier: id
        }))
    }

    const resetItemData = () => {
        setItemData({
            item: "",
            uom: "",
            unitPrice: "",
            qty: "",
            discount: "",
            total: ""
        })
    }

    const addItem = (e) => {
        e.preventDefault();

        if(itemData.item === "" ||
        itemData.uom === "" ||
        itemData.unitPrice === "" ||
        itemData.qty === 0 || itemData.qty === ""
        ){
            return toast.current.show({ severity: 'warn', summary: 'Adding Item', detail: "Fill up all fields.", life: 3000 });
        }
      
        const existingItem = purchaseData.order.filter((item) => (item.item.toLowerCase() === itemData.item.toLowerCase()));
        if(existingItem.length > 0){
            resetItemData();
            return toast.current.show({ severity: 'warn', summary: 'Adding Item', detail: `Item already in the list.`, life: 3000 });
        }

        setPurchaseData((prev) => ({
            ...prev,
            order: [...prev.order, itemData]
        }))
        resetItemData();
    }

    const removeItem = (idx) => {
        const newItemData = [...purchaseData.order];
        newItemData.splice(idx, 1);
        setPurchaseData((prev) => ({
            ...prev,
            order: newItemData
        }));
    }

    useEffect(() => {
        const getTotalValue = () => {
            let discount = 0;
            let subTotal = 0;
        
            if(purchaseData.order && purchaseData.order.length > 0){
                purchaseData.order.map((item) => {
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
    }, [itemData, purchaseData])

    const editPurchase = (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to edit this purchase info?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                if (
                    purchaseData.supplier === "" ||
                    purchaseData.datePurchase === "" ||
                    purchaseData.order.length <= 0
                )
                return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });
        
                const { discount, total, subTotal } = totals;
                const { supplier, order, datePurchase } = purchaseData;
                const { _id } = supplier;
                const { data } = await axios.put("/update_purchase", { _id,  order, datePurchase, discount, subTotal, total, id });
                if (data) {
                    navigate(`/purchases/${data._id}`);
                } else {
                    return toast.current.show({ severity: 'error', summary: 'Form message', detail: 'Failed to add order.', life: 3000 });
                }
            }
        });
    }

    const addNewPurchase = (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to add this purchase info?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                if (
                    purchaseData.supplier === "" ||
                    purchaseData.datePurchase === "" ||
                    purchaseData.order.length <= 0
                )
                return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });
        
                const { discount, total, subTotal } = totals;
                const { supplier, order, datePurchase } = purchaseData;
                const { data } = await axios.post("/add_purchase", { supplier, order, datePurchase, discount, subTotal, total });
                if (data) {
                    navigate(`/purchases/${data._id}`);
                } else {
                    return toast.current.show({ severity: 'error', summary: 'Form message', detail: 'Failed to add order.', life: 3000 });
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            {id ? "EDIT PURCHASE INFORMATION" : "ADD NEW PURCHASE"}
          </div>
          <button
            className="btn-outlined"
            onClick={id ? editPurchase : addNewPurchase }
          >
            {id ? "SAVE EDIT" : "SAVE"}
          </button>
        </div>
        <div className="px-8 py-12">
          {id && (
            <div className="text-sm mb-10 grid grid-cols-[200px_200px]">
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
                <span className={`text-xl bg-gray-200 p-1 px-2 rounded-md max-w-max ${purchaseData.payment === "Pending" ? "text-yellow-500" : "text-blue-400"} `}>
                  {purchaseData.payment}
                </span>
              </div>
            </div>
          )}
          <div className="grid gap-8">
            <div className="grid grid-cols-[200px_1fr] items-center">
              <span className="text-gray-500 font-semibold self-baseline">
                SUPPLIER INFO<span className="text-red-400">*</span>
              </span>
              <div className="grid grid-cols-2 gap-10">
                <div className="grid row-2 gap-8">
                  <div className="grid gap-1">
                    <span className="text-gray-500 font-semibold text-xs">SUPPLIER</span>
                    <select name="supplier" value={purchaseData.supplier ? purchaseData.supplier._id : purchaseData.supplier} onChange={selectSupplier}>
                      <option value="">Select supplier</option>
                      {
                        suppliers.length > 0 &&
                        suppliers.map((info) => (
                          <option value={info._id} key={info._id}>{info.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-semibold text-xs">DATE PURCHASE</span>
                  <input type="date" name="datePurchase" value={purchaseData.datePurchase.toString().slice(0, 10)} onChange={(e) => setPurchaseData(prev => ({...prev, [e.target.name]: e.target.value}))}/>
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
                    <input type="text" placeholder="Item" name="item" value={itemData.item} onChange={inputItem}/>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-gray-500 font-semibold text-xs">UOM</span>
                    <input type="text" placeholder="uom" name="uom" value={itemData.uom} onChange={inputItem}/>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-gray-500 font-semibold text-xs">UNIT PRICE</span>
                    <input type="number" placeholder="price" name="unitPrice" value={itemData.unitPrice} onChange={inputItem}/>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-gray-500 font-semibold text-xs">QTY</span>
                    <input type="number" placeholder="Qty" name="qty" value={itemData.qty} onChange={inputItem}/>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-gray-500 font-semibold text-xs">DISCOUNT%</span>
                    <input type="number" placeholder="Discount" name="discount" value={itemData.discount} onChange={inputItem}/>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-gray-500 font-semibold text-xs">TOTAL</span>
                    <span className="text-gray-800 text-sm">{itemData.total ? itemData.total : ""}</span>
                  </div>
                  <div className="grid place-items-center">
                    <button className="bg-blue-400 text-white rounded p-1" onClick={addItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </form>
                <div className="grid gap-8">
                  <div className="grid gap-2 text-sm bg-white border border-x-0 p-3">
                    {
                      purchaseData.order &&
                      purchaseData.order.length > 0 ?
                      purchaseData.order.map((item, idx) => (
                        <div className="grid grid-cols-[1fr_50px_50px_50px_50px_50px_50px] gap-10 py-2 text-gray-800 text-sm" key={item.item}>
                          <span>{item.item}</span>
                          <span>{item.uom}</span>
                          <span>{item.unitPrice}</span>
                          <span>{item.qty}</span>
                          <span>{item.discount ? item.discount + "%" : "0%"}</span>
                          <span>{item.total}</span>
                          <button onClick={() => removeItem(idx)}>
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
                  <div className="flex justify-end px-6 py-4 bg-blue-100 border border-x-0 border-y-blue-200">
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

export default FormPurchase;
