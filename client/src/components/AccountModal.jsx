import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { toast } from "react-toastify";

const AccountModal = ({ visible, setVisible, action, setAction, account, handleEditInfo, handleEditPassword }) => {
    const [password, setPassword] = useState("");
    const { _id } = account;

    const verifyUser = async (e) => {
        e.preventDefault();
        if(password === ""){
            setVisible(false);
            return toast.warn("Fill up the text field.", { position: toast.POSITION.TOP_RIGHT });
        }
        const { data } = await axios.post("/verify_user", { _id, password });
        
        if(typeof data === "object"){
            setVisible(false);
            setPassword("");
            if(action === "editInfo"){
                handleEditInfo();
            }else{
                handleEditPassword();
            }
        }else{
            setVisible(false);
            setPassword("");
            return toast.error("Incorrect password", { position: toast.POSITION.TOP_RIGHT });
        }
    }   

    return (
        <div className="card flex justify-content-center">
            <Dialog 
                header="VERIFICATION" 
                visible={visible} 
                className="w-11/12 md:w-1/2 lg:w-1/3" 
                onHide={() => {
                    setVisible(false);
                    setAction("");
                }}
                draggable={false}>
                    <form className="grid gap-5" onSubmit={verifyUser}>
                        <div className="form-group">
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <p className="text-sm mt-2">Enter your current password to verify and continue the process.</p>
                        </div>
                        <button className="btn-dark">SUBMIT</button>
                    </form>
            </Dialog>
        </div>
    );
};

export default AccountModal;
