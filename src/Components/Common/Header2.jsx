import React from 'react';
import { FaHardHat, FaBuilding, FaUsers, FaChartLine, FaSyncAlt, FaHandshake } from 'react-icons/fa';

const Header2 = () => {
  // Right side images representing company goals
  const companyGoalImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <header className="bg-white border mt-11 text-black py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left Column - Company Details */}
          <div className="lg:w-1/2 space-y-6">
            <div className="flex items-center space-x-3">
              <FaHardHat className="text-4xl text-amber-600" />
              <h1 className="text-4xl md:text-5xl font-bold">
                OnSite<span className="text-amber-600">360</span>
              </h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold">
              Complete Construction Management Solution
            </h2>
            
            <p className="text-lg md:text-xl">
              Streamline your civil and interior projects with our all-in-one platform for progress tracking, financial management, and seamless team collaboration.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <FaUsers className="text-amber-600 mt-1 text-xl" />
                <div>
                  <h3 className="font-bold">Multi-Role Platform</h3>
                  <p className="text-sm">Admin, Supervisor & Client portals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaChartLine className="text-amber-600 mt-1 text-xl" />
                <div>
                  <h3 className="font-bold">Real-Time Finance</h3>
                  <p className="text-sm">Track every rupee with precision</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaSyncAlt className="text-amber-600 mt-1 text-xl" />
                <div>
                  <h3 className="font-bold">Live Updates</h3>
                  <p className="text-sm">Instant site progress reports</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaHandshake className="text-amber-600 mt-1 text-xl" />
                <div>
                  <h3 className="font-bold">Client Focused</h3>
                  <p className="text-sm">Transparent communication</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                Request Demo
              </button>
              <button className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column - Company Goals Images */}
          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={companyGoalImages[0]} 
                  alt="Modern construction" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <p className="text-white font-medium">Project Tracking</p>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-xl mt-8">
                <img 
                  src={companyGoalImages[1]} 
                  alt="Interior design" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <p className="text-white font-medium">Quality Execution</p>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-xl -mt-8">
                <img 
                  src={companyGoalImages[2]} 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <p className="text-white font-medium">Team Collaboration</p>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-xl bg-amber-600 flex items-center justify-center">
                <div className="text-center p-6">
                  <FaBuilding className="text-5xl text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">Your Vision,</h3>
                  <h3 className="text-2xl font-bold text-white">Our Expertise</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;