import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar_Cashier from "./Navbar_Cashier";
import "./MainLayout_Cashier.css";

function MainLayout_Cashier() {
  return (
    <div className="layout">
      <header>
        <Navbar_Cashier />
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout_Cashier;
