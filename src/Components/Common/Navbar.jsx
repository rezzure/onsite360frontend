import React, { useState } from 'react';
import { FaPhone, FaGlobe, FaUser, FaBars, FaChevronDown, FaChevronRight, FaTimes } from 'react-icons/fa';
import { GiHammerNails, GiMoneyStack, GiEnvelope, GiHouse, GiProgression, GiPayMoney } from 'react-icons/gi';
import { MdDesignServices, MdEngineering, MdContactPhone } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState(null);

  // Menu items data
  const menuItems = [
    {
      name: "Our Services",
      icon: <GiHammerNails className="mr-2" />,
      arrowIcon: <FaChevronDown className="ml-2 text-xs" />,
      submenu: [
        { 
          title: "Civil Construction", 
          description: "Complete civil engineering solutions",
          icon: <MdEngineering className="text-white mr-2 text-lg" />
        },
        { 
          title: "Interior Projects", 
          description: "End-to-end interior execution",
          icon: <GiHouse className="text-white mr-2 text-lg" />
        },
        { 
          title: "Progress Tracking", 
          description: "Real-time site updates",
          icon: <GiProgression className="text-white mr-2 text-lg" />
        }
      ]
    },
    {
      name: "Pricing",
      icon: <GiMoneyStack className="mr-2" />,
      arrowIcon: <FaChevronDown className="ml-2 text-xs" />,
      submenu: [
        { 
          title: "Basic Plan", 
          description: "Essential features for small projects",
          icon: <GiPayMoney className="text-white mr-2 text-lg" />
        },
        { 
          title: "Professional", 
          description: "Complete features for growing businesses",
          icon: <GiPayMoney className="text-white mr-2 text-lg" />
        },
        { 
          title: "Enterprise", 
          description: "Custom solutions for large operations",
          icon: <GiPayMoney className="text-white mr-2 text-lg" />
        }
      ]
    },
    {
      name: "Contact Us",
      icon: <GiEnvelope className="mr-2" />,
      arrowIcon: <FaChevronDown className="ml-2 text-xs" />,
      submenu: [
        { 
          title: "Support", 
          description: "+91 98765 43210",
          icon: <MdContactPhone className="text-white mr-2 text-lg" />
        },
        { 
          title: "Email", 
          description: "support@onsite360.com",
          icon: <MdContactPhone className="text-white mr-2 text-lg" />
        },
        { 
          title: "Office", 
          description: "Bangalore, India",
          icon: <MdContactPhone className="text-white mr-2 text-lg" />
        }
      ]
    }
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-3">
            {/* Company Name */}
            <div className="text-2xl font-bold font-serif">OnSite360</div>

            {/* Right Side - Contact and Login */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <FaGlobe className="text-white" />
                <span>IND</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <FaPhone className="text-white" />
                <span>+91 {Math.floor(9000000000 + Math.random() * 1000000000).toString().replace(/(\d{5})(\d{5})/, '$1 $2')}</span>
              </div>
              <Link to='/login' className="border hover:bg-white hover:text-black px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
                <FaUser />
                <span>Login</span>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FaBars size={24} />
              </button>
            </div>
          </div>

          {/* Secondary Navigation - Desktop */}
          <div className="hidden md:block py-2 border-t border-gray-700">
            <div className="flex space-x-8 relative">
              {menuItems.map((item, index) => (
                <div 
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <button className="flex items-center py-2 px-1 text-white hover:text-white transition-colors">
                    {item.icon}
                    <span>{item.name}</span>
                    {item.arrowIcon}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {hoveredItem === index && (
                    <div className="absolute left-0 mt-0 w-64 bg-gray-800 rounded-b-md shadow-xl z-50 border-t-2 border-white">
                      <div className="p-4 space-y-3">
                        {item.submenu.map((subItem, subIndex) => (
                          <div 
                            key={subIndex} 
                            className="flex items-start space-x-3 hover:bg-gray-700 p-3 rounded cursor-pointer transition-colors"
                          >
                            {subItem.icon}
                            <div>
                              <h4 className="font-semibold">{subItem.title}</h4>
                              <p className="text-sm text-gray-300">{subItem.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu - Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-70"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-72 bg-gray-900 shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
              <div className="p-4">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                  <div className="text-xl font-bold">OnSite360</div>
                  <button 
                    className="text-white focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                
                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <div key={index} className="mb-2">
                      <button 
                        className="flex items-center justify-between w-full text-left py-3 px-2 text-white hover:bg-gray-800 rounded"
                        onClick={() => setMobileExpandedItem(mobileExpandedItem === index ? null : index)}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.name}</span>
                        </div>
                        <FaChevronRight className={`transition-transform ${mobileExpandedItem === index ? 'transform rotate-90' : ''}`} />
                      </button>
                      
                      {/* Mobile Submenu */}
                      {mobileExpandedItem === index && (
                        <div className="ml-8 mt-1 mb-3 space-y-3">
                          {item.submenu.map((subItem, subIndex) => (
                            <div 
                              key={subIndex} 
                              className="flex items-start space-x-3 p-2 text-gray-300 hover:bg-gray-800 rounded"
                            >
                              {subItem.icon}
                              <div>
                                <h4 className="font-medium">{subItem.title}</h4>
                                <p className="text-sm">{subItem.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Contact Info in Mobile Menu */}
                <div className="mt-8 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3 p-2">
                    <FaGlobe className="text-amber-500" />
                    <span>India (IND)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2">
                    <FaPhone className="text-amber-500" />
                    <span>+91 {Math.floor(9000000000 + Math.random() * 1000000000).toString().replace(/(\d{5})(\d{5})/, '$1 $2')}</span>
                  </div>
                  <button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors">
                    <FaUser />
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;