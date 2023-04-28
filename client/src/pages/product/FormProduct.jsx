import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const FormProduct = () => {
  const toast = useRef(); 
  const navigate = useNavigate();
  const id = useParams().id;
  const [cat, setCat] = useState("");
  const [rawData, setRawData] = useState([]);
  const [storage, setStorage] = useState([]);
  const [rawMaterialData, setRawMaterialData] = useState({
    rawId: "",
    item: "",
    oum: "",
    qty: 0
  });
  const [products, setProducts] = useState({
    name: "",
    maesurement: "",
    rawMaterial: [],
    category: "",
    quantity: "",
    price: "",
    storage: ""
  });

  useEffect(() => {
    if (id) {
      axios.get(`/product/${id}`).then(({ data }) => {
        if(data) setProducts(data);
      });
    }
  }, [id]);

  useEffect(() => {
    axios.get("/storages").then(({ data }) => {
      if (data) setStorage(data);
    });

    axios.get("/raw-materials").then(({ data }) => {
      if (data) setRawData(data);
    });
  }, []);

  const addCategory = (e) => {
    e.preventDefault();
    setCat("");
    setProducts({
      ...products,
      category: [...products.category, cat]
    });
  }

  const removeCategory = (idx) => {
    const newCategory = [...products.category];
    newCategory.splice(idx, 1);
    setProducts((prev) => ({
      ...prev,
      category: newCategory
    }));
  }

  const removeRawMaterial = (idx) => {
    const newRawMaterialData = [...products.rawMaterial];
    newRawMaterialData.splice(idx, 1);
    setProducts((prev) => ({
      ...prev,
      rawMaterial: newRawMaterialData
    }));
  }
  
  const addRawMaterial = () => {
    if(rawMaterialData.item === ""){
      return toast.current.show({ severity: 'warn', summary: 'Adding Raw Material', detail: `Please select raw material.`, life: 3000 });
    }
    
    if(rawMaterialData.qty === 0 || rawMaterialData.qty === ""){  
      return toast.current.show({ severity: 'warn', summary: 'Adding Raw Material', detail: 'Qty should be greater than to one[1].', life: 3000 });
    }

    if(Number(rawMaterialData.qty) > rawMaterialData.inStock){
      return toast.current.show({ severity: 'warn', summary: 'Adding Raw Material', detail: `Qty should be less than to ${rawMaterialData.inStock}.`, life: 3000 });
    }

    setProducts((prev) => ({
      ...prev, 
      rawMaterial: [...prev.rawMaterial, rawMaterialData]
    }))
    
    setRawMaterialData({
      rawId: "",
      item: "",
      oum: "",
      qty: 0
    })
  }

  const selectRawMaterial = (e) => {
    const item = rawData.filter(({ _id }) => (_id === e.target.value));
    const id = item[0]?._id;
    const name = item[0]?.name;
    const maesurement = item[0]?.maesurement;
    const inStock = item[0]?.quantity;

    setRawMaterialData((prev) => ({
      ...prev,
      rawId: id,
      item: name,
      oum: maesurement,
      inStock: inStock
    }))
  }

  const inputForm = (e) => {
    setProducts({ ...products, [e.target.name]: e.target.value });
  };  

  const editProduct = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to edit this product info?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          products.name === "" ||
          products.maesurement === "" ||
          products.rawMaterial === "" ||
          products.storage === ""
        )
        return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });

        const { data } = await axios.put("/update_product", {
          ...products, id
        });
        if (data) {
          navigate(`/products/${data._id}`);
        } else {
          toast.current.show({ severity: 'warn', summary: 'Edit Message', detail: 'Failed to edit product info.', life: 3000 });
        }
      },
    });
  }

  const addNewProduct = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to add this product?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          products.name === "" ||
          products.maesurement === "" ||
          products.rawMaterial === "" ||
          products.storage === ""
        )
        return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });

        const { data } = await axios.post("/add_product", products);
        if (data) {
          navigate(`/products/${data._id}`);
        } else {
          return toast.current.show({ severity: 'error', summary: 'Form message', detail: 'Failed to add product information.', life: 3000 });
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
          {id ? "EDIT PRODUCT INFORMATION" : "ADD NEW PRODUCT"}
        </div>
        <button
          className="btn-outlined"
          onClick={id ? editProduct : addNewProduct}
        >
          {id ? "SAVE EDIT" : "SAVE"}
        </button>
      </div>
      <div className="px-8 py-12">
        <div className="text-sm grid gap-8">
          {id && (
            <div className="grid grid-cols-[200px_1fr] items-center">
              <span className="text-gray-500 font-semibold">
                RAW MATERIAL'S CODE
              </span>
              <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                {id.substring(0, 10)}
              </span>
            </div>
          )}
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
              ITEM'S NAME<span className="text-red-400">*</span>
            </span>
            <input
              onChange={inputForm}
              value={products.name}
              type="text"
              name="name"
              placeholder="Name"
            />
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <form className="grid grid-cols-[200px_1fr] items-center" onSubmit={addCategory}>
            <span className="text-gray-500 font-semibold self-baseline">CATEGORY</span>
            <div>
              <input
                onChange={(e) => setCat(e.target.value)}
                value={cat}
                type="text"
                name="category"
                placeholder="Category"
              />
                {
                  products.category.length > 0 &&
                  products?.category[0] !== "" &&
                  <div className="flex flex-wrap gap-2 mt-6">
                    {
                      products.category.map((cat, idx) => (
                        <div className="bg-dark text-lighter px-2 py-1 rounded-lg flex gap-1 items-center" key={idx}>
                          <span>{cat}</span>
                          <div className="cursor-pointer" onClick={() => removeCategory(idx)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                }
            </div>
          </form>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold self-baseline">
              RAW MATERIALS<span className="text-red-400">*</span>
            </span>
            <div className="grid gap-6">
              <div className="grid grid-cols-[1fr_50px_100px_20px] gap-10">
                <div className="grid gap-2">
                <span className="text-gray-500 font-semibold text-xs">RAW MATERIAL</span>
                <select name="rawMaterial" value={rawMaterialData.rawId} onChange={selectRawMaterial}>
                  <option value="">Select</option>
                  {
                    rawData &&
                    rawData.map(({ _id, name }) => (
                      <option value={_id} key={_id}>{name}</option>
                    ))
                  }
                </select>
                </div>
                <div className="grid gap-2  ">
                  <span className="text-gray-500 font-semibold text-xs">UOM</span>
                  <span className="text-gray-800 font-semibold text-xs">{rawMaterialData.oum ? rawMaterialData.oum : "--"}</span>
                </div>
                <div className="grid gap-2">
                  <span className="text-gray-500 font-semibold text-xs">QTY</span>
                  <input type="number" className="text-right" value={rawMaterialData.qty} onChange={(e) => setRawMaterialData((prev) => ({...prev, qty: e.target.value}))}/>
                </div>
                <div className="grid place-items-center">
                  <button className="bg-blue-400 text-white rounded p-1" onClick={addRawMaterial}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <div className="grid grid-cols-[1fr_50px_100px_40px] gap-10">
                    <span className="text-gray-500 font-semibold text-xs">RAW MATERIAL</span>
                    <span className="text-gray-500 font-semibold text-xs">UOM</span>
                    <span className="text-gray-500 font-semibold text-xs">QTY</span>
                  </div>
                </div>
                <div className="grid gap-2 bg-white border border-x-0 p-3">
                  {
                    products.rawMaterial.length > 0 ?
                    products.rawMaterial.map((raw, idx) => (
                      <div className="grid grid-cols-[1fr_50px_100px_20px] gap-10 py-2" key={idx}>
                        <span className="text-gray-500 text-xs">{raw.item}</span>
                        <span className="text-gray-800 text-xs">{raw.oum}</span>
                        <span className="text-gray-800 text-xs">{raw.qty}</span>
                        <button onClick={(e) => removeRawMaterial(idx)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )) :
                    <div>
                      <span>No selected material</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
              QUANTITY AND UNIT OF MAESUREMENT
            </span>
            <div className="grid grid-cols-2 gap-10">
              <div className="grid gap-1">
                <span className="text-gray-500 font-semibold text-xs">IN STOCK QTY (if available)</span>
                {
                  id ? 
                  <span className="text-gray-500 text-lg">{products.quantity}</span>  
                  :
                  <input
                    onChange={inputForm}
                    value={products.quantity}
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                  />
                }
              </div>
              <div className="grid gap-1">
                <span className="text-gray-500 font-semibold text-xs">UOM<span className="text-red-400">*</span></span>
                <input
                  onChange={inputForm}
                  value={products.maesurement}
                  type="text"
                  name="maesurement"
                  placeholder="e.g. (Packed)"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
              STORAGE<span className="text-red-400">*</span>
            </span>
            <select name="storage" value={products.storage._id ? products.storage._id : products.storage} onChange={inputForm}>
              <option value="">Select storage</option>
              {
                storage &&
                storage.map(({ name, _id }) => (
                  <option value={_id} key={_id}>{name}</option>
                ))
              }
            </select>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
             SELLING PRICE<span className="text-red-400">*</span>
            </span>
            <input
              onChange={inputForm}
              value={products.price}
              type="number"
              name="price"
              placeholder="Price"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormProduct;
