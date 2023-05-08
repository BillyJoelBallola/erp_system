import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import QrReader from "react-qr-scanner";
import axios from "axios";
import moment from "moment";

const AdjustmentModal = ({ visible, setVisible, setTableAction, attendanceData}) => {
    const toast = useRef(null); 
    const [scanQr, setScanQr] = useState({
        delay: 100,
        result: ""
    });

    const handleScan = async (data) => {
        if(scanQr.result === "" || scanQr.result === null){
            setScanQr({result: await data });
        }
    }

    const handleError = (err) => {
        return toast.current.show({ severity: 'warn', summary: 'QR Scanner', detail: err, life: 3000 });
    }

    useEffect(() => {
        if(scanQr.result !== "" || scanQr.result !== null){
            addAttendance(scanQr.result && scanQr.result.text);
        }
    }, [scanQr.result]);

    const addAttendance = async (code) => {
        if(code === undefined || code === null || code === "") return;
        const [date, time] = moment(Date.now()).format().split("T");

        if(attendanceData !== null && attendanceData.length > 0){
            attendanceData.map(async (attendance) => {
                if(attendance.employee.code === code && attendance.timeIn.includes(date) && attendance.timeOut === null){
                    const { data } = await axios.put("/timeOut_attendance", { id: attendance._id });
                    if(typeof data === "object"){
                        setTableAction("timeOut");
                        setVisible(false);
                        setScanQr({ result: "" });
                        return toast.current.show({ severity: 'info', summary: 'Attendance Message', detail: "Time-out is added", life: 3000 });
                    }else{
                        setVisible(false);
                        setScanQr({ result: "" });
                        return toast.current.show({ severity: 'error', summary: 'Attendance Message', detail: "Failed to add time-out", life: 3000 });
                    }
                }

                if(attendance.timeIn.includes(date)){
                    setVisible(false);
                    setScanQr({ result: "" });
                    return toast.current.show({ severity: 'warn', summary: 'Attendance Message', detail: "Employee is already out.", life: 3000 });
                }
            })
        }else{
            const { data } = await axios.post("/timeIn_attendance", { code });

            if(typeof data === "object"){
                setTableAction("timeIn");
                setVisible(false);
                setScanQr({ result: "" });
                return toast.current.show({ severity: 'info', summary: 'Attendance Message', detail: "Time-in is added", life: 3000 });
            }else{
                setVisible(false);
                setScanQr({ result: "" });
                return toast.current.show({ severity: 'error', summary: 'Attendance Message', detail: "Failed to add time-in", life: 3000 });
            }
        }
    }
    
    return (
        <>
            <Toast ref={toast}/>
            <div className="card flex justify-content-center">
                <Dialog header="QR SCANNER" 
                    visible={visible} 
                    className="w-11/12 md:w-2/3 lg:w-auto" 
                    onHide={() => {
                        setVisible(false);
                        setScanQr({ result: "" });
                    }}
                    draggable={false}>
                        <div className="w-full lg:w-[350px] rounded-md overflow-hidden border border-gray-200">
                            <QrReader
                                className="object-contain"
                                delay={scanQr.delay}
                                onError={handleError}
                                onScan={handleScan}
                            />
                        </div>
                </Dialog>
            </div>
        </>
    );
};

export default AdjustmentModal;