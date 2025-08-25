import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AddProduct from "./Pages/Products/AddProducts/AddProduct";
import ViewProducts from "./Pages/Products/ViewProducts/ViewProducts";
import Billing from "./Pages/SalesBilling/Billing/Billing";
import InventoryStock from "./Pages/Products/InventoryStock/InventoryStock";
import ImportStock from "./Pages/Products/InventoryStock/ImportStock";
import ExportStock from "./Pages/Products/InventoryStock/ExportStock";
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
        </Route>     
   </Routes>
    </Router>
  );
}

export default App;
