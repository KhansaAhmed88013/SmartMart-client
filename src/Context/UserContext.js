import {  createContext,useState } from "react";

export const UserContext=createContext()

export const UserProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState(
        JSON.parse(localStorage.getItem("currentUser")) || null
    )
    return(
        <UserContext.Provider value={{currentUser,setCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}