import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from 'react-toastify';
import axios from "axios";

const AdjustmentModal = ({ visible, setVisible, action, setAction, id, setAdjustmentId, setTableAction}) => {
    const [storages, setStorage] = useState([]);
    const [products, setProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [filteredItem, setFilteredItem] = useState([]);
    const [adjustment, setAdjustment] = useState({
        remarks: "",
        item: {
            itemId: "",
            name: "",
            uom: "",
            oldQty: "",
            newQty: "",
            storage: ""
        }
    });

    useEffect(() => {
        axios.get("/storages")
            .then(({ data }) => {
                setStorage(data);
            })

        axios.get("/products")
            .then(({ data }) => {
                setProducts(data);
            })

        axios.get("/raw-materials")
            .then(({ data }) => {
                setRawMaterials(data);
            })
    }, []);

    useEffect(() => {
        if(action === "edit" || id){
            axios.get(`/adjustment/${id}`)
                .then(({ data }) => {
                    setAdjustment(data);
                })
        }
    }, [action, id])
    
    const toastMsgBox = (severity, detail ) => {
        switch(severity){
            case "info":
                toast.info(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            case "success":
                toast.success(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            case "warning":
                toast.warning(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            case "error":
                toast.error(detail, { position: toast.POSITION.TOP_RIGHT });
                break;
            default:
                break;
        }
    }   


    const selectStorage = (e) => {
        const storageId = e.target.value;

        setAdjustment((prev) => ({
            ...prev,
            item: {
                ...prev.item,
                storage: storageId
            }
        }))

        const filteredProducts = products.filter((product) => (product.storage._id === storageId));
        const filteredRawMaterials = rawMaterials.filter((raw) => (raw.storage._id === storageId));

        if(filteredProducts.length > 0 && filteredRawMaterials.length > 0){
            setFilteredItem([...filteredProducts, ...filteredRawMaterials]);
        }

        setFilteredItem(filteredProducts.length > 0 ? filteredProducts : filteredRawMaterials);
    }

    const resetAdjustment = () => {
        setAdjustment({
            remarks: "",
            item: {
                itemId: "",
                name: "",
                uom: "",
                oldQty: "",
                newQty: "",
                storage: ""
            }
        })
    }

    const selectItem = (e) => {
        const itemId = e.target.value;

        if(itemId === ""){         
            resetAdjustment();
        }

        const selectedItem = filteredItem.filter((item) => (item._id === itemId));
        const id = selectedItem[0]?._id;
        const name = selectedItem[0]?.name;
        const uom = selectedItem[0]?.maesurement;
        const oldQty = selectedItem[0]?.quantity;

        setAdjustment((prev) => ({
            ...prev,
            item: {
                ...prev.item,
                itemId: id,
                name: name,
                uom: uom,
                oldQty: oldQty
            }
        }))
    }

    const saveAdjustment = async (e) => {
        e.preventDefault();
        if(
            adjustment.remarks === "" ||
            adjustment.item.itemId === "" ||
            adjustment.item.newQty === "" 
        ){
            return toastMsgBox("warning", "Fill up all fields.");
        }

        const { data } = await axios.post("/add_adjustment", adjustment);
        if(data){
            toastMsgBox("success", "Adjustment successfully saved.");
            setVisible(false);
            setAdjustment({
                remarks: "",
                item: {
                    itemId: "",
                    name: "",
                    uom: "",
                    oldQty: "",
                    newQty: "",
                    storage: ""
                }
            })
            setTableAction("saved");
        }else{
            toastMsgBox("error", "Failed to save adjustment info.");
            resetAdjustment();
            setFilteredItem([]);
        }
    }

    const updateAdjustment = async (e) => {
        e.preventDefault();
        if(
            adjustment.remarks === "" ||
            adjustment.item.itemId === "" ||
            adjustment.item.newQty === "" 
        ){
           
            return toastMsgBox("warn", "Fill up all fields.");
        }

        const { data } = await axios.post("/update_adjustment", adjustment);
        if(data){
            toastMsgBox("success", "Adjustment successfully edited.");
            setVisible(false);
            setTimeout(() => {
                setTableAction("edited");
            }, [800]);
        }else{
            toastMsgBox("error", "Failed to edit adjustment info.");
            resetAdjustment();
            setFilteredItem([]);
        }
    }
    
    const getSelectedStorage = (storageId) => {
        const selected = storages.filter((storage) => (storage._id === storageId));
        return selected[0]?.name;
    }

    return (
        <>
            <div className="card flex justify-content-center">
                <Dialog header="ADJUSTMENT" 
                    visible={visible} 
                    className="w-11/12 md:w-2/3 lg:w-1/2" 
                    onHide={() => {
                        setVisible(false);
                        resetAdjustment();
                        setAdjustmentId("");
                        setAction("");
                    }}
                    draggable={false}>
                    <form className="grid gap-5">
                        {
                            action === "view" && adjustment._id &&
                            <div className="grid gap-1">
                                <span className="text-gray-500 text-sm font-semibold self-baseline">ADJUSTMENT CODE</span>
                                <span className="text-blue-400 text-lg">
                                    #{adjustment._id.substring(0, 10)}
                                </span>
                            </div>
                        }
                        <div className="grid grid-cols-2 gap-5 mb-2">
                            <div className="grid gap-1">
                                <span className="text-gray-500 text-sm font-semibold self-baseline">
                                    STORAGE<span className="text-red-400">*</span>
                                </span>
                                {  
                                    action === "view" ?
                                    <span className="text-lg">
                                        {
                                            adjustment && 
                                            getSelectedStorage(adjustment.item.storage)
                                        }
                                    </span>
                                    :
                                    <select name="storage" value={adjustment.item.storage} onChange={selectStorage}>
                                        <option value="">Select storage</option>
                                        {
                                            storages.map((storage) => (
                                                <option value={storage._id} key={storage._id}>{storage.name}</option>
                                            ))
                                        }
                                    </select>
                                }
                            </div>
                            <div className="grid gap-1">
                                <span className="text-gray-500 text-sm font-semibold self-baseline">
                                    REMARKS<span className="text-red-400">*</span>
                                </span>
                               { 
                                    action === "view" ?
                                    <span className="text-lg">
                                        {adjustment && adjustment.remarks }
                                    </span>
                                    :
                                    <textarea 
                                        name="remarks" 
                                        rows="1" 
                                        maxLength={50} 
                                        className="border border-gray-400 py-2 px-4 rounded-md resize-none"
                                        placeholder="Enter Remarks"
                                        value={adjustment.remarks}
                                        onChange={(e) => setAdjustment((prev) => ({...prev, remarks: e.target.value}))}/>
                                }
                            </div>
                        </div>
                        <div className="grid gap-2 mb-5">
                            <div className="grid gap-2 border-b-[1px] pb-2">
                                <div className="grid grid-cols-[1fr_50px_50px_100px] gap-10 text-gray-400 font-semibold text-sm">
                                    <span>
                                        ITEM<span className="text-red-400">*</span>
                                    </span>
                                    <span>UOM</span>
                                    <span>QTY</span>
                                    <span>
                                        NEW QTY<span className="text-red-400">*</span>
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-1">
                                <div className="grid grid-cols-[1fr_50px_50px_100px] gap-10 py-1 text-gray-800 text-sm items-center">
                                    {
                                        action === "view" && adjustment._id ?
                                        <>
                                            <span className="text-lg">{adjustment.item.name}</span>
                                            <span className="text-lg">{adjustment.item.uom}</span>
                                            <span className="text-lg">{adjustment.item.oldQty}</span>
                                            <span className="text-lg">{adjustment.item.newQty}</span>
                                        </>
                                        :
                                        <>
                                            <select name="item" value={adjustment.item.itemId} onChange={selectItem}>
                                            <option value="">Select item</option>
                                            {
                                                filteredItem.length > 0 && 
                                                filteredItem.map((item) => (
                                                    <option value={item._id} key={item._id}>{item.name}</option>
                                                ))
                                            }
                                            </select>
                                            <span>{adjustment.item.uom ? adjustment.item.uom: "--"}</span>
                                            <span>{adjustment.item.oldQty ? adjustment.item.oldQty : "--"}</span>
                                            <input type="number" placeholder="Qty" value={adjustment.item.newQty} onChange={(e) => setAdjustment((prev) => ({...prev, item: { ...prev.item, newQty: e.target.value}}))}/>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                    {
                        action !== "view" &&
                        <div className="flex justify-end gap-5 mt-10 px-4">
                            <button className="btn-primary px-4" onClick={id ? updateAdjustment : saveAdjustment}>{id ? "Save Edit" : "Save"}</button>
                            <button 
                                className="text-sm" 
                                onClick={() => {
                                    setVisible(false);
                                    resetAdjustment();
                                    setAdjustmentId("");
                                    setAction("");
                                }}>Cancel</button>
                        </div>
                    }
                </Dialog>
            </div>
        </>
    );
};

export default AdjustmentModal;