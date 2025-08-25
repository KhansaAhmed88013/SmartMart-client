import './MyNavbar.css'
import { FaBars, FaSearch, FaClock, FaBell } from "react-icons/fa";
import { useState, useRef, useEffect } from 'react';

function MyNavbar({ sideBarOpen, openSideBar }) {
    const [openUser, setOpenUser] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenUser(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="nav_icon" onClick={() => openSideBar()}>
                <FaBars className="icon" />
            </div>

            <div className="navbar__left">
            </div>

            <div className="navbar__right" ref={dropdownRef}>
                <a href="/">
                    <div className="notification">
                        <FaBell className="icon" />
                        <span className="badge">3</span>
                    </div>
                </a>
                <a href="/"><FaSearch className="icon" /></a>
                
                {/* User Dropdown */}
                <div className="user-dropdown">
                    <h6 
                        className='user-toggle' 
                        onClick={() => setOpenUser(!openUser)}
                        style={{ cursor: 'pointer' }}
                    >
                        👤 Hi! Admin
                    </h6>
                    
                    {openUser && (
                        <div className="dropdown-menu">
                            <a href="/">Settings</a>
                            <a href="/">Log Out</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default MyNavbar;
