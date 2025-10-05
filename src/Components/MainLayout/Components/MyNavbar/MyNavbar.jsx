import styles from "./MyNavbar.module.css";
import { FaBars, FaBell } from "react-icons/fa";
import { useState, useRef, useEffect, useContext } from "react";
import { logOut, notifications as fetchNotifications } from "../../../../UserService";
import { UserContext } from "../../../../Context/UserContext";
import { useDispatch } from "react-redux";
import { clearRole } from "../../../../redux/Role/roleSlice";

function MyNavbar({ sideBarOpen, openSideBar, closeSidebar }) {
  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [openUser, setOpenUser] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // <- state for badge
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

  // Fetch notification count
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNotifications();
        // Count only unread notifications
        const unreadCount = data.filter((note) => !note.is_read).length;
        setNotificationCount(unreadCount);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchData();
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
      closeSidebar?.(); 
      window.location.href = "/recovery/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
        <a href="/notifications" onClick={handleLinkClick}>
          <div className={styles.notification}>
            <FaBell className={styles.icon} />
            {notificationCount > 0 && (
              <span className={styles.badge}>{notificationCount}</span>
            )}
          </div>
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

        {!currentUser && (
          <a href="/recovery/login" className={styles.login_link} onClick={handleLinkClick}>
            Login
          </a>
        )}
      </div>
    </nav>
  );
}

export default MyNavbar;
