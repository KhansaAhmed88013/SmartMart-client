import styles from "./Navbar_Cashier.module.css";
import { FaBars, FaSearch, FaBell, FaTimes } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { logOut, getProfileName } from "../../UserService";
import { UserContext } from "../../Context/UserContext";
import { useDispatch } from "react-redux";
import { clearRole } from "../../redux/Role/roleSlice";
import { useNavigate } from "react-router-dom";

function Navbar_Cashier() {
  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [profilename, setProfileName] = useState("Smart Super");
  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getname = async () => {
      try {
        const result = await getProfileName();
        setProfileName(result?.shopName || "Name Not Available");
      } catch (error) {
        console.error("Error fetching profile name:", error);
        setProfileName("Name Not Available");
      }
    };
    getname();
  }, []);

const handleLogout = async () => {
  if (!currentUser) return;

  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  try {
    await logOut({ userId: currentUser.id });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    dispatch(clearRole());
    window.location.href = "/recovery/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  return (
    <>
      <nav className={`${styles["navbar-cashier"]}`}>
        {/* Hamburger */}
        <div
          className={`${styles["nav_icon-cashier"]}`}
          onClick={() => setSideOpen(true)}
        >
          <FaBars className={`${styles["icon-cashier"]}`} />
        </div>

        <h3
          onClick={() => navigate("/cashier")}
          className={`${styles["shopname-cashier"]}`}
        >
          {profilename}
        </h3>

        {/* Normal Navbar Links (hidden under 800px) */}
        <div className={`${styles["navbar__left-cashier"]}`}>
          <a href="/cashier/billing">Billing</a>
          <a href="/cashier/userreport">Record</a>
          <a href="/cashier/changePassword">Settings</a>
          {currentUser && (
            <a onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </a>
          )}
          
        </div>

               
          <div className={`${styles["navbar__right-cashier"]}`}>
            {/*
          <a href="/">
            <div className={`${styles["notification-cashier"]}`}>
              <FaBell className={`${styles["icon-cashier"]}`} />
              <span className={`${styles["badge-cashier"]}`}>3</span>
            </div>
          </a>
          <a href="/">
            <FaSearch className={`${styles["icon-cashier"]}`} />
          </a>
          */}

          {currentUser && (
            <h6 className={`${styles["user-toggle-cashier"]}`}>
              👤 Hi! {currentUser.username || currentUser.full_name}
            </h6>
          )}

          {!currentUser && (
            <a
              href="/recovery/login"
              className={`${styles["login-link-cashier"]}`}
            >
              Login
            </a>
          )}
        </div>
      </nav>

      {/* Side Toggle Menu */}
      <div
        className={`${styles["side-toggle"]} ${
          sideOpen ? styles.open : ""
        }`}
      >
        <div className={`${styles["side-header"]}`}>
          <h4>Menu</h4>
          <FaTimes
            className={`${styles["close-icon"]}`}
            onClick={() => setSideOpen(false)}
          />
        </div>
        <a href="/cashier/billing">Billing</a>
          <a href="/cashier/userreport">Record</a>
          <a href="/cashier/changePassword">Settings</a>
          {currentUser && (
          <a onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </a>
        )}
      </div>

      {/* Overlay (click to close) */}
      {sideOpen && (
        <div
          className={`${styles["overlay"]}`}
          onClick={() => setSideOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar_Cashier;
