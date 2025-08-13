import React, { useContext, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { AuthContext } from '../../ContextApi/AuthContext';
import PropTypes from 'prop-types';

const ExpenseApproval = () => {
  const { backendURL } = useContext(AuthContext);
  
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle status change for each expense
  const handleStatusChange = (expenseId, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [expenseId]: newStatus.toLowerCase() // Ensure consistent lowercase status
    }));
  };

  // Filter expenses based on status and search term
  const filteredExpenses = pendingExpenses.filter(expense => {
    const statusMatch = filter === 'all' || 
                       expense.status.toLowerCase() === filter.toLowerCase();
    const searchMatch = searchTerm === '' || 
                       (expense.siteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        expense.supervisorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        expense.expenseType?.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && searchMatch;
  });

  // Handle modal decision submission
  const handleDecision = async () => {
    if (!decision || (decision === 'reject' && !comment)) {
      alert(decision === 'reject' ? 'Please add a comment when rejecting' : 'Please select a decision');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${backendURL}/api/updateExpenseStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          expenseId: selectedExpense._id,
          supervisorEmail: selectedExpense.supervisorEmail,
          status: decision,
          comments: comment
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update status');
      }

      // Update local state
      setPendingExpenses(prev => prev.map(exp => 
        exp._id === selectedExpense._id 
          ? { 
              ...exp, 
              status: decision === 'approve' ? 'Approved' : 'Rejected',
              comments: comment
            } 
          : exp
      ));
      
      setIsModalOpen(false);
      setDecision('');
      setComment('');
      
      alert(`Expense successfully ${decision === 'approve' ? 'approved' : 'rejected'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle inline status update
  const handleExpenseStatusUpdate = async (expense) => {
    const { _id, supervisorEmail } = expense;
    const newStatus = statuses[_id];
    
    if (!newStatus) {
      alert('Please select a status first');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${backendURL}/api/updateExpenseStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          expenseId: _id,
          supervisorEmail: supervisorEmail,
          status: newStatus
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update status');
      }

      // Update local state
      setPendingExpenses(prev => prev.map(exp => 
        exp._id === _id 
          ? { 
              ...exp, 
              status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) 
            } 
          : exp
      ));
      
      // Clear the status for this expense
      setStatuses(prev => {
        const newStatuses = { ...prev };
        delete newStatuses[_id];
        return newStatuses;
      });
      
      alert(`Expense status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating expense status:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get expenses details with cleanup
  useEffect(() => {
    let isMounted = true;
    
    const getExpenseUpdate = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getExpense/detail`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "token": localStorage.getItem("token")
          }
        });
        
        if (!isMounted) return;
        
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setPendingExpenses(result.data);
        } else {
          throw new Error(result.message || 'Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        alert(`Error: ${error.message}`);
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    getExpenseUpdate();
    
    return () => {
      isMounted = false;
    };
  }, [backendURL]);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading expenses...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Expense Approval</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === f 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="relative mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.siteName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.supervisorName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.amount || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.expenseType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        expense.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : expense.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status || 'Pending'}
                      </span>
                    </td>

                    {expense.status && (expense.status.toLowerCase() === "approved" || expense.status.toLowerCase() === "rejected") ? (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select 
                          disabled 
                          className='text-gray-300 cursor-not-allowed'
                          value={expense.status.toLowerCase()}
                        >
                          <option value={expense.status.toLowerCase()}>
                            {expense.status}
                          </option>
                        </select>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          className='text-gray-600 outline-none'
                          value={statuses[expense._id] || ''}
                          onChange={(e) => handleStatusChange(expense._id, e.target.value)}
                        >
                          <option value="">Select One</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleExpenseStatusUpdate(expense)}
                        className={`text-blue-600 hover:text-blue-900 ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Submitting...' : 'Submit'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No expenses found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Expense Review Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {selectedExpense && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Dialog.Title className="text-xl font-bold text-gray-800">
                      Expense Review - {selectedExpense.siteName || 'N/A'}
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted by {selectedExpense.supervisorName || 'Unknown'} on {' '}
                      {selectedExpense.date ? new Date(selectedExpense.date).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Expense Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="text-gray-800">{selectedExpense.expenseType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-gray-800">{formatCurrency(selectedExpense.amount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-gray-800">{selectedExpense.description || 'No description'}</p>
                      </div>
                      {selectedExpense.comments && (
                        <div>
                          <p className="text-sm text-gray-500">Previous Comments</p>
                          <p className="text-gray-800">{selectedExpense.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Receipt</h3>
                    <div className="border border-gray-200 rounded-md p-4 flex items-center justify-center bg-gray-50">
                      {selectedExpense.receipt ? (
                        <img 
                          src={selectedExpense.receipt} 
                          alt="Expense receipt" 
                          className="max-h-64 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Receipt+Not+Available';
                          }}
                        />
                      ) : (
                        <div className="text-gray-500 text-center py-10">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-2">No receipt attached</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Approval Decision</h3>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setDecision('approve')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white ${
                          decision === 'approve' ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setDecision('reject')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white ${
                          decision === 'reject' ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                    
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Comments {decision === 'reject' && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        id="comment"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add comments..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required={decision === 'reject'}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setDecision('');
                          setComment('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDecision}
                        disabled={!decision || (decision === 'reject' && !comment)}
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                          decision === 'approve' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        } ${(!decision || (decision === 'reject' && !comment)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Processing...' : 'Submit Decision'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

ExpenseApproval.propTypes = {
  backendURL: PropTypes.string.isRequired
};

export default ExpenseApproval;