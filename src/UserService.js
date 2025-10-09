import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log(API_BASE_URL);
console.log("Base URL:", process.env.REACT_APP_API_BASE_URL);
//const API_BASE_URL = "http://localhost:3000";
export const AddProduct = async (data) => {
  try {
    const res = await axios.post(`${ API_BASE_URL}/addProducts`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getProducts`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const DelProduct = async (code) => {
  try {
    
     const res = await axios.delete(`${ API_BASE_URL}/delProduct/${code}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const UpdateProduct = async (data) => {
  try {
    const result = await axios.put(`${ API_BASE_URL}/updateProduct`, data, {
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/addSupplier`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getSupplier`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetSupplierReport = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/getSupplierReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const EditSupplier = async (data) => {
  try {
  
     const res =await axios.put(`${ API_BASE_URL}/editSupplier`, data, {
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
    
     const res = await axios.delete(`${ API_BASE_URL}/delSupplier/${id}`);
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/addCategory`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getCategory`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const EditCategory = async (data) => {
  try {
  
     const res =await axios.put(`${ API_BASE_URL}/editCategory`, data, {
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
    
     const res = await axios.delete(`${ API_BASE_URL}/delCategory/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetCategoriesSuppliers = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/getCategoryNsuppliers`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const AddDiscount = async (data) => {
  try {
   
    
    const res = await axios.post(`${ API_BASE_URL}/addDiscount`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/products-basic`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
export const GetDiscount = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/discounts`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
export const UpdateDiscount = async (data) => {
  try {
  
     const res =await axios.put(`${ API_BASE_URL}/editDiscount`, data, {
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
    
     const res = await axios.delete(`${ API_BASE_URL}/delDiscount/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const AddBillDiscount = async (data) => {
  try {
   
    
    const res = await axios.post(`${ API_BASE_URL}/addBillDiscount`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getBillDiscount`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelBillDiscount = async (id) => {
  try {
    
     const res = await axios.delete(`${ API_BASE_URL}/delBillDiscount/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const UpdateBillDiscount = async (data) => {
  try {
  
     const res =await axios.put(`${ API_BASE_URL}/UpdateBillDiscount`, data, {
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/addCategoryDiscount`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getCategoryDiscounts`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelCategoryDiscount = async (id) => {
  try {
    
     const res = await axios.delete(`${ API_BASE_URL}/delCategoryDiscount/${id}`);
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
      `${ API_BASE_URL}/updateCategoryDiscount`,
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
   
     const res = await axios.get(`${ API_BASE_URL}/getnoofdiscount`);
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
        const res=await axios.post(`${ API_BASE_URL}/addInvoice`,data,{
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
        const res=await axios.get(`${ API_BASE_URL}/getInvoiceNo`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

export const getCustomerBillingRecord=async(id)=>{
    try{
        const res=await axios.get(`${ API_BASE_URL}/getCustomerBillingRecord/${id}`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

//Profile
export const getProfile=async()=>{
    try{
        const res=await axios.get(`${ API_BASE_URL}/getProfile`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const getProfileName=async()=>{
    try{
        const res=await axios.get(`${ API_BASE_URL}/getProfileName`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const AddProfile=async(data)=>{
    console.log(data)
    try{
        const res=await axios.post(`${ API_BASE_URL}/addProfile`,data,{
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
   
     const res = await axios.get(`${ API_BASE_URL}/getproductdetail/${barcode}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
}


export const UpdateDiscountStatus=async(data)=>{
    try{
        const res=await axios.put(`${ API_BASE_URL}/editDiscountStatus`,data,{
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/addCustomer`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/DailySalesReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const GetSalesReportData = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/getSalesReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const GetCashierSalesReport = async (username, role) => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/getCashierSalesReport`, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getCashierDashboardReport`, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getStockReport`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getDailyPurchases = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/getDailyPurchaseSummary`);
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/addPurchase`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getPurchase`);
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
  
     const res =await axios.put(`${ API_BASE_URL}/updatePurchaseStatus`, data, {
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
    
     const res = await axios.delete(`${ API_BASE_URL}/delPurchase/${id}`);
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
      `${ API_BASE_URL}/getSalesSummary?from=${data.startDate}&to=${data.endDate}`
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
      `${ API_BASE_URL}/getOTsalesReport`
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
      `${ API_BASE_URL}/getInvoiceReports?from=${data.startDate}&to=${data.endDate}`
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/addusers`, data, {
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
  
     const res = await axios.get(`${ API_BASE_URL}/users`);
     console.log("getUsers response:", res.data);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const loginUser = async (data) => {
  try {
   
    
  
    
    const res = await axios.post(`${ API_BASE_URL}/login`, data, {
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/logout`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getCustomers`);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const GetCutomersReport = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/getCustomerSalesReport`);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

// ✅ delete uses id in URL
export const DeleteCustomer = async (id) => {
  try {
    
     const res = await axios.delete(`${ API_BASE_URL}/delCustomer/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

// ✅ update sends full object in body (must include id)
export const UpdateCustomer = async (id, data) => {
  try {
  
     const res =await axios.put(`${ API_BASE_URL}/updateCustomer`, data, {
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
   
    
    const res = await axios.post(`${ API_BASE_URL}/addUnits`, data, {
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
   
     const res = await axios.get(`${ API_BASE_URL}/getUnits`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const DelUnits = async (id) => {
  try {
    
     const res = await axios.delete(`${ API_BASE_URL}/delUnits/${id}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const verifyPassword = async (data) => {
  try {
   
    
    const res = await axios.post(`${ API_BASE_URL}/verifyPassword`, data);
    return res.data; // { valid: true/false }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};

export const changePassword = async (data) => {
  try {
   
    
    const res = await axios.post(`${ API_BASE_URL}/changePassword`, data, {
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
    
     const res = await axios.delete(`${ API_BASE_URL}/users/${username}`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getRecoveryEmail = async (data) => {
  try {
    const res = await axios.post(`${ API_BASE_URL}/getRecoveryEmail`, data);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const getAdminDashboard = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/getAdminDashboard`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const notifications = async () => {
  try {
   
     const res = await axios.get(`${ API_BASE_URL}/notifications`);
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const clearNotification = async (ids) => {
  try {
   
    
    const res = await axios.post(`${ API_BASE_URL}/clearNotifications`, { ids });
    return res.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
};
export const addPath = async (data) => {
  try {
   
    
    const res = await axios.post(`${ API_BASE_URL}/addPath`, data, {
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
// Send recovery OTP to user's email
export const SendRecoveryEmail = async (email, OTP) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send_recovery_email`, {
      recipient_email: email,
      OTP: OTP,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Error sending OTP";
    throw new Error(errorMessage);
  }
};
// Recover (reset) user password
export const RecoverPassword = async (username, role, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recover-Password`, {
      username,
      role,
      newPassword,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Error resetting password";
    throw new Error(errorMessage);
  }
};
