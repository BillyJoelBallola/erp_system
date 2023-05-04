import React from "react";
import { Dialog } from 'primereact/dialog';
import moment from "moment";

const ProductionModal = ({ visible, setVisible, productInfo, production, setProduction, submitProduction, action, setAction}) => {  
    const inputForm = (e) => {
        setProduction((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    return (
        <div className="card flex justify-content-center">
            <Dialog header="PRODUCTION" 
                visible={visible} 
                className="w-11/12 md:w-2/3 lg:w-1/2" 
                onHide={() => {
                    setVisible(false);
                    setAction && setAction("");
                    }}
                draggable={false}>
                <form className="grid gap-5">
                    <div className="grid grid-cols-[150px_150px] gap-10">
                        <div className="grid gap-1">
                            <span className="text-gray-500 text-sm font-semibold self-baseline">PRODUCT CODE</span>
                            <span className="text-md text-blue-400 max-w-max rounded-md">#{productInfo?._id && productInfo._id.substring(0,10)}</span>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-gray-500 text-sm font-semibold self-baseline">PRODUCT</span>
                            <span className="text-sm max-w-max rounded-md">{productInfo?.name && productInfo.name}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-10 mb-2">
                        <div className="grid gap-1">
                            <span className="text-gray-500 text-sm font-semibold self-baseline">DATE FINISH</span>
                            {
                                action === "view" ?
                                <span className="text-gray-500 text-md font-semibold self-baseline">{production.dateFinish && moment(production.dateFinish).format("MMMM DD YYYY")}</span>
                                :
                                <input type="date" name="dateFinish" onChange={inputForm} value={production.dateFinish && production.dateFinish.toString().slice(0, 10)}/>
                            }
                        </div>
                        <div className="grid gap-1">
                            <span className="text-gray-500 text-sm font-semibold self-baseline">FINISH PRODUCT QTY</span>
                            {
                                action === "view" ?
                                <span className="text-gray-500 text-md font-semibold self-baseline">{production.quantity && production.quantity}</span>
                                :
                                <input type="number" name="quantity" placeholder="Quantity" onChange={inputForm} value={production.quantity}/>
                            }
                           
                        </div>
                    </div>
                    <div>
                        <div className="grid gap-2">
                                <div className="grid gap-2 border-b-[1px] pb-2">
                                    <div className="grid grid-cols-[1fr_50px_100px] gap-10 text-gray-400 font-semibold text-sm">
                                        <span>ITEM</span>
                                        <span>UOM</span>
                                        <span>QTY</span>
                                    </div>
                                </div>
                                <div className="grid gap-1">
                                    {   
                                        productInfo?.rawMaterial &&
                                        productInfo.rawMaterial.map((raw, idx) => (
                                            <div className="grid grid-cols-[1fr_50px_100px] gap-10 py-1 text-gray-800 text-sm" key={idx}>
                                                <span>{raw.item}</span>
                                                <span>{raw.oum}</span>
                                                <span>{production.quantity ? raw.qty * production.quantity : raw.qty}</span>
                                            </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </form>
                {
                    action !== "view" &&
                    <div className="flex justify-end gap-5 mt-10 px-4">
                        <button className="btn-primary px-4" onClick={submitProduction}>{production ? 'Save Edit' : 'Produce'}</button>
                        <button className="text-sm" onClick={() => setVisible(false)}>Cancel</button>
                    </div>
                }
            </Dialog>
        </div>
    );
};

export default ProductionModal;
