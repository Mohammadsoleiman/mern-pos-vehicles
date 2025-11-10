// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import ClerkSidebar from "../components/clerk/ClerkSidebar";
// import { Menu, Bell } from "lucide-react";
// import { useSettings } from "../context/SettingsContext"; // ✅ Theme from DB
// import "../styles/clerk/cashier.css";

// const Cashier = () => {
//   const navigate = useNavigate();
//   const { settings } = useSettings(); 

//   // ✅ Apply Theme Based on User's Own Settings
//   const themeClass = settings.theme === "dark" ? "dark-theme" : "light-theme";

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   const [notifications, setNotifications] = useState([
//     { id: 1, message: "New sale completed", read: false, link: "/cashier/sales" },
//     { id: 2, message: "Vehicle stock is low", read: false, link: "/cashier/vehicles" },
//     { id: 3, message: "Customer updated profile", read: false, link: "/cashier/customers" },
//   ]);

//   const notifRef = useRef(null);

//   useEffect(() => {
//     const closeDropdown = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setNotificationsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", closeDropdown);
//     return () => document.removeEventListener("mousedown", closeDropdown);
//   }, []);

//   const handleNotificationClick = (notif) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
//     );
//     if (notif.link) navigate(notif.link);
//     setNotificationsOpen(false);
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   return (
//     <div className={`cashier-layout ${themeClass}`}>
//       <ClerkSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <div className="cashier-main">
//         <header className="cashier-header">
//           <div className="header-content">
//             <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn">
//               <Menu size={24} />
//             </button>

//             <div className="header-actions">
//               <div className="notification-wrapper" ref={notifRef}>
//                 <button
//                   className="notification-btn"
//                   onClick={() => setNotificationsOpen(!notificationsOpen)}
//                 >
//                   <Bell size={22} />
//                   {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
//                 </button>

//                 {notificationsOpen && (
//                   <div className="notification-dropdown">
//                     {notifications.map((notif) => (
//                       <div
//                         key={notif.id}
//                         className={`notification-item ${notif.read ? "read" : ""}`}
//                         onClick={() => handleNotificationClick(notif)}
//                       >
//                         {notif.message}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="profile-badge">
//                 <div className="profile-avatar"><span>CK</span></div>
//                 <span className="profile-name">Clerk</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* ✅ Child Pages */}
//         <main className="cashier-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Cashier;
// src/pages/Cashier.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import ClerkSidebar from "../components/clerk/ClerkSidebar";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import "../styles/clerk/cashier.css";

const Cashier = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();

  // ✅ لو مش أدمن → دايمًا Light

   const themeClass = settings.theme === "dark" ? "dark-theme" : "light-theme";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New sale completed", read: false, link: "/cashier/sales" },
    { id: 2, message: "Vehicle stock is low", read: false, link: "/cashier/vehicles" },
    { id: 3, message: "Customer updated profile", read: false, link: "/cashier/customers" },
  ]);

  const notifRef = useRef(null);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.link) navigate(notif.link);
    setNotificationsOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`cashier-layout ${themeClass}`}>
      <ClerkSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="cashier-main">
        <header className="cashier-header">
          <div className="header-content">
            <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn">
              <Menu size={24} />
            </button>

            <div className="header-actions">
              <div className="notification-wrapper" ref={notifRef}>
                <button
                  className="notification-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>

                {notificationsOpen && (
                  <div className="notification-dropdown">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-item ${notif.read ? "read" : ""}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        {notif.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-badge">
                <div className="profile-avatar"><span>CK</span></div>
                <span className="profile-name">Clerk</span>
              </div>
            </div>
          </div>
        </header>

        <main className="cashier-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Cashier;
