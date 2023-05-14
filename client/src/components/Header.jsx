import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import userImg from "../assets/user.webp";
import moment from "moment";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
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

  const handleSignOut = () => {
    axios.post("/logout").then(({data}) => {
      if(data) navigate("/login");
    })
  }

  return (
    <div className="sticky top-0 right-0 h-[3.5rem] bg-white border-b-gray-200 border flex justify-end max-lg:justify-between items-center px-2 z-10">
      <button 
        className="hidden max-lg:grid place-items-center p-1 bg-gradient-to-r rounded-full hover:shadow-lg bg-[#f1f1f1]" 
        onClick={(() => setNavbar(true))}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#212121" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
      </button>
      <div className="relative flex items-center justify-center gap-3">
        <span className="text-gray-400 text-xs">{moment(Date.now()).format("MMMM D YYYY")}</span>
        <div className="h-5 w-[1px] bg-gray-300 block"/>
        <div 
          onClick={() => setShowMenu(!showMenu)}
          className="flex gap-2 items-center bg-[#f1f1f1] py-1 px-2 rounded-md hover:shadow-md duration-100 ease-in-out cursor-pointer">
          <div className="flex w-8 aspect-square border border-gray-300 overflow-hidden rounded-md">
            <img src={userImg} className="object-contain" alt="user-img" />
          </div>
          <div className="grid">
            <span className="text-sm">{currentUser?.firstName + " " + currentUser?.lastName}</span>
            <span className="text-xs -mt-[5px]">{currentUser?.email}</span>
          </div>
        </div>
        {
          showMenu &&
          <div className="absolute top-10 right-5 grid gap-1 p-4 rounded-md bg-white shadow-lg">
            <Link to="/settings/manage-account" onClick={() => setShowMenu(false)} className="py-2 px-4 hover:bg-gray-100 rounded-md flex gap-3 text-sm items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#212121" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Account
            </Link>
            <Link to="/settings" onClick={() => setShowMenu(false)} className="py-2 px-4 hover:bg-gray-100 rounded-md flex gap-3 text-sm items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#212121" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              Manage Users
            </Link>
            <Link to="/settings" onClick={() => setShowMenu(false)} className="py-2 px-4 hover:bg-gray-100 rounded-md flex gap-3 text-sm items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#212121" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              System Settings
            </Link>
            <button
              onClick={handleSignOut} 
              className="py-2 px-4 hover:bg-gray-100 rounded-md flex gap-3 text-sm items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#212121" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign Out
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default Header;
