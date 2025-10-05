import "./Sidebar.css";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../../Context/ProfileContext";
import { useDispatch } from "react-redux";
import { UserContext } from "../../../../Context/UserContext";
import { clearRole } from "../../../../redux/Role/roleSlice";
import { logOut } from "../../../../UserService";

import { 
  FaTimes, FaHome, FaBox, FaTags, FaShoppingCart, FaFileInvoice, 
  FaChartLine, FaWrench, FaUsers, FaCogs, FaSignOutAlt, FaTruck,
  FaBoxes, FaPlus, FaChevronDown, FaChevronUp
} from "react-icons/fa";

function Sidebar({ sidebarOpen, closeSidebar }) {
  const { ProfileData } = useContext(ProfileContext);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
    if (sidebarOpen) closeSidebar();
  };

  const handleLogout = async () => {
    if (!currentUser) return;
    try {
      await logOut({ userId: currentUser.id });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      dispatch(clearRole());
      if (sidebarOpen) closeSidebar();
      navigate("/recovery/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const goToDashboard = () => handleLinkClick("/");

  return (
    <div className={`sidebar ${sidebarOpen ? "sidebar_responsive" : ""}`} id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <h2 
            style={{ cursor: "pointer" }} 
            title="Go to Dashboard"
            onClick={goToDashboard}
          >
            {ProfileData?.shopName || "Shop Name"}
          </h2>
        </div>
        <FaTimes className="sidebar__close" onClick={closeSidebar} />
      </div>

      <div className="sidebar__menu">
        {/* Dashboard */}
        <div className="sidebar__link active_menu_link" onClick={() => handleLinkClick("/")}>
          <FaHome />
          <span>Dashboard</span>
        </div>

        {/* Products */}
        <h2>Products</h2>
        <div className="sidebar__link" onClick={() => handleLinkClick("/allProducts")}>
          <FaBox />
          <span>All Products</span>
        </div>
        <div className="sidebar__link" onClick={() => handleLinkClick("/addProduct")}>
          <FaPlus />
          <span>Add Product</span>
        </div>
        <div className="sidebar__link" onClick={() => handleLinkClick("/categories")}>
          <FaTags />
          <span>Categories</span>
        </div>
        <div className="sidebar__link" onClick={() => handleLinkClick("/stock")}>
          <FaBoxes />
          <span>Inventory / Stock</span>
        </div>

        {/* Sales & Billing */}
        <h2>Sales & Billing</h2>
        <div className="sidebar__link" onClick={() => handleLinkClick("/billing")}>
          <FaFileInvoice />
          <span>Billing / POS</span>
        </div>
        <div className="sidebar__link" onClick={() => handleLinkClick("/DiscountOfferSummary")}>
          <FaTags />
          <span>Discounts & Offers</span>
        </div>

        {/* Purchases */}
        <h2>Purchases</h2>
        <div className="sidebar__link" onClick={() => handleLinkClick("/PurchaseOrder")}>
          <FaFileInvoice />
          <span>Purchase Orders</span>
        </div>
        <div className="sidebar__link" onClick={() => handleLinkClick("/SuppliersInvoice")}>
          <FaFileInvoice />
          <span>Supplier Invoices</span>
        </div>

        {/* Reports */}
        <h2>Reports</h2>

        {/* Sales Reports Dropdown */}
        <div className="sidebar__section">
          <div className="sidebar__link" onClick={() => setIsSalesOpen(!isSalesOpen)}>
            <FaChartLine />
            <span>Sales Reports</span>
            {isSalesOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
          </div>
          {isSalesOpen && (
            <div className="sidebar__dropdown">
              <div className="sidebar__link" onClick={() => handleLinkClick("/DailySalesReport")}>
                <FaChartLine />
                <span>Daily Sales Report</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/SalesSummary")}>
                <FaChartLine />
                <span>Sales Report</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/OTSaleReport")}>
                <FaChartLine />
                <span>OT Sale Report</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/StockReport")}>
                <FaChartLine />
                <span>Stock Report</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/InvoiceReport")}>
                <FaChartLine />
                <span>Invoice Report</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/DailySaleSummary")}>
                <FaChartLine />
                <span>Sale Summary on Slip</span>
              </div>
            </div>
          )}
        </div>

        {/* Purchase Reports Dropdown */}
        <div className="sidebar__section">
          <div className="sidebar__link" onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}>
            <FaShoppingCart />
            <span>Purchase Reports</span>
            {isPurchaseOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
          </div>
          {isPurchaseOpen && (
            <div className="sidebar__dropdown">
              <div className="sidebar__link" onClick={() => handleLinkClick("/PurchaseReport")}>
                <FaShoppingCart />
                <span>Purchase Report</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/SupplierReport")}>
                <FaShoppingCart />
                <span>Supplier Report</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/DailyPurchaseSummary")}>
                <FaShoppingCart />
                <span>Daily Purchase Summary</span>
              </div>
            </div>
          )}
        </div>

        {/* Customer Reports Dropdown */}
        <div className="sidebar__section">
          <div className="sidebar__link" onClick={() => setIsCustomerOpen(!isCustomerOpen)}>
            <FaShoppingCart />
            <span>Customer Report</span>
            {isCustomerOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
          </div>
          {isCustomerOpen && (
            <div className="sidebar__dropdown">
              <div className="sidebar__link" onClick={() => handleLinkClick("/CustomerReport")}>
                <FaShoppingCart />
                <span>Customer Wise Record</span>
              </div>
              <div className="sidebar__link" onClick={() => handleLinkClick("/CustomerInvoiceRecord")}>
                <FaShoppingCart />
                <span>Customer Invoice Record</span>
              </div>
            </div>
          )}
        </div>

        {/* Management */}
        <h2>MNG</h2>
        <div className="sidebar__link" onClick={() => handleLinkClick("/employeeManagement")}>
          <FaWrench />
          <span>Employee Management</span>
        </div>
        <div className="sidebar__link" onClick={() => handleLinkClick("/customerManagement")}>
          <FaUsers />
          <span>Customer Management</span>
        </div>
        <div className="sidebar__link" onClick={() => handleLinkClick("/supplierManagement")}>
          <FaTruck />
          <span>Supplier Management</span>
        </div>

        {/* Settings */}
        <div className="settings">
          <h2>Settings</h2>
          <div className="sidebar__link" onClick={() => handleLinkClick("/settings")}>
            <FaCogs />
            <span>System Settings</span>
          </div>
          <div className="sidebar__link logoutred" onClick={handleLogout}>
            <FaSignOutAlt />
            <span style={{ cursor: "pointer" }}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
