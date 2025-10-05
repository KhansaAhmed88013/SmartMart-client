import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Context/UserContext";
import { ProfileProvider } from "./Context/ProfileContext";
import { RecoveryProvider } from "./Context/RecoveryContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import MainLayout from "./Components/MainLayout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AddProduct from "./Pages/Products/AddProducts/AddProduct";
import ViewProducts from "./Pages/Products/ViewProducts/ViewProducts";
import Billing from "./Pages/SalesBilling/Billing/Billing";
import InventoryStock from "./Pages/Products/InventoryStock/InventoryStock";
import SalesSummary from "./Pages/Reports/SalesReport/SalesReports";
import OTSaleReport from "./Pages/Reports/SalesReport/OTsaleReport";
import StockReport from "./Pages/Reports/SalesReport/StockReport";
import InvoiceReport from "./Pages/Reports/SalesReport/InvoiceReport";
import DailySaleSummary from "./Pages/Reports/SalesReport/TotalSummery";
import PurchaseReport from "./Pages/Reports/PurchaseReports/PurchaseReport";
import SupplierReport from "./Pages/Reports/PurchaseReports/SupplierReport";
import DailyPurchaseSummary from "./Pages/Reports/PurchaseReports/DailyPurchaseSummary";
import CustomerReport from "./Pages/Reports/CustomerReport/CustomerReport";
import DiscountOffer from "./Pages/SalesBilling/Discount/DiscountOffer";

import ImportStock from "./Pages/Products/InventoryStock/Components/ImportExport/ImportStock";
import ExportStock from "./Pages/Products/InventoryStock/Components/ImportExport/ExportStock";
import AuditLog from "./Pages/Products/InventoryStock/Components/AuditLog/AuditLog";
import CustomerManagement from "./Pages/MNG/CustomerMNG/CustomerManagement";
import SupplierMNG from "./Pages/MNG/SupplierMNG/SupplierMNG";
import SupplierAddForm from "./Pages/MNG/SupplierMNG/Components/SupplierAdd/SupplierAddForm";
import SupplierView from "./Pages/MNG/SupplierMNG/Components/SupplierView/SupplierView";
import Categories from "./Pages/Products/Categories/Categories";
import CategoryView from "./Pages/Products/Categories/Components/CategoryView/CategoryView";
import ShopProfile from "./Pages/ShopProfile/ShopProfile";
import PurchaseOrder from "./Pages/Purchases/PurchaseOrder/PurchaseOrder";
import SupplierInvoicePage from "./Pages/Purchases/SupplierInvoicePage/SupplierInvoicePage";
import CategoryDiscount from "./Pages/SalesBilling/Discount/Components/CategoryDiscount/CategoryDiscount";
import ItemsDiscount from "./Pages/SalesBilling/Discount/Components/ItemsDiscount/ItemsDiscount";
import TotalBillDiscount from "./Pages/SalesBilling/Discount/Components/TotalBillDiscount/TotalBillDiscount";
import AddUser from "./Pages/AddUser/AddUser";
import ProductUnits from "./Pages/Settings/ProductUnits";
import Settings from "./Pages/Settings/Settings";
import EmployeMNG from "./Pages/MNG/EmployeMNG/EmployeMNG";
import Login from "./Components/Login/Login";
import CashierDashboard from "./Pages/CashierDashboard/CashierDashboard";
import MainLayout_Cashier from "./Components/MainLayout_Cashier/MainLayout_Cashier";
import CashierReport from "./Pages/CashierReport/CashierReport";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import CustomerInvoiceRecord from "./Pages/Reports/CustomerReport/CustomerInvoiceRecord";
import DailySalesReport from "./Pages/Reports/SalesReport/DailySalesReport";
import OTPinput from "./Components/Login/OTPinput";
import Recovered from "./Components/Login/Recovered";
import SuccessMsg from "./Components/Login/SuccessMsg";
import RecoveryInfo from "./Components/Login/RecoveryInfo";
import Notifications from "./Components/Notifications/Notifications";
function App() {
  return (
    <ProfileProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route
              path="/recovery/*"
              element={
                <RecoveryProvider>
                  <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="OTPinput" element={<OTPinput />} />
                    <Route path="Recovered" element={<Recovered />} />
                    <Route path="Recovery-Info" element={<RecoveryInfo />} />
                    <Route
                      path="Success-in-password-change"
                      element={<SuccessMsg />}
                    />
                  </Routes>
                </RecoveryProvider>
              }
            />

            {/* ---------- ADMIN LAYOUT ---------- */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="billing" element={<Billing />} />
              <Route path="addProduct" element={<AddProduct />} />
              <Route path="allProducts" element={<ViewProducts />} />
              <Route path="stock" element={<InventoryStock />} />
              <Route path="import" element={<ImportStock />} />
              <Route path="export" element={<ExportStock />} />
              <Route path="SalesSummary" element={<SalesSummary />} />
              <Route path="OTSaleReport" element={<OTSaleReport />} />
              <Route path="StockReport" element={<StockReport />} />
              <Route path="InvoiceReport" element={<InvoiceReport />} />
              <Route path="DailySaleSummary" element={<DailySaleSummary />} />
              <Route path="PurchaseReport" element={<PurchaseReport />} />
              <Route path="SupplierReport" element={<SupplierReport />} />
              <Route
                path="DailyPurchaseSummary"
                element={<DailyPurchaseSummary />}
              />
              <Route path="CustomerReport" element={<CustomerReport />} />
              <Route path="DiscountOfferSummary" element={<DiscountOffer />} />
              <Route path="auditLog" element={<AuditLog />} />
              <Route path="supplierManagement" element={<SupplierMNG />} />
              <Route path="addSuppliers" element={<SupplierAddForm />} />
              <Route path="viewSuppliers" element={<SupplierView />} />
              <Route path="categories" element={<Categories />} />
              <Route path="allCategories" element={<CategoryView />} />
              <Route path="shopProfile" element={<ShopProfile />} />
              <Route path="PurchaseOrder" element={<PurchaseOrder />} />
              <Route
                path="SuppliersInvoice"
                element={<SupplierInvoicePage />}
              />
              <Route path="CategoryDiscount" element={<CategoryDiscount />} />
              <Route path="ItemsDiscount" element={<ItemsDiscount />} />
              <Route path="TotalBillDiscount" element={<TotalBillDiscount />} />
              <Route path="addUser" element={<AddUser />} />
              <Route path="units" element={<ProductUnits />} />
              <Route path="settings" element={<Settings />} />
              <Route path="changePassword" element={<ChangePassword />} />
              <Route path="employeeManagement" element={<EmployeMNG />} />
              <Route path="notifications" element={<Notifications />} />
              <Route
                path="CustomerManagement"
                element={<CustomerManagement />}
              />
              <Route
                path="/CustomerInvoiceRecord"
                element={<CustomerInvoiceRecord />}
              />
              <Route path="/DailySalesReport" element={<DailySalesReport />} />
            </Route>

            {/* ---------- CASHIER LAYOUT ---------- */}
            <Route
              path="/cashier"
              element={
                <ProtectedRoute allowedRoles={["Cashier"]}>
                  <MainLayout_Cashier />
                </ProtectedRoute>
              }
            >
              <Route index element={<CashierDashboard />} />
              <Route path="billing" element={<Billing />} />
              <Route path="userreport" element={<CashierReport />} />
              <Route path="changePassword" element={<ChangePassword />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Router>
      </UserProvider>
    </ProfileProvider>
  );
}

export default App;
