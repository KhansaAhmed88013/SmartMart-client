import "./Sidebar.css";
import { 
  FaTimes, FaHome, FaUserSecret, FaBuilding, FaWrench, 
  FaBox, FaTags, FaShoppingCart, FaFileInvoice, 
  FaChartLine, FaUsers, FaCogs, FaSignOutAlt, FaTruck ,FaBoxes,FaPlus
} from "react-icons/fa";

function Sidebar({ sidebarOpen, closeSidebar }) {
  return (
    <div className={sidebarOpen ? "sidebar_responsive" : ""} id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <h2><strong>Smart</strong>Mart</h2>
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
            <div className="sidebar__link">
              <FaTags />
              <a href="#">Categories</a>
            </div>
            <div className="sidebar__link" onClick={()=>window.location.href='/stock'}>
              <FaBoxes />
              <a href="#">Inventory / Stock</a>
            </div>

        {/* Sales & Billing */}
        <h2>Sales & Billing</h2>
        <div className="sidebar__link">
          <FaShoppingCart />
          <a href="#">Sales Records</a>
        </div>
        <div className="sidebar__link" onClick={()=>window.location.href='/billing'}>
          <FaFileInvoice />
          <a href="/billing">Billing / POS</a>
        </div>
        <div className="sidebar__link">
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
        <div className="sidebar__link">
          <FaChartLine />
          <a href="#">Sales Report</a>
        </div>
        <div className="sidebar__link">
          <FaChartLine />
          <a href="#">Inventory Report</a>
        </div>
        <div className="sidebar__link">
          <FaChartLine />
          <a href="#">Profit & Loss</a>
        </div>
        <div className="sidebar__link">
          <FaChartLine />
          <a href="#">Expenses Report</a>
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
          <a href="#">Supplier Management</a>
        </div>

        {/* Settings */}
        <div className="settings">
            <h2>Settings</h2>
        <div className="sidebar__link">
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
