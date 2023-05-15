import axios from "axios";
import { useState, createContext, useEffect } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [update, setUpdate] = useState("");
    const [navbar, setNavbar] = useState(false);

    useEffect(() => {
        axios.get("/profile").then(({ data }) => {
            setCurrentUser(data);
            setUpdate("");
        }) 
    }, [update]);

    return(
        <UserContext.Provider value={{ currentUser, setCurrentUser, navbar, setNavbar, setUpdate }}>
            {children}
        </UserContext.Provider>
    )
}