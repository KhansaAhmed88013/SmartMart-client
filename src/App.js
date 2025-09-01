import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AddProduct from "./Pages/Products/AddProducts/AddProduct";
import ViewProducts from "./Pages/Products/ViewProducts/ViewProducts";
import Billing from "./Pages/SalesBilling/Billing/Billing";
import InventoryStock from "./Pages/Products/InventoryStock/InventoryStock";
import ImportStock from "./Pages/Products/InventoryStock/Components/ImportExport/ImportStock";
import ExportStock from "./Pages/Products/InventoryStock/Components/ImportExport/ExportStock";
import AuditLog from "./Pages/Products/InventoryStock/Components/AuditLog/AuditLog";
import SupplierMNG from "./Pages/MNG/SupplierMNG/SupplierMNG";
import SupplierAddForm from "./Pages/MNG/SupplierMNG/Components/SupplierAdd/SupplierAddForm";
import Categories from "./Pages/Products/Categories/Categories";
import CategoryView from "./Pages/Products/Categories/Components/CategoryView/CategoryView";
import ShopProfile from "./Pages/ShopProfile/ShopProfile";
import Scanner from "./BarcodeDetection";
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
          <Route path="auditLog" element={<AuditLog/>}/>
          <Route path="supplierManagement" element={<SupplierMNG/>}/>
          <Route path="addSuppliers" element={<SupplierAddForm/>}/>
          <Route path="categories" element={<Categories/>}/>
          <Route path="allCategories" element={<CategoryView/>}/>
          <Route path="shopProfile" element={<ShopProfile/>}/>
        </Route>    
        <Route path="scanner" element={<Scanner/>}/> 
   </Routes>
    </Router>
  );
}

export default App;
