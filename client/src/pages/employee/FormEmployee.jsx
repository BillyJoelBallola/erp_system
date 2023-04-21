import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { country } from "../../static/Country";
import QRCode from 'qrcode';
import axios from "axios";

import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const FormEmployee = () => {
  const toast = useRef();
  const navigate = useNavigate();
  const id = useParams().id;
  const [positions, setPositions] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
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
    position: "",
    qrCode: "",
    code: "",
  });

  useEffect(() => {
    if (id) {
      axios.get(`/employee/${id}`).then(({ data }) => {
        if(data) setEmployeeData(data);
      });
    }

    axios.get("/positions").then(({ data }) => {
        if(data) setPositions(data);
    })
  }, []);

  const inputAdress = (e) => {
    setEmployeeData({
      ...employeeData,
      address: { ...employeeData.address, [e.target.name]: e.target.value },
    });
  };

  const inputContact = (e) => {
    setEmployeeData({
      ...employeeData,
      contact: { ...employeeData.contact, [e.target.name]: e.target.value },
    });
  };

  const inputForm = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const editEmployeeInfo = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to edit this employee info?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          !employeeData.name ||
          !employeeData.dob ||
          !employeeData.age ||
          !employeeData.gender ||
          !employeeData.address.street ||
          !employeeData.address.barangay ||
          !employeeData.address.city ||
          !employeeData.address.province ||
          !employeeData.contact.phoneNumber ||
          !employeeData.position ||
          !employeeData.qrCode
        ){
          return toast.current.show({
            severity: "warn",
            summary: "Form message",
            detail: "Fill up all fields.",
            life: 3000,
          });
        }
        const res = await axios.put("/update_employee", { ...employeeData, id });
        const data = await res.data;

        if (data) {
          toast.current.show({
            severity: "info",
            summary: "Edit Message",
            detail: "Edited successfully.",
            life: 3000,
          });
          navigate(`/employees/${data._id}`);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Edit Message",
            detail: "Failed to edit employee info.",
            life: 3000,
          });
        }
      },
    });
  };

  const addNewEmployeeInfo = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Do you want to add this employee?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (
          !employeeData.name ||
          !employeeData.dob ||
          !employeeData.age ||
          !employeeData.gender ||
          !employeeData.address.street ||
          !employeeData.address.barangay ||
          !employeeData.address.city ||
          !employeeData.address.province ||
          !employeeData.contact.phoneNumber ||
          !employeeData.position ||
          !employeeData.qrCode
        )
          return toast.current.show({
            severity: "warn",
            summary: "Form message",
            detail: "Fill up all important fields.",
            life: 3000,
          });

        const { data } = await axios.post("/add_employee", employeeData);
        if (data) {
          navigate(`/employees/${data._id}`);
        } else {
            toast.current.show({
                severity: "warn",
                summary: "Form message",
                detail: "Failed to add new employee information.",
                life: 3000,
              });
        }
      },
    });
  };

  const generateQRCode = async () => {
    const { name } = employeeData;
    if(
      !employeeData.name ||
      !employeeData.dob ||
      !employeeData.age ||
      !employeeData.gender ||
      !employeeData.address.street ||
      !employeeData.address.barangay ||
      !employeeData.address.city ||
      !employeeData.address.province ||
      !employeeData.contact.phoneNumber ||
      !employeeData.position
    ){
        return toast.current.show({
            severity: "warn",
            summary: "Form message",
            detail: "Fill up all important fields.",
            life: 3000,
            });
    }
    const randomNum = Math.random();
    const code = `ERP-${randomNum.toString().substring(2, 15)}-${name.split(" ")[0]}`;
    try {
        const res = await QRCode.toDataURL(code);
        setEmployeeData((prev) => ({...prev, qrCode: res, code: code}));
    } catch (error) {
        return toast.current.show({
            severity: "warn",
            summary: "Form message",
            detail: "Fill up all important fields.",
            life: 3000,
            });
    }
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
          {id ? "EDIT EMPLOYEE INFORMATION" : "ADD NEW EMPLOYEE"}
        </div>
        <button
          className="btn-outlined"
          onClick={id ? editEmployeeInfo : addNewEmployeeInfo}
        >
          {id ? "SAVE EDIT" : "SAVE"}
        </button>
      </div>
      <div className="px-8 py-12">
        <form className="text-sm grid gap-8">
          {id && (
            <div className="grid grid-cols-[200px_1fr] items-center">
              <span className="text-gray-500 font-semibold">
                EMPLOYEE'S CODE
              </span>
              <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                {id.substring(0, 10)}
              </span>
            </div>
          )}
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold self-baseline">
              PERSONAL INFO<span className="text-red-400">*</span>
            </span>
            <div className="grid gap-10">
                <div className="grid gap-1">
                    <label className="text-gray-500 font-semibold text-xs">
                        FULL NAME
                    </label>
                    <input
                        onChange={inputForm}
                        value={employeeData.name}
                        type="text"
                        name="name"
                        placeholder="Full Name (Firstname Middle Initial Lastname)"
                    />
                </div>
                <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
                  <div className="grid gap-1">
                    <label className="text-gray-500 font-semibold text-xs">
                        DATE OF BIRTH
                    </label>
                    <input
                        onChange={inputForm}
                        value={employeeData.dob.toString().slice(0, 10)}
                        format="dd/MM/yyyy"
                        type="date"
                        name="dob"
                    />
                  </div>
                  <div className="grid lg:grid-cols-2 lg:gap-5 md:gap-10 md:grid-cols-1">
                    <div className="grid gap-1">
                        <label className="text-gray-500 font-semibold text-xs">
                            AGE
                        </label>
                        <input
                            onChange={inputForm}
                            value={employeeData.age}
                            type="number"
                            name="age"
                            placeholder="Age"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-gray-500 font-semibold text-xs">
                            GENDER
                        </label>
                        <select name="gender" onChange={inputForm} value={employeeData.gender}>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                  </div>
                </div>
            </div>
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
                    onChange={inputAdress}
                    value={employeeData.address.street}
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
                    onChange={inputAdress}
                    value={employeeData.address.barangay}
                    type="text"
                    name="barangay"
                    placeholder="Barangay"
                  />
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
                <div className="grid gap-1">
                  <label className="text-gray-500 font-semibold text-xs">
                    CITY / MUNICIPALITY
                  </label>
                  <input
                    onChange={inputAdress}
                    value={employeeData.address.city}
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
                    onChange={inputAdress}
                    value={employeeData.address.province}
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
                    onChange={inputAdress}
                    value={employeeData.address.country}
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
            <span className="text-gray-500 font-semibold">
              CONTACT<span className="text-red-400">*</span>
            </span>
            <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
              <div className="grid gap-1">
                <label className="text-gray-500 font-semibold text-xs">
                  PHONE NUMBER
                </label>
                <input
                  onChange={inputContact}
                  value={employeeData.contact.phoneNumber}
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
                  value={employeeData.contact.email}
                  type="text"
                  name="email"
                  placeholder="Email Address"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold">
              POSITION<span className="text-red-400">*</span>
            </span>
            <select name="position" onChange={inputForm} value={employeeData.position._id ? employeeData.position._id : employeeData.position}>
                <option value="">Select position</option>
                { 
                  positions && 
                  positions.map(({ name, _id }) => (
                      <option key={_id} value={_id}>{name}</option>
                  )) 
                }
            </select>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="grid grid-cols-[200px_1fr] items-center">
            <span className="text-gray-500 font-semibold self-baseline">
              QR CODE<span className="text-red-400">*</span>
            </span>
            <div className="grid lg:grid-cols-2 gap-10 md:grid-cols-1">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <span className="underline text-blue-400 cursor-pointer" onClick={generateQRCode}>Generate Employee's QR Code</span>
                    <span className="text-xs text-light">QR code will going to use for recording employee’s attendance time-in and time-out. Click the QR code to download.</span>
                </div>
                <div className="bg-gray-400 min-w-[100px] w-4/12 min-h-[100px] max-h-[100px] overflow-hidden rounded-md border border-gray-400">
                    {
                        employeeData.qrCode &&
                        <a href={employeeData.qrCode} download>
                            <img src={employeeData.qrCode} className="object-fit"/>
                        </a>
                    }
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormEmployee;
