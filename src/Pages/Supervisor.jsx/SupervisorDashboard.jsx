import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../../ContextApi/AuthContext';

const SupervisorDashboard = () => {
  const { backendURL } = useContext(AuthContext);
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch(`${backendURL}/api/supervisor/detail?email=${email}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "token": localStorage.getItem("token")
          }
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (data.success) {
          setUserDetail(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [backendURL]);

  // Calculate financial data from userDetail
  const financialData = useMemo(() => {
    if (!userDetail) return {
      allocated: 0,
      spent: 0,
      remaining: 0
    };

    return {
      allocated: userDetail.total_payment || 0,
      spent: userDetail.total_expense || 0,
      remaining: (userDetail.total_payment || 0) - (userDetail.total_expense || 0)
    };
  }, [userDetail]);

  // Expense summary data
  const expenseSummary = useMemo(() => [
    { type: 'Materials', amount: 95000, color: 'bg-blue-500' },
    { type: 'Labor', amount: 65000, color: 'bg-green-500' },
    { type: 'Equipment', amount: 15000, color: 'bg-yellow-500' },
    { type: 'Miscellaneous', amount: 12500, color: 'bg-red-500' }
  ], []);

  // Calculate percentages for chart
  const { expenseData, totalSpent } = useMemo(() => {
    const total = expenseSummary.reduce((sum, item) => sum + item.amount, 0);
    const data = expenseSummary.map(item => ({
      ...item,
      percentage: Math.round((item.amount / total) * 100)
    }));
    return { expenseData: data, totalSpent: total };
  }, [expenseSummary]);

  // Recent activities data
  const recentActivities = useMemo(() => [
    { id: 1, action: 'Updated Site Progress', date: '2023-05-15 14:30', project: 'Interior Work - Floor 3' },
    { id: 2, action: 'Submitted Expense', date: '2023-05-15 11:15', amount: 12500, category: 'Materials' },
    { id: 3, action: 'Received Funds', date: '2023-05-14 09:45', amount: 50000 },
    { id: 4, action: 'Updated Site Progress', date: '2023-05-13 16:20', project: 'Civil Work - Foundation' },
    { id: 5, action: 'Submitted Expense', date: '2023-05-12 10:05', amount: 32000, category: 'Labor' }
  ], []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Supervisor Dashboard</h1>
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FinancialCard 
          title="Allocated Amount" 
          amount={financialData.allocated} 
          borderColor="border-blue-500"
        />
        <FinancialCard 
          title="Spent Amount" 
          amount={financialData.spent} 
          borderColor="border-red-500"
        />
        <FinancialCard 
          title="Remaining Amount" 
          amount={financialData.remaining} 
          borderColor="border-green-500"
        />
      </div>

      {/* Chart Section */}
      <ExpenseChart expenseData={expenseData} totalSpent={totalSpent} />

      {/* Recent Activities */}
      <RecentActivitiesTable activities={recentActivities} />
    </div>
  );
};

// Extracted components for better readability and reusability

const FinancialCard = ({ title, amount, borderColor }) => (
  <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${borderColor}`}>
    <h3 className="text-sm md:text-base font-medium text-gray-500">{title}</h3>
    <p className="text-xl md:text-2xl font-bold text-gray-800">
      ₹{amount.toLocaleString('en-IN')}
    </p>
  </div>
);

const ExpenseChart = ({ expenseData, totalSpent }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-6">
    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Expense Type-wise Summary</h2>
    <div className="flex flex-col md:flex-row items-center">
      <div className="w-full md:w-1/2 mb-4 md:mb-0">
        <div className="h-64 md:h-48 lg:h-64">
          <div className="flex items-end h-full space-x-2">
            {expenseData.map((item) => (
              <div key={item.type} className="flex flex-col items-center flex-1">
                <div 
                  className={`${item.color} w-full rounded-t-sm transition-all duration-300`}
                  style={{ height: `${item.percentage}%` }}
                ></div>
                <span className="text-xs mt-1 text-gray-600 text-center">{item.type}</span>
                <span className="text-xs font-medium">₹{item.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {expenseData.map((item) => (
            <div key={item.type} className="flex items-center">
              <div className={`w-4 h-4 ${item.color} rounded mr-2`}></div>
              <span className="text-sm text-gray-700">{item.type}:</span>
              <span className="text-sm font-medium ml-1">
                ₹{item.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RecentActivitiesTable = ({ activities }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{activity.date}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {activity.project && <span>{activity.project}</span>}
                {activity.amount && <span>₹{activity.amount.toLocaleString('en-IN')}</span>}
                {activity.category && <span> ({activity.category})</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SupervisorDashboard;