import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AddProduct from "./Pages/Products/AddProducts/AddProduct";
import ViewProducts from "./Pages/Products/ViewProducts/ViewProducts";
import Billing from "./Pages/SalesBilling/Billing/Billing";
import InventoryStock from "./Pages/Products/InventoryStock/InventoryStock";

import SalesRecord from "./Pages/SalesBilling/Billing/SalesRecord";
import SalesSummary from "./Pages/Reports/SalesReport/SalesReports";
import OTSaleReport from "./Pages/Reports/SalesReport/OTsaleReport";
import StockReport from "./Pages/Reports/SalesReport/StockReport";
import SalariesInvoiceReport from "./Pages/Reports/SalesReport/SaleriesInvoiceReport";
import SalesReturnReport from "./Pages/Reports/SalesReport/SalesReturnReport";
import InvoiceReport from "./Pages/Reports/SalesReport/InvoiceReport";
import DailySaleSummary from "./Pages/Reports/SalesReport/TotalSummery";
import PurchaseReport from "./Pages/Reports/PurchaseReports/PurchaseReport";
import SupplierReport from "./Pages/Reports/PurchaseReports/SupplierReport";
import DailyPurchaseSummary from "./Pages/Reports/PurchaseReports/DailyPurchaseSummary";
import CustomerReport from "./Pages/Reports/CustomerReport/CustomerReport";
import DiscountOfferSummary from "./Pages/SalesBilling/Discount/DiscountOfferSummary";

import ImportStock from "./Pages/Products/InventoryStock/Components/ImportExport/ImportStock";
import ExportStock from "./Pages/Products/InventoryStock/Components/ImportExport/ExportStock";
import AuditLog from "./Pages/Products/InventoryStock/Components/AuditLog/AuditLog";
import CustomerManagement from "./Pages/MNG/CustomerMNG/CustomerManagement";
import SupplierMNG from "./Pages/MNG/SupplierMNG/SupplierMNG";
import SupplierAddForm from "./Pages/MNG/SupplierMNG/Components/SupplierAdd/SupplierAddForm";
import Categories from "./Pages/Products/Categories/Categories";
import CategoryView from "./Pages/Products/Categories/Components/CategoryView/CategoryView";
import ShopProfile from "./Pages/ShopProfile/ShopProfile";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />     
          <Route path="addProduct" element={<AddProduct />} />
          <Route path="allProducts" element={<ViewProducts />} />
          <Route path="billing" element={<Billing />} />
          <Route path="stock" element={<InventoryStock/>}/>
          <Route path="import" element={<ImportStock/>}/>
          <Route path="export" element={<ExportStock/>}/>

         <Route path="SalesRecord" element={<SalesRecord/>}/>
         <Route path="SalesSummary" element={<SalesSummary/>}/>
         <Route path="OTSaleReport" element={<OTSaleReport/>}/>
         <Route path="StockReport" element={<StockReport/>}/>
         <Route path="SalariesInvoiceReport" element={<SalariesInvoiceReport/>}/>
         <Route path="SalesReturnReport" element={<SalesReturnReport/>}/>
          <Route path="InvoiceReport" element={<InvoiceReport/>}/>
          <Route path="DailySaleSummary" element={<DailySaleSummary/>}/>
          <Route path="PurchaseReport" element={<PurchaseReport/>}/>
          <Route path="SupplierReport" element={<SupplierReport/>}/>
          <Route path="DailyPurchaseSummary" element={<DailyPurchaseSummary/>}/>
          <Route path="CustomerReport" element={<CustomerReport/>}/>
          <Route path="DiscountOfferSummary" element={<DiscountOfferSummary/>}/>
  
          <Route path="auditLog" element={<AuditLog/>}/>
          <Route path="CustomerManagement" element={<CustomerManagement/>}/>
          <Route path="supplierManagement" element={<SupplierMNG/>}/>
          <Route path="addSuppliers" element={<SupplierAddForm/>}/>
          <Route path="categories" element={<Categories/>}/>
          <Route path="allCategories" element={<CategoryView/>}/>
          <Route path="shopProfile" element={<ShopProfile/>}/>
        </Route>    
      

   </Routes>
    </Router>
  );
}

export default App;
