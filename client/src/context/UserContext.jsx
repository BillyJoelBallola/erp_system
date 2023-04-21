import axios from "axios";
import { useState, createContext, useEffect } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

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
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    )
}