import React, { useContext, useState } from "react";
import { main, operations, accounts, reports } from "../static/Navlinks";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate(); 
  const [activeIndex, setActiveIndex] = useState(0);
  const { setCurrentUser, navbar, setNavbar } = useContext(UserContext);
  const path = useLocation().pathname;
  const isProduct = path.split("/");
  
  const showSubMenu = (id) => {
    setActiveIndex(id);
    if(activeIndex === id){
      setActiveIndex(0);
    }
  }

  const rotateArrow  = (id) => {
    let angle = 0;
    if(activeIndex === id){
        angle = -90;
    };
    return angle;   
  }

  const signOut = async () => {
    const { data } = await axios.post("/logout");
    if(data) {
        setCurrentUser(null);
        navigate("/login")
    }; 
  }

  return (
    <nav className={`fixed bg-dark bottom-0 top-0 h-screen w-[250px] overflow-y-auto lg:left-0 z-20 ${navbar ? "left-0" : "max-lg:left-[-1000px]"}`}>
        <div className="bg-darker text-white p-2 flex flex-col sticky top-0 w-full h-[4.5rem] justify-center">
            <span className="font-bold text-3xl">ERP SYSTEM</span>
            <span className="text-xs">MICAELLA'S MEAT PRODUCTS</span>
            <div className="hidden absolute max-lg:grid place-items-center right-2 rounded-full p-1 bg-gradient-to-r from-cyan-400 to-blue-400" onClick={(() => setNavbar(false))}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
        <div className="py-6 px-4 grid gap-4">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-light text-xs">Main</span>
                    <div className="h-[1px] bg-light/[.5] w-full" />
                </div>
                <ul className="text-lighter text-sm mt-2">
                {
                    main && 
                    main.map((link, idx) => (
                        <div key={idx}> 
                            { 
                                link.subLinks ? 
                                <li className="nav-links" key={link.id}>
                                    <div
                                    onClick={() => {
                                        showSubMenu(link.id);
                                    }} 
                                    className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                                    <div className="flex gap-2">
                                        {link.icon}
                                        {link.name}
                                    </div>
                                    {
                                        link.arrowIcon &&
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={3}
                                            stroke="currentColor"
                                            className="w-4 h-3"
                                            transform={`rotate(${rotateArrow(link.id)})`}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                                />
                                        </svg>
                                    }
                                    </div>
                                    {   
                                        link.subLinks && 
                                        <div className={`bg-darker/10 ${activeIndex === link.id ? 'flex' : 'hidden'} flex-col py-1 px-7 delay-150 ease-in-out`}>
                                        {link.subLinks &&
                                            link.subLinks.map((sub, idx) => (
                                            <NavLink to={sub.path} key={idx} className={idx === 0 && isProduct.includes("products") ? "active" : ""}>{sub.name}</NavLink>
                                            )) 
                                        }
                                        
                                        </div>
                                    }
                                </li>
                                :
                                <li className="nav-links" key={link.id}>
                                    <NavLink to={link.path} className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                                        <div className="flex gap-2">
                                            {link.icon}
                                            {link.name}
                                        </div>
                                    </NavLink>
                                </li>
                            }
                        </div>
                    ))
                }
                </ul>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-light text-xs">Operations</span>
                    <div className="h-[1px] bg-light/[.5] w-full" />
                </div>
                <ul className="text-lighter text-sm mt-2">
                {
                    operations && 
                    operations.map((link, idx) => (
                        <div key={idx}> 
                            { 
                                link.subLinks ? 
                                <li className="nav-links" key={link.id}>
                                    <div
                                    onClick={() => showSubMenu(link.id)} 
                                    className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                                    <div className="flex gap-2">
                                        {link.icon}
                                        {link.name}
                                    </div>
                                    {
                                         link.arrowIcon &&
                                         <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={3}
                                            stroke="currentColor"
                                            className="w-4 h-3"
                                            transform={`rotate(${rotateArrow(link.id)})`}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                                />
                                        </svg>
                                    }
                                    </div>
                                    {
                                        link.subLinks && 
                                        <div className={`bg-darker/10 ${activeIndex === link.id ? 'flex' : 'hidden'} flex-col py-1 px-7 delay-150 ease-in-out`}>
                                        {link.subLinks &&
                                            link.subLinks.map((sub, idx) => (
                                            <NavLink to={sub.path} key={idx}>{sub.name}</NavLink>
                                            )) 
                                        }
                                        
                                        </div>
                                    }
                                </li>
                                :
                                <li className="nav-links" key={link.id}>
                                    <NavLink to={link.path} className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                                        <div className="flex gap-2">
                                            {link.icon}
                                            {link.name}
                                        </div>
                                    </NavLink>
                                </li>
                            }
                            
                        </div>
                    ))
                }
                </ul>
            </div>
            <div> 
                <div className="flex items-center gap-2">
                    <span className="text-light text-xs">Accounts</span>
                    <div className="h-[1px] bg-light/[.5] w-full" />
                </div>
                <ul className="text-lighter text-sm mt-2">
                {
                    accounts && 
                    accounts.map((link, idx) => (
                        <div key={idx}> 
                            { 
                                link.subLinks ? 
                                <li className="nav-links" key={link.id}>
                                    <div
                                        onClick={() => showSubMenu(link.id)} 
                                        className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                                    <div className="flex gap-2">
                                        {link.icon}
                                        {link.name}
                                    </div>
                                    {
                                        link.arrowIcon &&
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={3}
                                            stroke="currentColor"
                                            className="w-4 h-3"
                                            transform={`rotate(${rotateArrow(link.id)})`}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                                />
                                        </svg>
                                    }
                                    </div>
                                    {
                                        link.subLinks && 
                                        <div className={`bg-darker/10 ${activeIndex === link.id ? 'flex' : 'hidden'} flex-col py-1 px-7 delay-150 ease-in-out`}>
                                        {link.subLinks &&
                                            link.subLinks.map((sub, idx) => (
                                            <NavLink to={sub.path} key={idx}>{sub.name}</NavLink>
                                            )) 
                                        }
                                        
                                        </div>
                                    }
                                </li>
                                :
                                <li className="nav-links" key={link.id}>
                                    <NavLink to={link.path} className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                                        <div className="flex gap-2">
                                            {link.icon}
                                            {link.name}
                                        </div>
                                    </NavLink>
                                </li>
                            }
                        </div>
                    ))
                }
                </ul>
            </div>
            <div> 
                <div className="flex items-center gap-2">
                    <span className="text-light text-xs">Reports</span>
                    <div className="h-[1px] bg-light/[.5] w-full" />
                </div>
                <ul className="text-lighter text-sm mt-2">
                {
                    reports && 
                    reports.map((link) => (
                        <li className="nav-links" key={link.id}>
                        <div
                            onClick={() => showSubMenu(link.id)} 
                            className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                        <div className="flex gap-2">
                            {link.icon}
                            {link.name}
                        </div>
                        {
                             link.arrowIcon &&
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-4 h-3"
                                transform={`rotate(${rotateArrow(link.id)})`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                            </svg>
                        }
                        </div>
                        {
                            link.subLinks && 
                            <div className={`bg-darker/10 ${activeIndex === link.id ? 'flex' : 'hidden'} flex-col py-1 px-7 delay-150 ease-in-out`}>
                            {link.subLinks &&
                                link.subLinks.map((sub, idx) => (
                                <NavLink to={sub.path} key={idx}>{sub.name}</NavLink>
                                )) 
                            }
                            </div>
                        }
                        </li>
                    ))
                }
                </ul>
            </div>
            <button className="mt-4 py-2 px-4 rounded-md text-lighter text-sm flex gap-2 items-center bg-darker w-full hover:bg-darker/70" onClick={signOut}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign out
            </button>
        </div>
    </nav>
  );
};

export default Navbar;
