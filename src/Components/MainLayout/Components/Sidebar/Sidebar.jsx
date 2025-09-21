import "./Sidebar.css";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  
  // Helper for link clicks
  const handleLinkClick = () => {
    if (sidebarOpen) closeSidebar(); // close sidebar on mobile
  };

  const { currentUser, setCurrentUser } = useContext(UserContext);
const dispatch = useDispatch();
const navigate = useNavigate();

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
    navigate("/Login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  // Navigate to dashboard on shop name click
  const goToDashboard = () => {
    navigate("/"); // dashboard route
    if (sidebarOpen) closeSidebar();
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "sidebar_responsive" : ""}`} id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          {/* Clickable shop name */}
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
        <div className="sidebar__link active_menu_link">
          <FaHome />
          <Link to="/" onClick={handleLinkClick}>Dashboard</Link>
        </div>

        {/* Products */}
        <h2>Products</h2>
        <div className="sidebar__link">
          <FaBox />
          <Link to="/allProducts" onClick={handleLinkClick}>All Products</Link>
        </div>
        <div className="sidebar__link">
          <FaPlus />
          <Link to="/addProduct" onClick={handleLinkClick}>Add Product</Link>
        </div>
        <div className="sidebar__link">
          <FaTags />
          <Link to="/categories" onClick={handleLinkClick}>Categories</Link>
        </div>
        <div className="sidebar__link">
          <FaBoxes />
          <Link to="/stock" onClick={handleLinkClick}>Inventory / Stock</Link>
        </div>

        {/* Sales & Billing */}
        <h2>Sales & Billing</h2>
        <div className="sidebar__link">
          <FaFileInvoice />
          <Link to="/billing" onClick={handleLinkClick}>Billing / POS</Link>
        </div>
        <div className="sidebar__link">
          <FaTags />
          <Link to="/DiscountOfferSummary" onClick={handleLinkClick}>Discounts & Offers</Link>
        </div>

        {/* Purchases */}
        <h2>Purchases</h2>
        <div className="sidebar__link">
          <FaFileInvoice />
          <Link to="/PurchaseOrder" onClick={handleLinkClick}>Purchase Orders</Link>
        </div>
        <div className="sidebar__link">
          <FaFileInvoice />
          <Link to="/SuppliersInvoice" onClick={handleLinkClick}>Supplier Invoices</Link>
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
              <div className="sidebar__link">
                <FaChartLine />
                <Link to="/SalesSummary" onClick={handleLinkClick}>Sales Report</Link>
              </div>
              <div className="sidebar__link">
                <FaChartLine />
                <Link to="/OTSaleReport" onClick={handleLinkClick}>OT Sale Report</Link>
              </div>
              <div className="sidebar__link">
                <FaChartLine />
                <Link to="/StockReport" onClick={handleLinkClick}>Stock Report</Link>
              </div>
              <div className="sidebar__link">
                <FaChartLine />
                <Link to="/InvoiceReport" onClick={handleLinkClick}>Invoice Report</Link>
              </div>
              <div className="sidebar__link">
                <FaChartLine />
                <Link to="/DailySaleSummary" onClick={handleLinkClick}>Sale Summary on Slip</Link>
              </div>
            </div>
          )}
        </div>

        {/* Purchase Reports Dropdown */}
        <div className="sidebar__section">
          <div className="sidebar__link" onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}>
            <FaShoppingCart />
            <span>Purchase reports</span>
            {isPurchaseOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
          </div>
          {isPurchaseOpen && (
            <div className="sidebar__dropdown">
              <div className="sidebar__link">
                <FaShoppingCart />
                <Link to="/PurchaseReport" onClick={handleLinkClick}>Purchase Report</Link>
              </div>
              <div className="sidebar__link">
                <FaShoppingCart />
                <Link to="/SupplierReport" onClick={handleLinkClick}>Supplier Report</Link>
              </div>
              <div className="sidebar__link">
                <FaShoppingCart />
                <Link to="/DailyPurchaseSummary" onClick={handleLinkClick}>Daily Purchase Summary</Link>
              </div>
            </div>
          )}
          <div className="sidebar__link">
            <FaShoppingCart />
            <Link to="/CustomerReport" onClick={handleLinkClick}>Customer Report</Link>
          </div>
        </div>

        {/* Management */}
        <h2>MNG</h2>
        <div className="sidebar__link">
          <FaWrench />
          <Link to="/employeeManagement" onClick={handleLinkClick}>Employee Management</Link>
        </div>
        <div className="sidebar__link"  onClick={() => (window.location.href = "/CustomerManagement")}>
          <FaUsers />
          <Link to="/customerManagement" onClick={handleLinkClick}>Customer Management</Link>
        </div>
        <div className="sidebar__link">
          <FaTruck />
          <Link to="/supplierManagement" onClick={handleLinkClick}>Supplier Management</Link>
        </div>

        {/* Settings */}
        <div className="settings">
          <h2>Settings</h2>
          <div className="sidebar__link">
            <FaCogs />
            <Link to="/settings" onClick={handleLinkClick}>System Settings</Link>
          </div>
          <div className="sidebar__link logoutred" onClick={handleLogout}>
            <FaSignOutAlt />
            <span  style={{ cursor: "pointer" }}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
