import SupplierView from "./Components/SupplierView/SupplierView";
function SupplierMNG() {
    return ( 
    <>
        <button onClick={()=>window.location.href='/addSuppliers' } style={{margin:'1rem', background:'#489FB5',padding:"7px 10px",color:'white',border:'1px solid #15373fff',borderRadius:'5px',cursor:'pointer'}}>Add Suppliers</button>
        <SupplierView/>
    </> );
}

export default SupplierMNG;