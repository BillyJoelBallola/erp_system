import axios from "axios";
import { useState, createContext, useEffect } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [navbar, setNavbar] = useState(false);

    useEffect(() => {
        if(!currentUser){
            axios.get("/profile").then(({ data }) => {
                if(data){
                    setCurrentUser(data);
                }
            }) 
        }
    }, [currentUser]);

    return(
        <UserContext.Provider value={{ currentUser, setCurrentUser, navbar, setNavbar }}>
            {children}
        </UserContext.Provider>
    )
}