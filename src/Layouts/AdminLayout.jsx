import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiDollarSign,
  FiClipboard,
  FiClock,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { AuthContext } from "../ContextApi/AuthContext";
import { MdHelp } from "react-icons/md";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { handleLogOut } = useContext(AuthContext);

  // Check screen size and adjust sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // logout

  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white shadow-sm h-16 flex items-center px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
        <h1 className="ml-4 text-xl font-bold text-gray-800">
          {localStorage.getItem("name")}
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative z-20 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Desktop Sidebar Header */}
            <div className="hidden md:flex items-center justify-center h-16 px-4 border-b border-gray-200">
              <NavLink
                to="dashboard"
                className="text-xl font-bold text-gray-800"
              >
                {localStorage.getItem("name")}
              </NavLink>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col justify-between items-center ">
              <div className="space-y-1">
                <NavLink
                  to="dashboard"
                  end
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }
                  `}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <FiHome className="w-5 h-5 mr-3" />
                  Dashboard
                </NavLink>

                <NavLink
                  to="fund-management"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }
                  `}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <FiDollarSign className="w-5 h-5 mr-3" />
                  Fund Management
                </NavLink>

                <NavLink
                  to="expense-approval"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }
                  `}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <FiClipboard className="w-5 h-5 mr-3" />
                  Expense Approval
                </NavLink>

                <NavLink
                  to="site-user"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }
                  `}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <FiClock className="w-5 h-5 mr-3" />
                  Site & User Management
                </NavLink>

                <NavLink
                  to="query-support"
                  className={({ isActive }) => `
                     flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200
                       ${
                         isActive
                           ? "bg-blue-50 text-blue-600"
                           : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                       }`}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <MdHelp className="w-5 h-5 mr-3" />
                  Query Support
                </NavLink>
              </div>
            </nav>
            <div className="w-[90%] flex justify-center mb-6 mr-6">
                <div>
                  <NavLink
                  to="login"
                  className={({ isActive }) => `
                    flex items-center px-15 py-3 text-sm font-medium rounded-md transition-all duration-200
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
                  `}
                  onClick={() => handleLogOut()}
                >
                   <FiLogOut className='w-5 h-5 mr-3'/>
                  Log Out
                </NavLink>
              </div>
               
            </div>

            {/* User Info */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">
                    {localStorage.getItem("email")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isMobile ? "pt-16" : ""
          }`}
        >
          <div className="p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
