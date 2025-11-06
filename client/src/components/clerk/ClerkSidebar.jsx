// // src/components/clerk/ClerkSidebar.jsx
// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   Users,
//   BarChart3,
//   Settings,
//   LogOut,
//   User,
//   ChevronRight
// } from 'lucide-react';
// // import '../../styles/clerk/ClerkSidebareee.css';

// const ClerkSidebar = ({ isOpen, onClose }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const menuItems = [
//     { path: '/cashier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//     { path: '/cashier/vehicles', icon: Package, label: 'Vehicles' },
//     { path: '/cashier/sales', icon: ShoppingCart, label: 'Sales' },
//     { path: '/cashier/customers', icon: Users, label: 'Customers' },
//     { path: '/cashier/reports', icon: BarChart3, label: 'Reports' },
//     { path: '/cashier/settings', icon: Settings, label: 'Settings' }
//   ];

//   return (
//     <>
//       {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

//       <aside className={`clerk-sidebar ${isOpen ? 'open' : ''}`}>
        
//         {/* Header */}
//         <div className="sidebar-header">
//           <div className="sidebar-user">
//             <div className="user-avatar">
//               <User size={20} />
//             </div>
//             <div className="user-details">
//               <p className="user-name">{user?.name || 'Clerk User'}</p>
//               <p className="user-role">{user?.role?.name || user?.role || 'clerk'}</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="sidebar-nav">
//           <ul className="nav-menu">
//             {menuItems.map((item) => (
//               <li key={item.path} className="nav-item">
//                 <NavLink
//                   to={item.path}
//                   onClick={() => window.innerWidth < 1024 && onClose?.()}
//                   className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
//                 >
//                   <item.icon size={22} className="nav-icon" />
//                   <div className="nav-content">
//                     <p className="nav-label">{item.label}</p>
//                   </div>
//                   <ChevronRight size={16} className="nav-arrow" />
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Footer */}
//         <div className="sidebar-footer">
//           <button onClick={handleLogout} className="logout-btn">
//             <LogOut size={22} />
//             <span>Logout</span>
//           </button>
//         </div>

//       </aside>
//     </>
//   );
// };

// export default ClerkSidebar;
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronRight
} from 'lucide-react';
// import '../../styles/clerk/ClerkSidebar.css';

const ClerkSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/cashier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/cashier/vehicles', icon: Package, label: 'Vehicles' },
    { path: '/cashier/sales', icon: ShoppingCart, label: 'Sales' },
    { path: '/cashier/customers', icon: Users, label: 'Customers' },
    { path: '/cashier/reports', icon: BarChart3, label: 'Reports' },
    { path: '/cashier/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`clerk-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Clerk User'}</p>
              {/* <p className="user-role">{user?.role?.name || user?.role || 'clerk'}</p> */}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map(({ path, icon: Icon, label }) => (
              <li key={path} className="nav-item">
                <NavLink
                  to={path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => window.innerWidth < 1024 && onClose?.()}
                >
                  <Icon size={22} className="nav-icon" />
                  <span>{label}</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default ClerkSidebar;
