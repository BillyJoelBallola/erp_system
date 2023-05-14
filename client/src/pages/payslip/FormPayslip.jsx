import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const FormPayslip = () => {
    const navigate = useNavigate();
    const id = useParams().id;
    // const [payslip, setPayslip] = useState({});
    const [positions, setPositions] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [filteredEmployee, setFilteredEmployee] = useState([]);
    const [payslipInfo, setPayslipInfo] = useState({
        position: "",
        employee: "",
        monthYear: "",
        earning: "",
    })
    const [totals, setTotals] = useState({
        length: 0,
        gross: 0,
        deduction: 0,
        netPay: 0,
    });

    const selectPosition = (e) => {
        const posId = e.target.value;
        const matchPosition = employee.filter((employee) => ( employee.position._id === posId ));
        setFilteredEmployee(matchPosition);

        setPayslipInfo((prev) => ({
            ...prev,
            position: posId,
            employee: "",
            earning: ""
        }));

        setTotals({
            length: 0,
            gross: 0,
            deduction: 0,
            netPay: 0,
        })

    };

    const selectEmployee = (e) => {
        const employeeId = e.target.value;
        setPayslipInfo((prev) => ({
            ...prev,
            employee: employeeId
        }));
    }

    const editPayslip = (e) => {
        let isFactoryWorker = false;
        if(payslipInfo.earning !== null){
            isFactoryWorker = true;
        }
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to edit this payslip?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                if (
                    payslipInfo.position === "" ||
                    payslipInfo.employee === "" ||
                    payslipInfo.monthYear === "" || 
                    isFactoryWorker && payslipInfo.earning === ""
                )
                    return toast.warn("Fill up all fields.", { position: toast.POSITION.TOP_RIGHT });
                    const { earning, monthYear } = payslipInfo;
                    const { gross, deduction, netPay } = totals;
                    const { data } = await axios.put("/update_payslip", { id, earning, monthYear, gross, deduction, netPay});
                if (data) {
                    navigate("/payslips");
                } else {
                    return toast.error("Failed to edit payslip.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        });
    };

    const addNewPayslip = (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: "Do you want to add this payslip?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                if (
                    payslipInfo.position === "" ||
                    payslipInfo.employee === "" ||
                    payslipInfo.monthYear === "" 
                )
                    return toast.warn("Fill up all fields.", { position: toast.POSITION.TOP_RIGHT });
                    const { gross, deduction, netPay } = totals;
                    const { employee, monthYear, earning } = payslipInfo;
                    const { data } = await axios.post("/add_payslip", { employee, monthYear, earning, gross, deduction, netPay });
                if (data) {
                    navigate("/payslips");
                } else {
                    return toast.error("Failed to add payslip.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        });
    };

    useEffect(() => {
        if(id){
            axios.get(`/payslip/${id}`).then(({ data }) => {
                setPayslipInfo(data);
                setFilteredEmployee([data]);
            });
        }
    }, [id])

    useEffect(() => {
        axios.get("/positions").then(({ data }) => {
            setPositions(data);
        });

        axios.get("/employees").then(({ data }) => {
            setEmployee(data);
        });
    }, []);

    useEffect(() => {
        const getNetPayOfFactoryWorker = () => {
            if(payslipInfo.earning !== null || payslipInfo.earning !== ""){
                const netPay = Number(payslipInfo.earning) - totals.deduction;
                setTotals((prev) => ({
                    ...prev,
                    gross: Number(payslipInfo.earning),
                    netPay: netPay
                })) 
            }
        }
        getNetPayOfFactoryWorker();
    }, [payslipInfo.earning])


    useEffect(() => {
        const getNetPay = () => {
            if(totals.length >= 0){
                employee.filter((employee) => {
                    if(employee._id === payslipInfo.employee){
                        const gross = totals.length * Number(employee.salary);
                        const netPay = gross - totals.deduction;
                        setTotals((prev) => ({
                            ...prev,
                            gross: gross,
                            netPay: netPay
                        }))
                    }
                })

                if(typeof payslipInfo.employee === "object"){
                    const gross = totals.length * Number(payslipInfo.employee.salary);
                    const netPay = gross - totals.deduction;
                    setTotals((prev) => ({
                        ...prev,
                        gross: gross,
                        netPay: netPay
                    }))
                }
            }
        }
        getNetPay();
    }, [totals.length])

    useEffect(() => {
        const getTotalDeduction = () => {
            let deductionTotal = 0;
    
            if(filteredEmployee.length < 0) return; 
            filteredEmployee.map((filtered) => {
                if(filtered._id === payslipInfo.employee){
                    filtered.deductions.map((deduction) => {
                        deductionTotal += Number(deduction.amount);
                        setTotals((prev) => ({
                            ...prev,
                            deduction: deductionTotal
                        }));
                    })
                }

                if(typeof payslipInfo.employee === "object"){
                    filtered.employee.deductions.map((deduction) => {
                        deductionTotal += Number(deduction.amount);
                        setTotals((prev) => ({
                            ...prev,
                            deduction: deductionTotal
                        }));
                    })
                }
            })
    
            if(payslipInfo.position === ""|| payslipInfo.employee === ""){
                setTotals((prev) => ({
                    ...prev,
                    deduction: 0
                }));
            }
        }
        getTotalDeduction();
    }, [payslipInfo.employee, payslipInfo.position])

    const fetchAttendance = (id) => {
        axios.get(`/date_id_attendance/${id}`).then(({ data }) => { 
            setAttendance(data);
        });
    }

    useEffect(() => {
        const getNumberOfAttendance = () => {
            const [date, time] = payslipInfo.monthYear.split("T");
            const [year, month] = date.split("-");
            if(attendance.length > 0){
                const attLength = attendance.filter((att) => {
                    if(att.timeOut !== null){
                        return att.timeOut.includes(`${year}-${month}`);
                    }
                }).length;
                setTotals((prev) => ({
                    ...prev,
                    length: attLength
                }))
            }
        }
        getNumberOfAttendance();
    }, [attendance, payslipInfo.monthYear])

    useEffect(() => {
        const getAttendanceOfSelectedEmployee = () => {
            if(payslipInfo.employee === "" || payslipInfo.monthYear === "") return;
            positions.map((position) => {
                if(position._id === payslipInfo.position){
                    if(position.name !== "Factory worker"){
                        employee.map((emp) => {
                            if(emp._id === payslipInfo.employee){
                                fetchAttendance(emp._id);
                            }
                        })
                    }
                }
            })

            if(typeof payslipInfo.employee === "object" && id){
                filteredEmployee.map((emp) => {
                    positions.map((position) => {
                        if(position._id === payslipInfo.employee.position){
                            if(position.name !== "Factory worker"){
                                fetchAttendance(emp.employee._id);
                            }
                        }

                    })
                })
            }
        }
        getAttendanceOfSelectedEmployee();
    }, [payslipInfo.monthYear])

    const handelMonthYear = (e) => {
        if(payslipInfo.position === "" || payslipInfo.employee=== ""){
            return toast.warn("Select position and employee first.", { position: toast.POSITION.TOP_RIGHT })
        }

        setPayslipInfo((prev) => ({
            ...prev, 
            monthYear: e.target.value
        }))
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {id ? "EDIT SALES PAYSLIP INFORMATION" : "ADD NEW PAYSLIP"}
                </div>
                <button
                    className="btn-outlined"
                    onClick={id ? editPayslip : addNewPayslip}
                >
                    {id ? "SAVE EDIT" : "SAVE"}
                </button>
            </div>
            <div className="px-8 py-12">
                {id && (
                    <div className="text-sm mb-10 grid grid-cols-[200px_200px_200px]">
                        <div className="grid gap-2 items-center">
                            <span className="text-gray-500 font-semibold">
                                PAYLSLIP'S CODE
                            </span>
                            <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                                #{id.substring(0, 10)}
                            </span>
                        </div>
                        <div className="grid gap-2 items-center">
                            <span className="text-gray-500 font-semibold">
                                PAYMENT
                            </span>
                            <span className="text-xl text-blue-400 bg-gray-200 p-1 px-2 rounded-md max-w-max">
                                {payslipInfo.payment}
                            </span>
                        </div>
                    </div>
                )}
                <div className="grid gap-8">
                    <div className="grid grid-cols-[200px_1fr] items-center">
                        <span className="text-gray-500 font-semibold self-baseline">
                            EMPLOYEE INFO<span className="text-red-400">*</span>
                        </span>
                        <div className="grid grid-cols-2 gap-10">
                            <div className="grid gap-1">
                                <span className="text-gray-500 font-semibold text-xs">
                                    POSITION
                                </span>
                                <select name="position" value={id ? payslipInfo.employee.position : payslipInfo.position} onChange={selectPosition} disabled={id ? true : false}>
                                    <option value="">Select position</option>
                                    {
                                        positions.length > 0 &&
                                        positions.map((position) => (
                                            <option value={position._id} key={position._id}>{position.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="grid gap-1">
                                <span className="text-gray-500 font-semibold text-xs">
                                    EMPLOYEE NAME
                                </span>
                                <select name="employee" value={id ? payslipInfo.employee._id : payslipInfo.employee} onChange={selectEmployee} disabled={id ? true : false}>
                                    <option value="">Select employee</option>
                                    {
                                        filteredEmployee.length > 0 &&
                                        filteredEmployee.map((filtered) => (
                                            (typeof filtered.employee) !== "object" ? 
                                            <option value={filtered._id} key={filtered._id}>{filtered.name}</option>
                                            :
                                            <option value={filtered.employee._id} key={filtered._id}>{filtered.employee.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                       
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-gray-200"></div>
                    <div className="grid grid-cols-[200px_1fr] items-center">
                        <span className="text-gray-500 font-semibold self-baseline">
                           SALARY INFO<span className="text-red-400">*</span>
                        </span>
                        <div className="grid gap-8">
                            <div className="grid grid-cols-2 gap-10">
                                <div className="grid grid-row-2 gap-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 font-semibold text-xs">
                                            MONTH - YEAR
                                        </span>
                                        <input 
                                            type="month" 
                                            name="monthYear" 
                                            value={payslipInfo.monthYear.toString().slice(0, 7)} 
                                            onChange={handelMonthYear}/>
                                        {
                                            totals.length > 0 && payslipInfo.monthYear &&
                                            <span className="text-gray-500 text-sm mt-1">Number of present day/s: {totals.length}</span>
                                        }
                                    </div>
                                    {   
                                        id ?
                                        positions && 
                                        positions.map((position) => (
                                            position._id === payslipInfo.employee.position &&
                                            payslipInfo.earning !== null &&
                                            <div className="flex flex-col gap-1" key={position._id}>
                                                <span className="text-gray-500 font-semibold text-xs">
                                                    EARNING AMOUNT
                                                </span>
                                                <input type="number" name="earning" value={payslipInfo.earning} onChange={(e) => setPayslipInfo((prev) => ({...prev, earning: e.target.value}))}/>
                                            </div>
                                        ))
                                        :
                                        positions && 
                                        positions.map((position) => (
                                            position._id === payslipInfo.position &&
                                            position.name === "Factory worker" &&
                                            <div className="flex flex-col gap-1" key={position._id}>
                                                <span className="text-gray-500 font-semibold text-xs">
                                                    EARNING AMOUNT
                                                </span>
                                                <input type="number" name="earning" value={payslipInfo.earning} onChange={(e) => setPayslipInfo((prev) => ({...prev, earning: e.target.value}))}/>
                                            </div>
                                        ))
                                    }
                                    {
                                        id && 
                                        filteredEmployee.length > 0 ?
                                        filteredEmployee.map((filtered) => (
                                            filtered.employee.salary !== "" &&
                                            <div className="flex flex-col gap-1" key={filtered._id}>
                                                <span className="text-gray-500 font-semibold text-xs">
                                                    BASIC SALARY
                                                </span>
                                                <span>{filtered.employee.salary}</span>
                                            </div>
                                        ))
                                        :
                                         filteredEmployee.length > 0 ?
                                         filteredEmployee.map((filtered) => (
                                            filtered._id === payslipInfo.employee &&
                                            filtered.salary &&
                                                <div className="flex flex-col gap-1" key={filtered._id}>
                                                    <span className="text-gray-500 font-semibold text-xs">
                                                        BASIC SALARY
                                                    </span>
                                                    <span>{filtered.salary}</span>
                                                </div>
                                        )) : 
                                        <></>
                                    }
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 font-semibold text-xs">DEDUCTIONS</span>
                                
                                    <div className="bg-white border-y-gray-300 border grid gap-2 py-2 px-4">
                                        {   
                                            filteredEmployee.length > 0 ?
                                            filteredEmployee.map((filtered) => (
                                                filtered._id === payslipInfo.employee ?
                                                filtered.deductions.map((deduction) => (
                                                    <div className="flex items-center justify-between" key={deduction._id}>
                                                        <span>{deduction.name}</span>
                                                        <span>{deduction.amount}</span>
                                                    </div>
                                                )) :
                                                (typeof filtered.employee) === "object" ?
                                                filtered.employee.deductions.map((deduction) => (
                                                    <div className="flex items-center justify-between" key={deduction._id}>
                                                        <span>{deduction.name}</span>
                                                        <span>{deduction.amount}</span>
                                                    </div>
                                                )) :
                                                <span key={filtered._id}>No deduction.</span>
                                            )) :
                                            <span>No deduction.</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end px-6 py-4 bg-gray-200 border border-x-0 border-y-gray-300">
                                <div className="w-[300px]">
                                    <div className="text-sm flex justify-between">
                                        <span>GROSS</span>
                                        <span>
                                            {totals.gross.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-sm flex justify-between">
                                        <span>DEDUCTIONS</span>
                                        <span>
                                            {totals.deduction.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold flex justify-between">
                                        <span>NET PAY</span>
                                        <span>
                                            {totals.netPay.toFixed(2)}
                                        </span>
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

export default FormPayslip;
