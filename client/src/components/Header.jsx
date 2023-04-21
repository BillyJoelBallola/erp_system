import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

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
    <div className="sticky top-0 right-0 h-[4.5rem] bg-white border-b-gray-200 border flex justify-end items-center px-6">
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
