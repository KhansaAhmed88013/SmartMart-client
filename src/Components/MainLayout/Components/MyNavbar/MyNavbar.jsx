import styles from "./MyNavbar.module.css";
import { FaBars, FaSearch, FaBell } from "react-icons/fa";
import { useState, useRef, useEffect, useContext } from "react";
import { logOut } from "../../../../UserService";
import { UserContext } from "../../../../Context/UserContext";
import { useDispatch } from "react-redux";
import { clearRole } from "../../../../redux/Role/roleSlice";

function MyNavbar({ sideBarOpen, openSideBar, closeSidebar }) {
  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [openUser, setOpenUser] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenUser(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (!currentUser) return;

    try {
      await logOut({ userId: currentUser.id });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      dispatch(clearRole());
      closeSidebar?.(); // Close sidebar if open
      window.location.href = "/Login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Helper to close sidebar on link click
  const handleLinkClick = () => {
    closeSidebar?.();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.nav_icon} onClick={openSideBar}>
  <FaBars className={styles.icon} />
</div>

      <div className={styles.navbar__left}></div>

      <div className={styles.navbar__right} ref={dropdownRef}>
        <a href="/" onClick={handleLinkClick}>
          <div className={styles.notification}>
            <FaBell className={styles.icon} />
            <span className={styles.badge}>3</span>
          </div>
        </a>
        <a href="/" onClick={handleLinkClick}>
          <FaSearch className={styles.icon} />
        </a>

        {/* User Dropdown */}
        {currentUser && (
          <div className={styles.user_dropdown}>
            <h6
              className={styles.user_toggle}
              onClick={() => setOpenUser(!openUser)}
            >
              👤 Hi! {currentUser.username || currentUser.full_name}
            </h6>

            {openUser && (
              <div className={styles.dropdown_menu}>
                <a href="/AddUser" onClick={handleLinkClick}>
                  Add Users
                </a>
                <a href="/settings" onClick={handleLinkClick}>
                  Settings
                </a>
                <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Log Out
                </a>
              </div>
            )}
          </div>
        )}

        {/* If not logged in, show Login link */}
        {!currentUser && (
          <a href="/Login" className={styles.login_link} onClick={handleLinkClick}>
            Login
          </a>
        )}
      </div>
    </nav>
  );
}

export default MyNavbar;
