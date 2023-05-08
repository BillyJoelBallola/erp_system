import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import QrReader from "react-qr-scanner";
import axios from "axios";
import moment from "moment";

const AdjustmentModal = ({ visible, setVisible, setTableAction, data}) => {
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
        const { data } = await axios.post("/timeIn_attendance", { code });
        if(typeof data === "object"){
            toast.current.show({ severity: 'warn', summary: 'Attendance Message', detail: "Time-in is added", life: 3000 });
            setTableAction("timeIn");
        }else{
            toast.current.show({ severity: 'error', summary: 'Attendance Message', detail: "Failed to add time-in", life: 3000 });
        }
        setVisible(false);
        setScanQr({ result: "" });
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