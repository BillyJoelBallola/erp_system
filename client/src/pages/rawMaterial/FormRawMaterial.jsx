import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { ToastContainer, toast } from "react-toastify";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const FormRawMaterial = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [cat, setCat] = useState("");
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
    axios.get("/storages").then(({ data }) => {
      if (data) setStorage(data);
    });
  }, []);

  const addCategory = (e) => {
    e.preventDefault();
    if(cat === "") return;
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
        ){
          return toast.warning("Fill up all fields.", { position: toast.POSITION.TOP_RIGHT });
        }

        const { data } = await axios.put("/update_raw-material", {
          ...rawMaterialInfo, id
        });
        if (data) {
          navigate(`/raw-materials/${data._id}`);
        } else {
          return toast.error("Failed to edit raw-material info.", { position: toast.POSITION.TOP_RIGHT });
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
        ){
          return toast.warning("Fill up all fields.", { position: toast.POSITION.TOP_RIGHT });
        }

        const { data } = await axios.post("/add_raw-material", rawMaterialInfo);
        if (data) {
          navigate(`/raw-materials/${data._id}`);
        } else {
          return toast.error("Failed to add raw-material info.", { position: toast.POSITION.TOP_RIGHT });
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
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
                  rawMaterialInfo?.category[0] !== "" &&
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
