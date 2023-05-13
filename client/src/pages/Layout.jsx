import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import ScreenWarning from "../components/ScreenWarning";
import { UserContext } from "../context/UserContext";

const Layout = () => {
  const { navbar } = useContext(UserContext);

  return(
    <div className="font-roboto relative">
        <ScreenWarning />
        <Navbar />
        <main className={`relative h-full  ${navbar ? "max-lg:before:content-['']" : ""}`}>
          <Header />
          <div className="overflow-y-auto">
            <Outlet />
          </div>
        </main>
    </div>
  ); 
};

export default Layout;
