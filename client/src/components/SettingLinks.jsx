import React, { useContext } from "react";
import { settings } from "../static/Navlinks";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const SettingLinks = () => {
    const { setNavbar } = useContext(UserContext);
    return (
        <div className="py-6 px-4 grid gap-4">
            <ul className="text-lighter text-sm">
                {
                    settings.map((link) => (
                        <li className="nav-links" key={link.id}>
                            <NavLink 
                                onClick={() => setNavbar(false)}
                                to={link.path}
                                className="flex gap-2 items-center justify-between py-2 hover:text-blue-400 cursor-pointer">
                                <div className="flex gap-2 items-center">
                                    {link.icon}
                                    {link.name}
                                </div>
                            </NavLink>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default SettingLinks;
