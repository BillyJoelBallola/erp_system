import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import MainLinks from "./MainLinks";
import SettingLinks from "./SettingLinks";

const Navbar = () => {
    const { navbar, setNavbar } = useContext(UserContext);
    const path = useLocation().pathname;

    const isSettings = path.split("/");

    return (
        <nav className={`fixed bg-dark bottom-0 top-0 h-screen w-[250px] overflow-y-auto lg:left-0 z-30 ${navbar ? "left-0" : "max-lg:left-[-1000px]"}`}>
            <div className="bg-darker text-white p-2 flex flex-col sticky top-0 w-full justify-center z-30">
                <button 
                    className="hidden mb-2 max-w-min whitespace-nowrap px-3 py-1 max-lg:grid place-items-center rounded-full bg-dark hover:bg-light cursor-pointer duration-150 ease-in-out" 
                    onClick={(() => setNavbar(false))}>
                    <div className="flex gap-2 items-center text-lighter">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="rgb(178 178 178)" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Close menu  
                    </div>
                </button>
                <div className="grid bg-[#292929] rounded-lg p-1 text-center">
                    <span className="font-bold text-2xl">ERP SYSTEM</span>
                    <span className="text-xs -mt-1">MICAELLA'S MEAT PRODUCTS</span>
                </div>
            </div>  
            {
                isSettings.includes("settings") ? <SettingLinks /> : <MainLinks />
            }
        </nav>
    );
};

export default Navbar;
