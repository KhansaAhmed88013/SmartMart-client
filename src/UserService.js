
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

//Products
export const AddProduct=async(data)=>{
    try{
        const res=await axios.post(`${API_BASE_URL}/addProducts`,data,{
            Headers:{
                'Content-Type':'application/json'
            }
        })
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

export const GetProducts=async()=>{
    try{
        const res=await axios.get(`${API_BASE_URL}/getProducts`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

export const DelProduct=async(code)=>{
    try{
        const res=await axios.delete(`${API_BASE_URL}/delProduct/${code}`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage); 
    }
}
export const UpdateProduct=async(data)=>{
    try{
        const result=await axios.put(`${API_BASE_URL}/updateProduct`,data,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        return result.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage); 
    }
}

//Suppier
export const AddSupplier=async(data)=>{
    try{
        const res=await axios.post(`${API_BASE_URL}/addSupplier`,data,{
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
export const GetSuppliers=async(data)=>{
    try{
        const res=await axios.get(`${API_BASE_URL}/getSupplier`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const EditSupplier=async(data)=>{
    try{
        const res=await axios.put(`${API_BASE_URL}/editSupplier`,data,{
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
export const DelSupplier=async(id)=>{
    try{
        const res=await axios.delete(`${API_BASE_URL}/delSupplier/${id}`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage); 
    }
}
//Category
export const CreateCategory=async(data)=>{
    try{
        const res=await axios.post(`${API_BASE_URL}/addCategory`,data,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        return res
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const GetCategories=async()=>{
    try{
        const res=await axios.get(`${API_BASE_URL}/getCategory`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const EditCategory=async(data)=>{
    try{
        const res=await axios.put(`${API_BASE_URL}/editCategory`,data,{
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
export const DelCategory=async(id)=>{
    try{
        const res=await axios.delete(`${API_BASE_URL}/delSupplier/${id}`)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage); 
    }
}
export const GetCategoriesSuppliers=async()=>{
    try{
        const res=await axios.get(`${API_BASE_URL}/getCategoryNsuppliers`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}

//Billing
export const AddInvoice=async(data)=>{
    try{
        const res=await axios.post(`${API_BASE_URL}/addInvoice`,data,{
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
        const res=await axios.get(`${API_BASE_URL}/getInvoiceNo`)
        return res.data
    }catch(err){
         const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
//Profile
export const getProfile=async()=>{
    try{
        const res=await axios.get(`${API_BASE_URL}/getProfile`)
        console.log(res.data)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const getProfileName=async()=>{
    try{
        const res=await axios.get(`${API_BASE_URL}/getProfileName`)
        console.log(res.data)
        return res.data
    }catch(err){
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
    }
}
export const AddProfile=async(data)=>{
    try{
        const res=await axios.post(`${API_BASE_URL}/addProfile`,data,{
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
    const res = await axios.get(`${API_BASE_URL}/getproductdetail/${barcode}`);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw new Error(errorMessage);
  }
}
