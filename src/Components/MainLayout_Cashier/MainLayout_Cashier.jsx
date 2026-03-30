import { Outlet } from "react-router-dom";
import NavbarCashier from "./Navbar_Cashier";
import "./MainLayout_Cashier.css";

function MainLayout_Cashier() {
  return (
    <div className="layout">
      <header>
        <NavbarCashier />
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout_Cashier;
