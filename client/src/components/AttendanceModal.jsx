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

    const toastMsgBox = (severity, summary, detail ) => {
        return toast.current.show({ severity: severity, summary: summary, detail: detail, life: 3000 });
    }

    const addAttendance = async (code) => {
        if(code === undefined || code === null || code === "") return;
        const [date, time] = moment(Date.now()).format().split("T");

        let timeOut = false;
        let outAlready = false;
        let attedanceId = "";

        attendanceData.map(async (attendance) => {
            if(attendance.employee.code === code && attendance.timeIn.includes(date)){
                attedanceId = attendance._id
                timeOut = true;
            }
            
            if(attendance.employee.code === code && attendance.timeIn.includes(date) && attendance.timeOut !== null){
                outAlready = true;
            }
        })

        const { data } = await axios.get(`/qr_employee/${ code }`);
        if(data === null){
            setVisible(false);
            setScanQr({ result: "" });
            toastMsgBox("error", "Attendance", "Qr code not recognized.");
        }else{
            if(code && timeOut === false && !!outAlready === false){
                try {
                    await axios.post("/timeIn_attendance", { code });
                    setTableAction("timeIn");
                    setVisible(false);
                    setScanQr({ result: "" });
                    toastMsgBox("info", "Attendance", "Time-in is added.");
                } catch (error) {
                    setVisible(false);
                    setScanQr({ result: "" });
                    toastMsgBox("error", "Attendance", "Failed to add time-in");
                }
            }
    
            if(code && timeOut){
                try {
                    await axios.put("/timeOut_attendance", { id: attedanceId });
                    setTableAction("timeOut");
                    setVisible(false);
                    setScanQr({ result: "" });
                    toastMsgBox("info", "Attendance", "Time-out is added.");
                } catch (error) {
                    setVisible(false);
                    setScanQr({ result: "" });
                    toastMsgBox("error", "Attendance", "Failed to add time-out");
                }
            }
    
            if(code && outAlready){
                setVisible(false);
                setScanQr({ result: "" });
                toastMsgBox("warn", "Attendance", "Employee is already out.");
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
                        {
                            scanQr.result && 
                            <span className="grid mt-4 py-1 word-wrap rounded-md bg-gray-300 text-center">{scanQr.result.text}</span>
                        }
                </Dialog>
            </div>
        </>
    );
};

export default AdjustmentModal;