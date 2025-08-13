// import React, { useState, useEffect } from 'react';
// import { useContext } from 'react';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
// import { AuthContext } from '../../ContextApi/AuthContext';
// import { useRef } from 'react';

// const  ClientDashboard = () => {
//   const {backendURL} = useContext(AuthContext)
//   const [isLoading, setIsLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({
//     funds: {
//       totalPaid: 0,
//       totalExpenses: 0,
//       lastPayment: null
//     },
//     projectStages: [],
//     expenses: []
//   });

//    const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const chartRef = useRef(null);

// // Fetch dashboard data - API CALL
//  useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         // COMMENT: Replace with actual API endpoint
//         const response = await axios.get(`${backendURL}/api`);
//         setDashboardData(response.data);
        
//         // Mock data for demonstration - remove in production
//         const mockData = {
//           funds: {
//             totalPaid: 8500000, // 85 Lakhs
//             totalExpenses: 9200000, // 92 Lakhs
//             lastPayment: {
//               amount: 1500000, // 15 Lakhs
//               date: '2023-06-15T10:30:00Z',
//               method: 'UPI Transfer'
//             }
//           },
//           projectStages: [
//             { name: 'Planning', completed: 100 },
//             { name: 'Foundation', completed: 100 },
//             { name: 'Structure', completed: 85 },
//             { name: 'Interior', completed: 45 },
//             { name: 'Finishing', completed: 20 }
//           ],
//           expenses: [
//             { category: 'Construction Materials', amount: 4500000, approved: true },
//             { category: 'Labor Charges', amount: 3200000, approved: true },
//             { category: 'Equipment Rental', amount: 1000000, approved: true },
//             { category: 'Miscellaneous', amount: 500000, approved: false }
//           ]
//         };
//         setDashboardData(mockData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);


//   // Format currency in INR
//   const formatINR = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   useEffect(() => {
//     // Simulate API fetch
//     const timer = setTimeout(() => {
//       setDashboardData({
//         funds: {
//           totalPaid: 12500000,
//           lastPayment: {
//             amount: 4500000,
//             date: '2023-06-15',
//             method: 'UPI Transfer'
//           },
//           upcomingPayment: {
//             amount: 3500000,
//             dueDate: '2023-07-20',
//             purpose: 'Interior Finishing'
//           }
//         },
//         projectStages: [
//           { name: 'Planning', status: 'completed', progress: 100 },
//           { name: 'Foundation', status: 'completed', progress: 100 },
//           { name: 'Structure', status: 'in-progress', progress: 85 },
//           { name: 'Interior', status: 'pending', progress: 15 },
//           { name: 'Finishing', status: 'pending', progress: 0 }
//         ],
//         expenses: [
//           { name: 'Materials', value: 4500000, color: '#0088FE' },
//           { name: 'Labour', value: 3800000, color: '#00C49F' },
//           { name: 'Equipment', value: 1200000, color: '#FFBB28' },
//           { name: 'Design', value: 800000, color: '#FF8042' },
//           { name: 'Other', value: 500000, color: '#8884D8' }
//         ]
//       });
//       setIsLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
//       <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Project Dashboard</h1>
      
//       {/* Funds Paid Section */}
//       <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-100">
//         <h2 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Funds Overview</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//           {/* Total Paid Card */}
//           <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
//             <div className="flex items-center">
//               <div className="p-2 rounded-full bg-blue-100 mr-3">
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs sm:text-sm text-gray-500">Total Paid</p>
//                 <p className="text-lg sm:text-xl font-bold text-gray-800">{formatINR(dashboardData.funds.totalPaid)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Last Payment Card */}
//           <div className="bg-green-50 p-3 rounded-lg border border-green-100">
//             <div className="flex items-center">
//               <div className="p-2 rounded-full bg-green-100 mr-3">
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs sm:text-sm text-gray-500">Last Payment</p>
//                 <p className="text-lg sm:text-xl font-bold text-gray-800">{formatINR(dashboardData.funds.lastPayment.amount)}</p>
//                 <p className="text-xs text-gray-500 mt-1">{new Date(dashboardData.funds.lastPayment.date).toLocaleDateString('en-IN')}</p>
//               </div>
//             </div>
//           </div>

