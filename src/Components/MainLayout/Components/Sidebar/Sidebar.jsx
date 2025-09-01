import "./Sidebar.css";

import React, { useEffect, useState } from "react";

import { 
  FaTimes, FaHome, FaUserSecret, FaBuilding, FaWrench, 
  FaBox, FaTags, FaShoppingCart, FaFileInvoice, 
  FaChartLine, FaUsers, FaCogs, FaSignOutAlt, FaTruck ,FaBoxes,FaPlus,FaChevronDown,FaChevronUp
} from "react-icons/fa";
import { getProfileName } from "../../../../UserService";

function Sidebar({ sidebarOpen, closeSidebar }) {

  const [isOpen, setIsOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);


  const [profilename,setProfileName]=useState("Smart Super ")
useEffect(()=>{
  const getname=async()=>{
    const result=await getProfileName();
    if(result){
      setProfileName(result)
    }
  }
  getname()
},[])

  return (
    <div className={sidebarOpen ? "sidebar_responsive" : ""} id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <h2>{profilename.shopName}</h2>
        </div>
        <FaTimes
          className="sidebar__close"
          id="sidebarIcon"
          onClick={closeSidebar}
        />
      </div>

      <div className="sidebar__menu">
        {/* Dashboard */}
        <div className="sidebar__link active_menu_link">
          <FaHome />
          <a href="/">Dashboard</a>
        </div>

         {/* Products */}
        <h2>Products</h2>
        <div className="sidebar__link" onClick={()=>window.location.href='/allProducts'}>
              <FaBox />
              <a >All Products</a>
            </div>
            <div className="sidebar__link" onClick={()=>window.location.href='/addProduct'}>
              <FaPlus />
              <a href="#">Add Product</a>
            </div>
            <div className="sidebar__link" onClick={()=>window.location.href='/categories'}>
              <FaTags />
              <a href="/categories">Categories</a>
            </div>
            <div className="sidebar__link" onClick={()=>window.location.href='/stock'}>
              <FaBoxes />
              <a href="#">Inventory / Stock</a>
            </div>

        {/* Sales & Billing */}
        <h2>Sales & Billing</h2>
        <div className="sidebar__link" onClick={()=>window.location.href='/SalesRecord'}>
          <FaShoppingCart />
          <a href="#">Sales Records</a>
        </div>
        <div className="sidebar__link" onClick={()=>window.location.href='/billing'}>
          <FaFileInvoice />
          <a href="/billing">Billing / POS</a>
        </div>
        <div className="sidebar__link" onClick={()=>window.location.href='/DiscountOfferSummary'}>
              <FaTags />
              <a href="#">Discounts & Offers</a>
        </div>

        {/* Purchases */}
        <h2>Purchases</h2>
        <div className="sidebar__link">
          <FaFileInvoice />
          <a href="#">Purchase Orders</a>
        </div>
        <div className="sidebar__link">
          <FaFileInvoice />
          <a href="#">Supplier Invoices</a>
        </div>

        {/* Reports */}
        <h2>Reports</h2>
        <div className="sidebar__section">
      {/* Parent Folder */}
      <div className="sidebar__link" onClick={() => setIsOpen(!isOpen)}>
        <FaChartLine />
        <span>Sales Reports</span>
        {isOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="sidebar__dropdown">
          <div className="sidebar__link" onClick={() => (window.location.href = "/SalesSummary")}>
            <FaChartLine />
            <span>Sales Report</span>
          </div>
          <div className="sidebar__link" onClick={() => (window.location.href = "/OTSaleReport")}>
            <FaChartLine />
            <span>OT Sale Report</span>
          </div>
          <div className="sidebar__link" onClick={() => (window.location.href = "/StockReport")}>
            <FaChartLine />
            <span>Stock Report</span>
          </div>
          <div className="sidebar__link" onClick={() => (window.location.href = "/SalariesInvoiceReport")}>
            <FaChartLine />
            <span>Sales Invoice Wise Report</span>
          </div>
          <div className="sidebar__link" onClick={() => (window.location.href = "/SalesReturnReport")}>
            <FaChartLine />
            <span>Sale Return</span>
          </div>
          <div className="sidebar__link" onClick={() => (window.location.href = "/InvoiceReport")}>
            <FaChartLine />
            <span>Invoice Report</span>
          </div>
          <div className="sidebar__link" onClick={() => (window.location.href = "/DailySaleSummary")}>
            <FaChartLine />
            <span>Sale Summary on Slip</span>
          </div>
        </div>
      )}
    </div>
    <div className="sidebar__section">
      {/* Parent Folder */}
      <div className="sidebar__link" onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}>
        <FaShoppingCart />
        <span>Purchase reports</span>
        {isPurchaseOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
      </div>

      {/* Dropdown Content */}
      {isPurchaseOpen && (
        <div className="sidebar__dropdown">
          <div className="sidebar__link" onClick={() => (window.location.href = "/PurchaseReport")}>
            <FaShoppingCart />
            <span>purchase report</span>
          </div>
          <div className="sidebar__link" onClick={() => (window.location.href = "/SupplierReport")}>
            <FaShoppingCart />
            <span>Supplier report</span>
          </div>
          
          <div className="sidebar__link" onClick={() => (window.location.href = "/DailyPurchaseSummary")}>
            <FaShoppingCart />
            <span>Daily purchase summary </span>
          </div>
        </div>
      )}
         <div className="sidebar__link" onClick={() => (window.location.href = "/CustomerReport")}>
            <FaShoppingCart />
            <span>Customer Report </span>
          </div>
    </div>
    


        {/* Management */}
        <h2>MNG</h2>
        <div className="sidebar__link">
          <FaWrench />
          <a href="#">Employee Management</a>
        </div>
        <div className="sidebar__link">
          <FaUsers />
          <a href="#">Customer Management</a>
        </div>
        <div className="sidebar__link">
          <FaTruck />
          <a href="/supplierManagement">Supplier Management</a>
        </div>

        {/* Settings */}
        <div className="settings">
            <h2>Settings</h2>
        <div className="sidebar__link" onClick={()=>window.location.href='/shopProfile'}>
          <FaCogs />
          <a href="#">System Settings</a>
        </div>
        <div className="sidebar__link logoutred">
          <FaSignOutAlt />
          <a href="#">Logout</a>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
