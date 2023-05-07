import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { country } from "../../static/Country";
import axios from "axios";

import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const FormSupplier = () => {
  const toast = useRef(); 
  const navigate = useNavigate();
  const id = useParams().id;
  const [supplierData, setSupplierData] = useState({
    name: "",
    business: "",
    address: {
      street: "",
      barangay: "",
      city: "",
      province: "",
      country: "",
    },
    contact: {
      email: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (id) {
      axios.get(`/supplier/${id}`).then(({ data }) => {
        setSupplierData(data);
      });
    }
  }, [id]);

  const inputAddress = (e) => {
    setSupplierData({
      ...supplierData,
      address: { ...supplierData.address, [e.target.name]: e.target.value },
    });
  };
  const inputContact = (e) => {
    setSupplierData({
      ...supplierData,
      contact: { ...supplierData.contact, [e.target.name]: e.target.value },
    });
  };
  const inputForm = (e) => {
    setSupplierData({ ...supplierData, [e.target.name]: e.target.value });
  };

  const editSupplierInfo = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to edit this supplier info?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          supplierData.name === "" ||
          supplierData.business === "" ||
          supplierData.address.street === "" ||
          supplierData.address.barangay === "" ||
          supplierData.address.city === "" ||
          supplierData.address.province === "" ||
          supplierData.address.country === "" ||
          supplierData.contact.phoneNumber === ""
        )
          return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });

        const { data } = await axios.put("/update_supplier", {
          ...supplierData, id
        });
        if (data) {
          navigate(`/suppliers/${data._id}`);
          toast.current.show({ severity: 'info', summary: 'Edit Message', detail: 'Edited successfully.', life: 3000 });
        } else {
          toast.current.show({ severity: 'warn', summary: 'Edit Message', detail: 'Failed to edit supplier info.', life: 3000 });
        }
      },
    });
  }

  const addNewSupplierForm = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to add this supplier?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          supplierData.name === "" ||
          supplierData.business === "" ||
          supplierData.address.street === "" ||
          supplierData.address.barangay === "" ||
          supplierData.address.city === "" ||
          supplierData.address.country === "" ||
          supplierData.address.province === "" ||
          supplierData.contact.phoneNumber === ""
        )
        return toast.current.show({ severity: 'warn', summary: 'Form message', detail: 'Fill up all fields.', life: 3000 });
    
        const { data } = await axios.post("/add_supplier", supplierData);
        if (data) {
          navigate(`/suppliers/${data._id}`);
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
          {id ? "EDIT SUPPLIER INFORMATION" : "ADD NEW SUPPLIER"}
        </div>
        <button
          className="btn-outlined"
          onClick={id ? editSupplierInfo : addNewSupplierForm}
        >
          {id ? "SAVE EDIT" : "SAVE"}
        </button>
      </div>
      <div className="px-8 py-12">
        <form className="text-sm grid gap-8">
          {id && (
            <div className="grid gap-2 mb-2 items-center">
              <span className="text-gray-500 font-semibold">
                SUPPLIERS'S CODE
              </span>
              <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                #{id.substring(0, 10)}
              </span>
            </div>
          )}
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
              SUPPLIER'S NAME<span className="text-red-400">*</span>
            </span>
            <input
              onChange={inputForm}
              value={supplierData.name}
              type="text"
              name="name"
              placeholder="Name"
            />
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
              BUSINESS<span className="text-red-400">*</span>
            </span>
            <input
              onChange={inputForm}
              value={supplierData.business}
              type="text"
              name="business"
              placeholder="Business name"
            />
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold self-baseline">
              ADDRESS<span className="text-red-400">*</span>
            </span>
            <div className="grid grid-rows-2 gap-10">
              <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
                <div className="grid gap-1">
                  <label className="text-gray-500 font-semibold text-xs">
                    STREET
                  </label>
                  <input
                    onChange={inputAddress}
                    value={supplierData.address.street}
                    type="text"
                    name="street"
                    placeholder="Street name"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-gray-500 font-semibold text-xs">
                    BARANGAY
                  </label>
                  <input
                    onChange={inputAddress}
                    value={supplierData.address.barangay}
                    type="text"
                    name="barangay"
                    placeholder="Barangay"
                  />
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
                <div className="grid gap-1">
                  <label className="text-gray-500 font-semibold text-xs">
                    CITY / TOWN
                  </label>
                  <input
                    onChange={inputAddress}
                    value={supplierData.address.city}
                    type="text"
                    name="city"
                    placeholder="City or Municipality"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-gray-500 font-semibold text-xs">
                    PROVINCE
                  </label>
                  <input
                    onChange={inputAddress}
                    value={supplierData.address.province}
                    type="text"
                    name="province"
                    placeholder="Province"
                  />
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
                <div className="grid gap-1">
                  <label className="text-gray-500 font-semibold text-xs">
                    COUNTRY
                  </label>
                  <select
                    name="country"
                    onChange={inputAddress}
                    value={supplierData.address.country}
                  >
                    <option value="">Select Country</option>
                    {country &&
                      country.map((name, idx) => (
                        <option value={name} key={idx}>
                          {name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold self-baseline">
              CONTACT<span className="text-red-400">*</span>
            </span>
            <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
              <div className="grid gap-1">
                <label className="text-gray-500 font-semibold text-xs">
                  PHONE NUMBER
                </label>
                <input
                  onChange={inputContact}
                  value={supplierData.contact.phoneNumber}
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone No."
                />
              </div>
              <div className="grid gap-1">
                <label className="text-gray-500 font-semibold text-xs">
                  EMAIL (optional)
                </label>
                <input
                  onChange={inputContact}
                  value={supplierData.contact.email}
                  type="text"
                  name="email"
                  placeholder="Email Address"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormSupplier;
