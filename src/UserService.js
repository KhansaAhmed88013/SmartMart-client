
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
export const AddProduct=async(data)=>{
    try{
        const res=await axios.post(`${API_BASE_URL}/addProducts`,data,{
            Headers:{
                'Content-Type':'application/json'
            }
        })
        return res.data
    }catch(err){
        throw err.response?.data||err.message
    }
}
