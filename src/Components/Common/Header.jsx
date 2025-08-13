import React, { useState, useEffect } from 'react';
import { FaPhone, FaGlobe, FaTools, FaMoneyBillWave, FaEnvelope, FaChevronDown, FaUser, FaArrowRight } from 'react-icons/fa';
// import { GiCash, GiTeamwork, GiProgression } from 'react-icons/gi';
import { MdEngineering, MdDesignServices } from 'react-icons/md';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Header = () => {
  // Carousel images (using construction/interior related images from Unsplash)
//   const carouselImages = [
//     'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//     'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//     'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//     'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//     'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80'
//   ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === assets.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Navbar (from previous implementation) */}
      <header className=" text-white shadow-md">
        {/* ... Your existing Navbar JSX code here ... */}
      </header>

      {/* Hero Section with Carousel */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Carousel Images */}
        {assets.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={image} 
              alt={`Construction ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-40"></div>
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Revolutionizing Construction Management
              </h1>
              <p className="text-lg md:text-xl mb-8">
                OnSite360 provides comprehensive digital solutions for civil and interior projects. 
                Streamline your workflow with real-time progress tracking, financial management, 
                and seamless communication between all stakeholders.
              </p>
              <Link
                 to='/login'
                className=" hover:text-black w-50 py-3 px-4 border rounded-md text-lg font-semibold flex items-center space-x-2 transition-all duration-300"
              >
                Get Started Now
                <FaArrowRight />
              </Link>
            </div> 
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
          {assets.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-blue-600' : 'bg-white bg-opacity-50'}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;