//           {/* Upcoming Payment Card */}
//           <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
//             <div className="flex items-center">
//               <div className="p-2 rounded-full bg-yellow-100 mr-3">
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs sm:text-sm text-gray-500">Upcoming Payment</p>
//                 <p className="text-lg sm:text-xl font-bold text-gray-800">{formatINR(dashboardData.funds.upcomingPayment.amount)}</p>
//                 <p className="text-xs text-gray-500 mt-1">Due {new Date(dashboardData.funds.upcomingPayment.dueDate).toLocaleDateString('en-IN')}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Project Stage Summary */}
//       <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-100">
//         <h2 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Project Progress</h2>
//         <div className="space-y-3 sm:space-y-4">
//           {dashboardData.projectStages.map((stage, index) => (
//             <div key={index}>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm font-medium text-gray-700">{stage.name}</span>
//                 <span className={`text-xs font-medium px-2 py-1 rounded-full ${
//                   stage.status === 'completed' ? 'bg-green-100 text-green-800' :
//                   stage.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
//                   'bg-gray-100 text-gray-800'
//                 }`}>
//                   {stage.status.replace('-', ' ')}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
//                 <div 
//                   className={`h-1.5 sm:h-2 rounded-full ${
//                     stage.progress === 100 ? 'bg-green-500' : 
//                     stage.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
//                   }`} 
//                   style={{ width: `${stage.progress}%` }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Expense Summary Chart */}
//       <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
//         <h2 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Expense Breakdown (Approved)</h2>
//         <div className="flex flex-col md:flex-row">
//           <div className="w-full md:w-1/2 h-60 sm:h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={dashboardData.expenses}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={70}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {dashboardData.expenses.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [formatINR(value), 'Amount']} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="w-full md:w-1/2 h-60 sm:h-64 mt-3 sm:mt-0">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={dashboardData.expenses}
//                 margin={{
//                   top: 5,
//                   right: 20,
//                   left: 0,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [formatINR(value), 'Amount']} />
//                 <Legend />
//                 <Bar dataKey="value" name="Amount (₹)" radius={[4, 4, 0, 0]}>
//                   {dashboardData.expenses.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;

















import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../ContextApi/AuthContext';

// Register ChartJS components
Chart.register(...registerables);

