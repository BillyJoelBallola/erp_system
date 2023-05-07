import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, setNavbar } = useContext(UserContext);

  useEffect(() => {
    window.cookieStore.get('token')
      .then((token) => {
        const { value } = token; 
        if(!value) navigate("/login");
      })
      .catch((err) => {
        navigate("/login");
      })
  }, [])

  return (
    <div className="sticky top-0 right-0 h-[3.5rem] bg-white border-b-gray-200 border flex justify-end items-center px-6 z-10">
      <div 
        className="hidden max-lg:grid absolute -left-2 place-items-end bg-gradient-to-r from-cyan-400 to-blue-400 rounded-e-full p-1" 
        onClick={(() => setNavbar(true))}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6 rotate-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400 delay-150 ease-in-out">
        <span>{currentUser?.role}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
};

export default Header;
