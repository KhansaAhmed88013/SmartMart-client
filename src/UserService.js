import axios from "axios";
import { store } from "./redux/store";

// ✅ Get dynamic base URL from Redux or localStorage
const getDynamicBaseURL = () => {
  const state = store.getState();
  const reduxPath = state?.path?.path;

  
  if (reduxPath) return reduxPath;


  const storedPath = localStorage.getItem("path");
  if (storedPath) return storedPath;
  return "";
};
const API_BASE = getDynamicBaseURL();
export const AddProduct = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addProducts`, data, {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const GetProducts = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getProducts`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const DelProduct = async (code) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delProduct/${code}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const UpdateProduct = async (data) => {
  try {
    const result = await axios.put(`${API_BASE}/updateProduct`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

//Suppier
export const AddSupplier = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addSupplier`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetSuppliers = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getSupplier`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetSupplierReport = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getSupplierReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const EditSupplier = async (data) => {
  try {
   const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res =await axios.put(`${API_BASE}/editSupplier`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelSupplier = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delSupplier/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
//Category
export const CreateCategory = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addCategory`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetCategories = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getCategory`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const EditCategory = async (data) => {
  try {
   const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res =await axios.put(`${API_BASE}/editCategory`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelCategory = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delCategory/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetCategoriesSuppliers = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getCategoryNsuppliers`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const AddDiscount = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addDiscount`, data, {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
export const GetProductNameCode = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/products-basic`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
export const GetDiscount = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/discounts`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
export const UpdateDiscount = async (data) => {
  try {
   const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res =await axios.put(`${API_BASE}/editDiscount`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelDiscount = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delDiscount/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const AddBillDiscount = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addBillDiscount`, data, {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
export const getBillDiscount = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getBillDiscount`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelBillDiscount = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delBillDiscount/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const UpdateBillDiscount = async (data) => {
  try {
   const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res =await axios.put(`${API_BASE}/UpdateBillDiscount`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

//coategory discount
export const AddCategoryDiscount = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addCategoryDiscount`, data, {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
export const GetCategoryDiscounts = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getCategoryDiscounts`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelCategoryDiscount = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delCategoryDiscount/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const UpdateCategoryDiscount = async (data) => {
  try {
    const res = await axios.put(
      `${API_BASE}/updateCategoryDiscount`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const Getnoofdiscount = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getnoofdiscount`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

//Billing
export const AddInvoice=async(data)=>{
    try{
        console.log(data)
        const res=await axios.post(`${API_BASE}/addInvoice`,data,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        console.log(res)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const getLastInvoiceNo=async()=>{
    try{
        const res=await axios.get(`${API_BASE}/getInvoiceNo`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

export const getCustomerBillingRecord=async(id)=>{
    try{
        const res=await axios.get(`${API_BASE}/getCustomerBillingRecord/${id}`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

//Profile
export const getProfile=async()=>{
    try{
        const res=await axios.get(`${API_BASE}/getProfile`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const getProfileName=async()=>{
    try{
        const res=await axios.get(`${API_BASE}/getProfileName`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const AddProfile=async(data)=>{
    console.log(data)
    try{
        const res=await axios.post(`${API_BASE}/addProfile`,data,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const GetProductByBarcode = async (barcode) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getproductdetail/${barcode}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
}


export const UpdateDiscountStatus=async(data)=>{
    try{
        const res=await axios.put(`${API_BASE}/editDiscountStatus`,data,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

//customer
// Customer
export const AddCustomer = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addCustomer`, data, {
            headers:{
                'Content-Type':'application/json'
            }
        })
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

export const GetDailySalesReport = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/DailySalesReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const GetSalesReportData = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getSalesReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetCashierSalesReport = async (username, role) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getCashierSalesReport`, {
      params: { username, role },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getCashierDashboardReport = async (username, role) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getCashierDashboardReport`, {
      params: { username, role },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const GetStockReport = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getStockReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getDailyPurchases = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getDailyPurchaseSummary`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
//purchase order
export const CreatePurchaseOrder = async (data) => {
  console.log(data);
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addPurchase`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getPurchases = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getPurchase`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const updatePurchaseStatus = async (data) => {
  console.log(data);
  try {
   const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res =await axios.put(`${API_BASE}/updatePurchaseStatus`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelPurchase = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delPurchase/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getSalesSummaryReport = async (data) => {
  try {
    const res = await axios.get(
      `${API_BASE}/getSalesSummary?from=${data.startDate}&to=${data.endDate}`
    );
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getOTsalesReport = async (data) => {
  try {
    const res = await axios.get(
      `${API_BASE}/getOTsalesReport`
    );
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
}

export const getInvoiceReport = async (data) => {
  try {
    const res = await axios.get(
      `${API_BASE}/getInvoiceReports?from=${data.startDate}&to=${data.endDate}`
    );
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const addUser = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addusers`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    // Check if server returned a response
    if (err.response && err.response.data) {
      return err.response.data; // return object like { success: false, message: "Username already exists" }
    }
    return { success: false, message: err.message || "Unknown error" };
  }
};
export const getUsers = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/users`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const loginUser = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
  
    
    const res = await axios.post(`${API_BASE}/login`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data; // { success: true/false, user, message }
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data; // return { success: false, message: "..." }
    }
    return { success: false, message: err.message || "Unknown error" };
  }
};
export const logOut = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/logout`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const GetCutomers = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getCustomers`);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const GetCutomersReport = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getCustomerSalesReport`);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

// ✅ delete uses id in URL
export const DeleteCustomer = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delCustomer/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

// ✅ update sends full object in body (must include id)
export const UpdateCustomer = async (id, data) => {
  try {
   const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res =await axios.put(`${API_BASE}/updateCustomer`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, message: err.message || "Unknown error" };
  }
};

//purchase order
export const AddUnit = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addUnits`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetUnits = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getUnits`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelUnits = async (id) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/delUnits/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const verifyPassword = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/verifyPassword`, data);
    return res.data; // { valid: true/false }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const changePassword = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/changePassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const deleteUser = async (username) => {
  try {
     const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.delete(`${API_BASE}/users/${username}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getRecoveryEmail = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/getRecoveryEmail`, data);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getAdminDashboard = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/getAdminDashboard`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const notifications = async () => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
     const res = await axios.get(`${API_BASE}/notifications`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const clearNotification = async (ids) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/clearNotifications`, { ids });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const addPath = async (data) => {
  try {
    const API_BASE =await getDynamicBaseURL();
    console.log("API_BASE in loginUser:", API_BASE);
    
    const res = await axios.post(`${API_BASE}/addPath`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data; 
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, message: err.message || "Unknown error" };
  }
};