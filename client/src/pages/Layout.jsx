import React from "react";
import { Outlet } from "react-router-dom";
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import ScreenWarning from "../components/ScreenWarning";

const Layout = () => {
  return(
    <div className="font-roboto relative">
        <ScreenWarning />
        <Navbar />
        <main className="relative h-full">
          <Header />
          <div className="overflow-y-auto">
            <Outlet />
          </div>
        </main>
    </div>
  ); 
};

export default Layout;