const ClientDashboard = () => {
  const {backendURL} = useContext(AuthContext)
  // State for all dashboard data
  const [dashboardData, setDashboardData] = useState({
    funds: {
      totalPaid: 0,
      totalExpenses: 0,
      lastPayment: null
    },
    projectStages: [],
    expenses: []
  });
  const [clientData, setClientData] = useState({
    balance_amount:0,
    lastPayment:0,
    total_expense:0,
    total_payment:0
  })
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  // Fetch dashboard data - API CALL
  useEffect(() => {
    const fetchDashboardData = async () => {
      const email= localStorage.getItem('email')
      console.log(email)
      try {
        setLoading(true);
        
        let response = await fetch(`${backendURL}/api/get/clientDetail?email=${email}`, {
          method:"GET",
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem('token')
          }
        })
        let result = await response.json()
        console.log(result)
        setClientData(prev =>({
          ...prev,
          balance_amount:result.data.balance_amount,
          lastPayment:result.data.lastPayment,
          total_expense:result.data.total_expense,
          total_payment:result.data.total_payment
        }))
        console.log(clientData)
        const mockData = {
          funds: {
            totalPaid: 8500000, // 85 Lakhs
            totalExpenses: 7000000, // 92 Lakhs
            lastPayment: {
              amount: 1500000, // 15 Lakhs
              date: '2023-06-15T10:30:00Z',
              method: 'UPI Transfer'
            }
          },
          projectStages: [
            { name: 'Planning', completed: 100 },
            { name: 'Foundation', completed: 100 },
            { name: 'Structure', completed: 85 },
            { name: 'Interior', completed: 45 },
            { name: 'Finishing', completed: 20 }
          ],
          expenses: [
            { category: 'Construction Materials', amount: 4500000, approved: true },
            { category: 'Labor Charges', amount: 3200000, approved: true },
            { category: 'Equipment Rental', amount: 1000000, approved: true },
            { category: 'Miscellaneous', amount: 500000, approved: false }
          ]
        };
        setDashboardData(mockData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency in Indian style
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate required payment
  const balance = Math.max(0, dashboardData.funds.totalPaid - dashboardData.funds.totalExpenses);

  // Format last payment date in Indian format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Initialize chart when data is loaded
  useEffect(() => {
    if (loading || error) return;

    const approvedExpenses = dashboardData.expenses.filter(exp => exp.approved);
    if (approvedExpenses.length === 0) return;

    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;

    // Destroy previous chart if exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const expenseChartData = {
      labels: approvedExpenses.map(exp => exp.category),
      datasets: [{
        label: 'Expenses (Approved)',
        data: approvedExpenses.map(exp => exp.amount),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    };

    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: expenseChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${formatINR(value)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [loading, error, dashboardData.expenses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const approvedExpenses = dashboardData.expenses.filter(exp => exp.approved);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Client Dashboard</h1>
      
      {/* Funds Paid Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Funds Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Paid */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Total Paid</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {formatINR(clientData.total_payment)}
            </p>
          </div>
          
          {/* Total Expenses */}
          <div className={`p-4 rounded-lg ${
            clientData.total_expense > clientData.total_payment
              ? 'bg-red-50' 
              : 'bg-green-50'
          }`}>
            <h3 className="text-sm font-medium ${
              dashboardData.funds.totalExpenses > dashboardData.funds.totalPaid 
                ? 'text-red-800' 
                : 'text-green-800'
            }">
              Total Expenses
            </h3>
            <p className={`text-2xl font-bold mt-2 ${
              clientData.total_expense > clientData.total_payment
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {formatINR(clientData.total_expense)}
            </p>
          </div>
          
          {/* Balance Payment */}
          <div className={`p-4 rounded-lg ${
            clientData.balance_amount > 0 ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <h3 className={`text-sm font-medium ${
            clientData.balance_amount > 0 ? 'text-green-800' : 'text-red-800'
            }`}>
              Balance Amount
            </h3>
            <p className={`text-2xl font-bold mt-2 ${
              clientData.balance_amount > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatINR(clientData.balance_amount)}
            </p>
          </div>
          
          {/* Last Payment */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Last Payment</h3>
            {clientData.lastPayment ? (
              <div className="mt-2">
                <p className="text-lg font-semibold text-purple-600">
                  {formatINR(clientData.lastPayment)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(clientData.lastPayment)}
                </p>
                {/* <p className="text-sm text-gray-600">
                  Method: {dashboant.method}
                </p> */}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No payment history</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Stage Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Stage Summary</h2>
          <div className="space-y-4">
            {dashboardData.projectStages.map((stage, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                  <span className="text-sm font-medium text-gray-700">{stage.completed}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      stage.completed < 30 ? 'bg-red-500' :
                      stage.completed < 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${stage.completed}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              <span className="text-xs text-gray-600">70-100% Complete</span>
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
              <span className="text-xs text-gray-600">30-69% Complete</span>
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
              <span className="text-xs text-gray-600">0-29% Complete</span>
            </span>
          </div>
        </div>
        
        {/* Expense Summary Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Expense Summary (Approved Only)</h2>
          <div className="h-64">
            {approvedExpenses.length > 0 ? (
              <canvas id="expenseChart"></canvas>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No approved expenses to display
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Expense Breakdown</h3>
            <div className="space-y-2">
              {approvedExpenses.length > 0 ? (
                approvedExpenses.map((expense, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{expense.category}</span>
                    <span className="text-sm font-medium text-gray-800">
                      {formatINR(expense.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No approved expenses</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;