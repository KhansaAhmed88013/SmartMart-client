import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css"; // <-- CSS Module
import { getAdminDashboard } from "../../UserService";
import { 
  FaBoxOpen, 
  FaShoppingCart, 
  FaDollarSign, 
  FaFileAlt, 
  FaUsers, 
  FaCashRegister 
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [data,setData]=useState([])
  useEffect(()=>{
    const fetchData=async()=>{
        try{
            const result=await getAdminDashboard()
            setData(result)
        }catch(err){
            console.error(err)
        }
    }
    fetchData()
  },[])

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>

      {/* Stats Section */}
      <div className={styles.dashboardStats}>
        <div className={`${styles.statCard} ${styles.statProducts}`}>
          <FaBoxOpen className={styles.statIcon} />
          <h3>Total Products</h3>
          <p>{data.productsCount}</p>
        </div>

        <div className={`${styles.statCard} ${styles.statSales}`}>
          <FaDollarSign className={styles.statIcon} />
          <h3>Total Sales Today</h3>
          <p>{data.totalSales}</p>
        </div>

        <div className={`${styles.statCard} ${styles.statUsers}`}>
          <FaUsers className={styles.statIcon} />
          <h3>Active Employees</h3>
          <p>{data.usersCount}</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className={styles.dashboardCards}>
        <div className={styles.card} onClick={() => navigate('/allProducts')}>
          <FaBoxOpen className={styles.cardIcon} />
          <h3>Products</h3>
          <p>Manage Products</p>
        </div>

        <div className={styles.card} onClick={() => navigate('/SuppliersInvoice')}>
          <FaShoppingCart className={styles.cardIcon} />
          <h3>Purchases</h3>
          <p>Add or View Purchases</p>
        </div>

        <div className={styles.card} onClick={() => navigate('/DailySalesReport')}>
          <FaDollarSign className={styles.cardIcon} />
          <h3>Sales</h3>
          <p>Manage Sales</p>
        </div>

        <div className={styles.card} onClick={() => navigate('/DailySaleSummary')}>
          <FaFileAlt className={styles.cardIcon} />
          <h3>Reports</h3>
          <p>Generate Reports</p>
        </div>

        <div className={styles.card} onClick={() => navigate('/employeeManagement')}>
          <FaUsers className={styles.cardIcon} />
          <h3>Employees</h3>
          <p>Add or Edit Employees</p>
        </div>

        <div className={styles.card} onClick={() => navigate('/CustomerManagement')}>
          <FaCashRegister className={styles.cardIcon} />
          <h3>Customers</h3>
          <p>Manage Customers</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
