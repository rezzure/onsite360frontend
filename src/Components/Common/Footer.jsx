import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
// import { GiConstruction, GiTeamwork, GiPayMoney, GiProgress } from 'react-icons/gi';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6 px-4 mt-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-3xl text-amber-500" />
              <h3 className="text-2xl font-bold">OnSite<span className="text-amber-500">360</span></h3>
            </div>
            <p className="text-gray-300">
              Comprehensive construction management platform for civil and interior projects, streamlining workflow and communication.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold border-b border-amber-500 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors flex items-center">
                  <div className="mr-2" /> Project Tracking
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors flex items-center">
                  <div className="mr-2" /> Financial Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors flex items-center">
                  <div className="mr-2" /> Team Collaboration
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors flex items-center">
                  <div className="mr-2" /> Site Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold border-b border-amber-500 pb-2">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaPhone className="text-amber-500 mt-1" />
                <div>
                  <p className="text-gray-300">+91 98765 43210</p>
                  <p className="text-gray-300">+91 98765 43211</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaEnvelope className="text-amber-500 mt-1" />
                <p className="text-gray-300">info@onsite360.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-amber-500 mt-1" />
                <p className="text-gray-300">123 Construction Plaza, Bangalore, India - 560001</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold border-b border-amber-500 pb-2">Newsletter</h4>
            <p className="text-gray-300">
              Subscribe to our newsletter for the latest updates and construction insights.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} OnSite360. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;