import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup } from 'primereact/confirmpopup'; 
import { confirmPopup } from 'primereact/confirmpopup';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Supplier = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [supplierInfo, setSupplierInfo] = useState({});

  useEffect(() => {
    if(id){
      axios.get(`/supplier/${id}`).then(({ data }) => {
        if(data) setSupplierInfo(data);
      })
    }
  }, [id])

  const deleteSupplierInfo = (e, id) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Do you want to delete this supplier info?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
          try {
              await axios.delete(`/supplier/${id}`);
              toast.success("Successfully deleted", { position: toast.POSITION.TOP_RIGHT });
              setTimeout(() => {
                navigate("/suppliers");
              }, [800])
          } catch (error) {
              toast.error("Failed to delete.", { position: toast.POSITION.TOP_RIGHT });
          } 
      },
  });
  }

  return (
    <>
      <ToastContainer 
        draggable={false}
        hideProgressBar={true}
      />
      <ConfirmPopup />
      <div className="bg-gray-100 flex items-center justify-between px-4 py-3 border-b-[1px]">
        <div className="font-semibold text-blue-400 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            ></path>
          </svg>
          SUPPLIER INFORMATION
        </div>
        <div className="flex gap-2">
          <Link to={`/suppliers/form/${id}`} className="btn-outlined">EDIT</Link>
          <button className="btn-red" onClick={(e) => deleteSupplierInfo(e, id)}>DELETE</button>
        </div>
      </div>
      <div className="px-4 py-8 grid gap-6">
        <div className="grid gap-1 mb-4">
          <span className="text-gray-500 text-sm font-semibold">SUPPLIER CODE</span>
          <span className="text-xl text-blue-400 bg-gray-200 max-w-max px-2 rounded-md">#{supplierInfo._id ? supplierInfo._id.substring(0,10) : ""}</span>
        </div>
      <div className="grid grid-cols-[200px_1fr] items-center">
          <span className="text-gray-500 text-sm font-semibold">SUPPLIER'S NAME</span>
          <span className="text-lg text-blue-400">{supplierInfo.name && supplierInfo.name}</span>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-[200px_1fr] items-center">
          <span className="text-gray-500 text-sm font-semibold">BUSINESS</span>
          <span className="text-lg text-blue-400">{supplierInfo.business && supplierInfo.business}</span>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-[200px_1fr] items-center">
          <span className="text-gray-500 text-sm font-semibold">ADDRESS</span>
          <span>{supplierInfo.address && `${supplierInfo.address.street ?  supplierInfo.address.street + ", " : ""}${supplierInfo.address.barangay ?  supplierInfo.address.barangay + ", " : ""}${supplierInfo.address.city}, ${supplierInfo.address.province}, ${supplierInfo.address.country}`}</span>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-[200px_1fr] items-center">
          <span className="text-gray-500 text-sm font-semibold">CONTACT</span>
          <div className="grid grid-cols-[250px_250px]">
            <div className="grid gap-2">
              <span className="font-semibold text-gray-500 text-sm">PHONE NUMBER</span>
              <span>{supplierInfo.contact && supplierInfo.contact.phoneNumber}</span>
            </div>
            <div className="grid gap-2">
              <span className="font-semibold text-gray-500 text-sm">EMAIL ADDRESS</span>
              <span>{supplierInfo.contact && supplierInfo.contact.email ? supplierInfo.contact.email : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Supplier;
