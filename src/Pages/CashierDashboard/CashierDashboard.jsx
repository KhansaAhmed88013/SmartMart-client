import "./CashierDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaCashRegister, FaFileInvoice, FaCogs, FaCalendarDay } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { getCashierDashboardReport } from "../../UserService";


function CashierDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [todayBills, setTodayBills] = useState(0);

  
  useEffect(() => {
      const fetchData = async () => {
        try {
          const username=currentUser.username
          const role=currentUser.role
          const result = await getCashierDashboardReport(username,role);
          setTodayBills(result);
        } catch (err) {
          console.log(err);
         }
      };
      fetchData();
    }, []);
  const sections = [
    { title: `Today's Bills : ${todayBills.count}`, icon: <FaCalendarDay />, desc: `${todayBills.count} bills created today`, route: "/cashier/userreport", color: "card-purple" },
    { title: "Billing", icon: <FaCashRegister />, desc: "Create new bills / POS", route: "/cashier/billing", color: "card-blue" },
    { title: "Billing Records", icon: <FaFileInvoice />, desc: "View past invoices", route: "/cashier/userreport", color: "card-green" },
    ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Cashier Dashboard</h1>
      <div className="dashboard-grid">
        {sections.map((sec) => (
          <div key={sec.title} className={`dashboard-card ${sec.color}`} onClick={() => navigate(sec.route)}>
            <div className="icon-circle">{sec.icon}</div>
            <h2>{sec.title}</h2>
            <p>{sec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CashierDashboard;
