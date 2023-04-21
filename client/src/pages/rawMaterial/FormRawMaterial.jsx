import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const FormRawMaterial = () => {
  const toast = useRef(); 
  const navigate = useNavigate();
  const id = useParams().id;
  const [cat, setCat] = useState("");
  const [supplier, setSupplier] = useState();
  const [storage, setStorage] = useState();
  const [rawMaterialInfo, setRawMaterialInfo] = useState({
    name: "",
    maesurement: "",
    category: "",
    quantity: "",
    storage: ""
  });

  useEffect(() => {
    if (id) {
      axios.get(`/raw-material/${id}`).then(({ data }) => {
        if(data) setRawMaterialInfo(data);
      });
    }
  }, [id]);

  useEffect(() => {
    axios.get("/suppliers").then(({ data }) => {
      if (data) setSupplier(data);
    });

    axios.get("/storages").then(({ data }) => {
      if (data) setStorage(data);
    });
  }, []);

  const addCategory = (e) => {
    e.preventDefault();
    setCat("");
    setRawMaterialInfo({
      ...rawMaterialInfo,
      category: [...rawMaterialInfo.category, cat]
    });
  }

  const removeCategory = (idx) => {
    const newCategory = [...rawMaterialInfo.category];
    newCategory.splice(idx, 1);
    setRawMaterialInfo({
      ...rawMaterialInfo,
      category: newCategory
    });
  }

  const inputForm = (e) => {
    setRawMaterialInfo({ ...rawMaterialInfo, [e.target.name]: e.target.value });
  };

  const editRawMaterialInfo = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to edit this raw material info?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          rawMaterialInfo.name === "" ||
          rawMaterialInfo.maesurement === "" ||
          rawMaterialInfo.quantity === "" ||
          rawMaterialInfo.storage === ""
        )
        return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });

        const { data } = await axios.put("/update_raw-material", {
          ...rawMaterialInfo, id
        });
        if (data) {
          navigate(`/raw-materials/${data._id}`);
          toast.current.show({ severity: 'info', summary: 'Edit Message', detail: 'Edited successfully.', life: 3000 });
        } else {
          toast.current.show({ severity: 'warn', summary: 'Edit Message', detail: 'Failed to edit raw material info.', life: 3000 });
        }
      },
    });
  }

  const addNewRawMaterialInfo = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to add this raw material?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          rawMaterialInfo.name === "" ||
          rawMaterialInfo.maesurement === "" ||
          rawMaterialInfo.quantity === "" ||
          rawMaterialInfo.storage === ""
        )
        return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });

        const { data } = await axios.post("/add_raw-material", rawMaterialInfo);
        if (data) {
          navigate(`/raw-materials/${data._id}`);
        } else {
          alert("Failed to add new supplier information.");
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
          {id ? "EDIT RAW MATERIAL INFORMATION" : "ADD NEW RAW MATERIAL"}
        </div>
        <button
          className="btn-outlined"
          onClick={id ? editRawMaterialInfo : addNewRawMaterialInfo}
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
              value={rawMaterialInfo.name}
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
                  rawMaterialInfo.category.length > 0 &&
                  <div className="flex flex-wrap gap-2 mt-6">
                    {
                      rawMaterialInfo.category.map((cat, idx) => (
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
            <span className="text-gray-500 font-semibold">
              QUANTITY AND UNIT OF MAESUREMENT<span className="text-red-400">*</span>
            </span>
            <div className="grid grid-cols-2 gap-10">
              <div className="grid gap-1">
                <span className="text-gray-500 font-semibold text-xs">QTY</span>
                {
                  id ? 
                  <span className="text-gray-500 text-lg">{rawMaterialInfo.quantity}</span>  
                  :
                  <input
                  onChange={inputForm}
                  value={rawMaterialInfo.quantity}
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  />
                }
              </div>
              <div className="grid gap-1">
                <span className="text-gray-500 font-semibold text-xs">UOM</span>
                <input
                  onChange={inputForm}
                  value={rawMaterialInfo.maesurement}
                  type="text"
                  name="maesurement"
                  placeholder="e.g. (kg)"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
              STORAGE<span className="text-red-400">*</span>
            </span>
            <select name="storage" value={rawMaterialInfo.storage._id ? rawMaterialInfo.storage._id : rawMaterialInfo.storage} onChange={inputForm}>
              <option value="">Select storage</option>
              {
                storage &&
                storage.map(({ name, _id }) => (
                  <option value={_id} key={_id}>{name}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormRawMaterial;
