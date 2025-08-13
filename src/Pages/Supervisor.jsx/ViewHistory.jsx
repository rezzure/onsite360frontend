import React, { useContext, useEffect, useState } from 'react';
import { FiDollarSign, FiCheckCircle, FiXCircle, FiCalendar, FiClock, FiCamera } from 'react-icons/fi';
import { AuthContext } from '../../ContextApi/AuthContext';

const ViewHistory = () => {
  const {backendURL} = useContext(AuthContext)
  const[progressLog,setProgressLog] = useState([])
  const [expenseHistory,setExpenseHistory] = useState([])
  // Mock data
  const fundDisbursements = [
    { id: 1, date: '2023-05-15', amount: 500000, purpose: 'Initial project funding', approvedBy: 'Admin User' },
    { id: 2, date: '2023-05-20', amount: 250000, purpose: 'Additional materials budget', approvedBy: 'Admin User' },
    { id: 3, date: '2023-06-01', amount: 300000, purpose: 'Q2 project funding', approvedBy: 'Admin User' },
  ];
// progress details
   const getProgressDetails = async () => {
    const _id = localStorage.getItem("_id");
    try {
      const response = await fetch(`${backendURL}/api/getProgress/report/${_id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "token": localStorage.getItem("token")
        },
      });
      const result = await response.json();
      // console.log(result)
      if (result.success) {
        setProgressLog(result.data);
      }
    } catch (error) {
      console.error("Error fetching progress details:", error);
    }
  };

  // Expense History
  const getExpenseHistory=async()=>{
    const _id = localStorage.getItem("_id")
    try{
      const response = await fetch(`${backendURL}/api/getExpense/details/${_id}`,{
        method:"GET",
        headers:{
         "Content-type":"application/json",
         "token":localStorage.getItem("token")
        }
     })
      const result = await response.json()
      console.log(result)
      if(result.success){
        setExpenseHistory(result.data)
      }
    }
    catch(error){
      console.error("Error fetching expense history:", error);
    }
  }

  // date formator
  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US');
  };


  const [activeTab, setActiveTab] = useState('funds');
  useEffect(()=>{
      getProgressDetails()
      getExpenseHistory()
  },[])

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">View History</h1>
      
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('funds')}
          className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'funds' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiDollarSign className="mr-2" />
          Fund Disbursements
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'expenses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiCheckCircle className="mr-2" />
          Expense History
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiCalendar className="mr-2" />
          Progress Log
        </button>
      </div>

      {/* Fund Disbursement List */}
      {activeTab === 'funds' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Fund Disbursement History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Purpose</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Approved By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fundDisbursements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{item.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{item.purpose}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{item.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fundDisbursements.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No fund disbursement records found
            </div>
          )}
        </div>
      )}

      {/* Approved/Rejected Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Expense Approval History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenseHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{item.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.expenseType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'approved' && (
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Rejected
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                      {item.reason && (
                        <span className="ml-2 text-xs text-gray-500 md:hidden">{item.reason}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {item.description}
                      {item.reason && item.status === 'Rejected' && (
                        <div className="text-xs text-red-500 mt-1">Reason: {item.reason}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expenseHistory.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No expense records found
            </div>
          )}
        </div>
      )}

      {/* Progress Update Log */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Site Progress Log</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {progressLog.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                    <FiClock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{item.siteName}</h3>
                      <p className="text-xs text-gray-500">{formatDate(item.updatedAt)}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    {item.photos > 0 && (
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <FiCamera className="mr-1" />
                        {item.photos} photo{item.photos !== 1 ? 's' : ''} attached
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {progressLog.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No progress updates found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewHistory;