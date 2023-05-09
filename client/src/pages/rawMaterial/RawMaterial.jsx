import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ConfirmPopup } from 'primereact/confirmpopup'; 
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 
import axios from "axios";

const RawMaterial = () => {
  const toast = useRef();
  const navigate = useNavigate();
  const id = useParams().id;
  const [rawMaterialInfo, setRawMaterialInfo] = useState({});

  useEffect(() => {
    if(id){
      axios.get(`/raw-material/${id}`).then(({ data }) => {
        if(data) setRawMaterialInfo(data);
      })
    }
  }, [id]);

  const deleteRawMaterialInfo = (e, id) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Do you want to delete this raw material info?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
          try {
              await axios.delete(`/raw-material/${id}`);
              toast.current.show({ severity: 'info', summary: 'Delete', detail: 'Successfully deleted', life: 3000 });
              setTimeout(() => {
                navigate("/raw-materials");
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
          </svg>
          RAW MATERIAL INFORMATION
        </div>
        <div className="flex gap-2">
          <Link to={`/raw-materials/form/${id}`} className="btn-outlined">EDIT</Link>
          <button className="btn-red" onClick={(e) => deleteRawMaterialInfo(e, id)}>DELETE</button>
        </div>
      </div>
      <div className="px-4 py-8 grid gap-6">
        <div className="grid gap-2 mb-6">
          <span className="text-3xl text-gray-600">{rawMaterialInfo.name && rawMaterialInfo.name}</span>
          <span className="text-xl text-blue-400 bg-gray-200 max-w-max px-2 rounded-md">#{rawMaterialInfo._id ? rawMaterialInfo._id.substring(0,10) : ""}</span>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-[250px_1fr] items-center">
            <span className="text-gray-500 text-sm font-semibold">CATEGORY</span>
            <div className="text-lg">
              {
                rawMaterialInfo.category &&
                rawMaterialInfo.category[0] !== "" &&
                rawMaterialInfo.category.length > 0 ?
                <div className="flex flex-wrap gap-2">
                  {
                    rawMaterialInfo.category.map((cat, idx) => (
                      <div className="bg-dark text-lighter px-2 rounded-lg items-center" key={idx}>
                        <span className="text-sm">{cat}</span>
                      </div> 
                    ))
                  }
                </div>
                : 
                <span>N/A</span>
              }
              </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[250px_1fr] items-center">
            <span className="text-gray-500 text-sm font-semibold">STORAGE LOCATION</span>
            <span className="text-lg">{rawMaterialInfo.storage && rawMaterialInfo.storage.name}</span>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[250px_1fr] items-center">
            <span className="text-gray-500 text-sm font-semibold">IN STOCK QUANTITY</span>
            <span className="text-lg">{rawMaterialInfo.quantity && rawMaterialInfo.maesurement ? `${rawMaterialInfo.quantity} ${rawMaterialInfo.maesurement}` : "N/A"}</span>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
        </div>
      </div>
    </>
  );
};

export default RawMaterial;
