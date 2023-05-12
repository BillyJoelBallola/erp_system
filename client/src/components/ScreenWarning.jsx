import React, { useState } from "react";

const ScreenWarning = () => {
    const [show, setShow] = useState(true);

    return(
        <div className={`w-full ${show ? "flex" : "hidden"} gap-4 items-center justify-between md:hidden bg-blue-950 text-white font-semibold p-4`}>
            <span>ERP system is best viewed in 1024x768 resolution and above.</span>
            <button onClick={() => setShow(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

        </div>
    );
};

export default ScreenWarning;
