import { useState } from "react";
import { Outlet } from "react-router-dom";
import MyNavbar from "./Components/MyNavbar/MyNavbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import './MainLayout.css'

function MainLayout() {
    const [sideBarOpen,setSideBarOpen]=useState(false)

    const openSideBar = () => setSideBarOpen(true)
    const closeSideBar = () => setSideBarOpen(false)

    return ( 
        <div className="container">
            <MyNavbar 
                sideBarOpen={sideBarOpen} 
                openSideBar={openSideBar} 
                closeSidebar={closeSideBar} // ✅ pass this
            />
            <Sidebar 
                sidebarOpen={sideBarOpen} 
                closeSidebar={closeSideBar} 
            />
            <div className="main">
                <Outlet/>
            </div>
        </div>
    );
}

export default MainLayout;
