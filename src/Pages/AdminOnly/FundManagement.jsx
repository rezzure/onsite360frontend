import React, { useEffect, useState, useContext } from 'react';
import { Tab } from '@headlessui/react';
import { AuthContext } from '../../ContextApi/AuthContext';
import ExpenseApproval from './ExpenseApproval';

const FundManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [statuses, setStatuses] = useState({});
  const { backendURL } = useContext(AuthContext);
  
  // State for client payments with loading and error states
  const [clientPayments, setClientPayments] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [paymentError, setPaymentError] = useState(null);


 const handleStatusChange = (paymentId, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [paymentId]: newStatus.toLowerCase() // Ensure consistent lowercase status
    }));
  };



  const handleExpenseStatusUpdate = async (payment) => {
    const { _id} = payment;
    const newStatus = statuses[_id];
    
    if (!newStatus) {
      alert('Please select a status first');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${backendURL}/api/payment/approval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          paymentId: _id,
          status: newStatus
        })
      });
      
      const result = await response.json();
      console.log(result)
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update status');
      }

      // Update local state
      // setPendingExpenses(prev => prev.map(exp => 
      //   exp._id === _id 
      //     ? { 
      //         ...exp, 
      //         status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) 
      //       } 
      //     : exp
      // ));
      
      // Clear the status for this expense
      setStatuses(prev => {
        const newStatuses = { ...prev };
        delete newStatuses[_id];
        return newStatuses;
      });
      getClientPayment()
      
      alert(`Expense status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating expense status:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  
    const [isLoading, setIsLoading] = useState(false);
// const handleExpenseStatusUpdate = async (expenseId, status) => {  }




  const [fundAllocations, setFundAllocations] = useState([
    { _id: 1, site: 'Site A', supervisor: 'John Doe', amount: 200000, date: '2023-06-02', purpose: 'Initial Allocation', status: 'Approved' },
    { _id: 2, site: 'Site B', supervisor: 'Jane Smith', amount: 150000, date: '2023-06-07', purpose: 'Material Purchase', status: 'Approved' },
    { _id: 3, site: 'Site C', supervisor: 'Mike Johnson', amount: 100000, date: '2023-06-12', purpose: 'Labor Payment', status: 'Pending' },
  ]);

  const [ledgerEntries, setLedgerEntries] = useState([
    { _id: 1, date: '2023-06-01', type: 'Credit', from: 'ABC Constructions', to: 'Main Account', amount: 500000, balance: 500000 },
    { _id: 2, date: '2023-06-02', type: 'Debit', from: 'Main Account', to: 'Site A', amount: 200000, balance: 300000 },
    { _id: 3, date: '2023-06-05', type: 'Credit', from: 'XYZ Developers', to: 'Main Account', amount: 750000, balance: 1050000 },
    { _id: 4, date: '2023-06-07', type: 'Debit', from: 'Main Account', to: 'Site B', amount: 150000, balance: 900000 },
    { _id: 5, date: '2023-06-10', type: 'Credit', from: 'PQR Builders', to: 'Main Account', amount: 300000, balance: 1200000 },
    { _id: 6, date: '2023-06-12', type: 'Debit', from: 'Main Account', to: 'Site C', amount: 100000, balance: 1100000 },
  ]);

  // Form states
  const [paymentForm, setPaymentForm] = useState({
    client: '',
    amount: '',
    method: 'UPI',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [allocationForm, setAllocationForm] = useState({
    site: '',
    supervisor: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const expenseApproval = async () => {
    try {
      const response = await fetch(`${backendURL}/api/supervisor/details`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "token":localStorage.getItem('token')
        }
      })
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle form changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAllocationChange = (e) => {
    const { name, value } = e.target;
    setAllocationForm(prev => ({ ...prev, [name]: value }));
  };

  // Fetch client payments
  const getClientPayment = async () => {
    setIsLoadingPayments(true);
    setPaymentError(null);
    try {
      const response = await fetch(`${backendURL}/api/getPayment/detail`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      const result = await response.json();
      
      const formattedPayments = result.data.map(data => ({
        _id: data._id,
        client: data.clientName,
        date: data.transactionDate,
        method: data.mode,
        reference: data.transactionId,
        amount: data.amount,
        status: data.status
      }));
      
      setClientPayments(formattedPayments);
    } catch (error) {
      console.error('Error fetching client payments:', error);
      setPaymentError(error.message);
      setClientPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  // Submit handlers
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      _id: Date.now(), // Temporary ID
      client: paymentForm.client,
      amount: Number(paymentForm.amount),
      date: paymentForm.date,
      method: paymentForm.method,
      reference: paymentForm.reference,
      status: 'Pending'
    };
    setClientPayments([...clientPayments, newPayment]);
    setShowPaymentModal(false);
    setPaymentForm({
      client: '',
      amount: '',
      method: 'UPI',
      reference: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleAllocationSubmit = (e) => {
    e.preventDefault();
    const newAllocation = {
      _id: Date.now(), // Temporary ID
      site: allocationForm.site,
      supervisor: allocationForm.supervisor,
      amount: Number(allocationForm.amount),
      date: allocationForm.date,
      purpose: allocationForm.purpose,
      status: 'Pending'
    };
    setFundAllocations([...fundAllocations, newAllocation]);
    setShowAllocationModal(false);
    setAllocationForm({
      site: '',
      supervisor: '',
      amount: '',
      purpose: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  useEffect(() => {
    getClientPayment();
    expenseApproval()
  }, [backendURL]);

  // Loading component
  if (isLoadingPayments && activeTab === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Fund Management</h1>
      
      {/* Tab Navigation */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
          {['Client Payments', 'Fund Allocation', 'Fund Ledger'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 rounded-md focus:outline-none ${
                  selected ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-2">
          {/* Client Payments Tab */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Client Payments</h2>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Payment
              </button>
            </div>
            
            {paymentError ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{paymentError}</p>
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientPayments.length > 0 ? (
                      clientPayments.map((payment) => (
                        <tr key={payment._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.client}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.method}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.reference}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          {payment.status && (payment.status.toLowerCase() === "approved" || payment.status.toLowerCase() === "rejected") ? (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select 
                          disabled 
                          className='text-gray-300 cursor-not-allowed'
                          value={payment.status.toLowerCase()}
                        >
                          <option value={payment.status.toLowerCase()}>
                            {payment.status}
                          </option>
                        </select>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          className='text-gray-600 outline-none'
                          value={ statuses[payment._id] || ''}
                          onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                        >
                          <option value="">Select One</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleExpenseStatusUpdate(payment)}
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
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          {isLoadingPayments ? 'Loading payments...' : 'No client payments found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Panel>
          
          {/* Fund Allocation Tab */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Fund Allocations</h2>
              <button
                onClick={() => setShowAllocationModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Allocate Funds
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fundAllocations.map((allocation) => (
                      <tr key={allocation._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{allocation.site}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{allocation.supervisor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(allocation.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{allocation.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{allocation.purpose}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            allocation.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {allocation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fundAllocations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No fund allocations recorded
                </div>
              )}
            </div>
          </Tab.Panel>
          
          {/* Fund Ledger Tab */}
          <Tab.Panel>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Fund Ledger</h2>
              <p className="text-sm text-gray-500 mt-1">Complete record of all fund movements</p>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ledgerEntries.map((entry) => (
                      <tr key={entry._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            entry.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.from}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.to}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          entry.type === 'Credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.type === 'Credit' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(entry.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {ledgerEntries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No ledger entries found
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Client Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    id="client"
                    name="client"
                    value={paymentForm.client}
                    onChange={handlePaymentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={paymentForm.amount}
                    onChange={handlePaymentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    id="method"
                    name="method"
                    value={paymentForm.method}
                    onChange={handlePaymentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={paymentForm.reference}
                    onChange={handlePaymentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={paymentForm.date}
                    onChange={handlePaymentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Allocate Funds Modal */}
      {showAllocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Allocate Funds to Site</h3>
                <button onClick={() => setShowAllocationModal(false)} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAllocationSubmit}>
                <div className="mb-4">
                  <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                  <select
                    id="site"
                    name="site"
                    value={allocationForm.site}
                    onChange={handleAllocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Site</option>
                    <option value="Site A">Site A</option>
                    <option value="Site B">Site B</option>
                    <option value="Site C">Site C</option>
                    <option value="Site D">Site D</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                  <select
                    id="supervisor"
                    name="supervisor"
                    value={allocationForm.supervisor}
                    onChange={handleAllocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Supervisor</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Williams">Sarah Williams</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={allocationForm.amount}
                    onChange={handleAllocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <input
                    type="text"
                    id="purpose"
                    name="purpose"
                    value={allocationForm.purpose}
                    onChange={handleAllocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={allocationForm.date}
                    onChange={handleAllocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAllocationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Allocate Funds
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundManagement;