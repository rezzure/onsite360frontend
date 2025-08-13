// import React, { useState, useEffect } from 'react';
// import { saveAs } from 'file-saver';

// const Payments = () => {
//   // State for form data
//   const [paymentData, setPaymentData] = useState({
//     amount: '',
//     paymentMethod: 'UPI',
//     transactionId: '',
//     date: new Date().toISOString().split('T')[0],
//     screenshot: null
//   });

//   // State for transactions
//   const [transactions, setTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // Format currency in INR
//   const formatINR = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Fetch transactions - Replace with actual API call
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         // TODO: Replace with actual API endpoint
//         // const response = await axios.get('/api/client/payments');
//         // setTransactions(response.data);
        
//         // Mock data
//         const mockTransactions = [
//           {
//             id: 'txn_001',
//             amount: 2500000,
//             method: 'Bank Transfer',
//             status: 'verified',
//             date: '2023-06-15',
//             transactionId: 'BNK202306151234',
//             screenshot: '/payment-proofs/txn_001.jpg',
//             invoice: '/invoices/inv_001.pdf'
//           },
//           {
//             id: 'txn_002',
//             amount: 1500000,
//             method: 'UPI',
//             status: 'pending',
//             date: '2023-07-01',
//             transactionId: 'UPI202307019876',
//             screenshot: '/payment-proofs/txn_002.jpg',
//             invoice: '/invoices/inv_002.pdf'
//           }
//         ];
        
//         setTransactions(mockTransactions);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching transactions:', error);
//         setIsLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type (image)
//       if (!file.type.match('image.*')) {
//         alert('Please upload an image file (JPEG, PNG)');
//         return;
//       }
      
//       // Validate file size (max 2MB)
//       if (file.size > 2 * 1024 * 1024) {
//         alert('File size should be less than 2MB');
//         return;
//       }

//       setPaymentData(prev => ({
//         ...prev,
//         screenshot: file
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form
//     if (!paymentData.amount || !paymentData.transactionId || !paymentData.screenshot) {
//       alert('Please fill all required fields and upload payment proof');
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       // Create FormData for file upload
//       const formData = new FormData();
//       formData.append('amount', paymentData.amount);
//       formData.append('paymentMethod', paymentData.paymentMethod);
//       formData.append('transactionId', paymentData.transactionId);
//       formData.append('date', paymentData.date);
//       formData.append('screenshot', paymentData.screenshot);

//       // TODO: Replace with actual API endpoint
//       // const response = await axios.post('/api/client/payments', formData, {
//       //   headers: {
//       //     'Content-Type': 'multipart/form-data'
//       //   },
//       //   onUploadProgress: (progressEvent) => {
//       //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//       //     setUploadProgress(progress);
//       //   }
//       // });
      
//       // Simulate API response
//       setTimeout(() => {
//         const newTransaction = {
//           id: `txn_00${transactions.length + 1}`,
//           amount: parseInt(paymentData.amount),
//           method: paymentData.paymentMethod,
//           status: 'pending',
//           date: paymentData.date,
//           transactionId: paymentData.transactionId,
//           screenshot: URL.createObjectURL(paymentData.screenshot),
//           invoice: `/invoices/inv_00${transactions.length + 1}.pdf`
//         };
        
//         setTransactions(prev => [newTransaction, ...prev]);
//         setPaymentData({
//           amount: '',
//           paymentMethod: 'UPI',
//           transactionId: '',
//           date: new Date().toISOString().split('T')[0],
//           screenshot: null
//         });
//         setUploadProgress(0);
//         setIsLoading(false);
//         alert('Payment submitted successfully! Status: Pending Verification');
//       }, 1500);
      
//     } catch (error) {
//       console.error('Error submitting payment:', error);
//       setIsLoading(false);
//       alert('Failed to submit payment. Please try again.');
//     }
//   };

//   // Download invoice
//   const downloadInvoice = (invoiceUrl) => {
//     // TODO: Replace with actual API endpoint for invoice download
//     // axios.get(`/api/client/invoices/${invoiceId}`, { responseType: 'blob' })
//     //   .then(response => {
//     //     const blob = new Blob([response.data], { type: 'application/pdf' });
//     //     saveAs(blob, `invoice_${invoiceId}.pdf`);
//     //   });
    
//     // Mock download
//     saveAs(invoiceUrl, `invoice_${invoiceUrl.split('/').pop()}`);
//   };

//   return (
//     <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
//       <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Payments</h1>
      
//       {/* Add Payment Section */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Payment</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             {/* Amount */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)*</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={paymentData.amount}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter amount"
//                 required
//               />
//             </div>
            
//             {/* Payment Method */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method*</label>
//               <select
//                 name="paymentMethod"
//                 value={paymentData.paymentMethod}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               >
//                 <option value="UPI">UPI</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="Cheque">Cheque</option>
//                 <option value="Cash">Cash</option>
//               </select>
//             </div>
            
//             {/* Transaction ID */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID/Reference*</label>
//               <input
//                 type="text"
//                 name="transactionId"
//                 value={paymentData.transactionId}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter transaction ID"
//                 required
//               />
//             </div>
            
//             {/* Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date*</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={paymentData.date}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>
          
//           {/* Screenshot Upload */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Payment Proof (Screenshot)*</label>
//             <div className="flex items-center">
//               <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
//                 <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="mt-1 text-sm text-gray-600">
//                   {paymentData.screenshot ? paymentData.screenshot.name : 'Choose file (JPEG/PNG, max 2MB)'}
//                 </span>
//                 <input 
//                   type="file" 
//                   accept="image/*"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                   required
//                 />
//               </label>
//               {paymentData.screenshot && (
//                 <button
//                   type="button"
//                   onClick={() => setPaymentData(prev => ({ ...prev, screenshot: null }))}
//                   className="ml-2 p-1 text-red-500 hover:text-red-700"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//             {uploadProgress > 0 && uploadProgress < 100 && (
//               <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//                 <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
//               </div>
//             )}
//           </div>
          
//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//           >
//             {isLoading ? 'Submitting...' : 'Submit Payment'}
//           </button>
//         </form>
//       </div>
      
//       {/* Transaction Status Section */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Transaction Status</h2>
//         {isLoading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : transactions.length === 0 ? (
//           <p className="text-gray-500 text-center py-4">No transactions found</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {transactions.map((txn) => (
//                   <tr key={txn.id}>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(txn.date).toLocaleDateString('en-IN')}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {formatINR(txn.amount)}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                       {txn.method}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                       {txn.transactionId}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         txn.status === 'verified' ? 'bg-green-100 text-green-800' :
//                         txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => window.open(txn.screenshot, '_blank')}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="View Proof"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => downloadInvoice(txn.invoice)}
//                           className="text-green-600 hover:text-green-800"
//                           title="Download Invoice"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Payments;





















// shiv code


import React, { useState, useEffect, useContext } from 'react';
import { saveAs } from 'file-saver';
import { AuthContext } from '../../ContextApi/AuthContext';
import axios from 'axios';

const Payments = () => {
  const { backendURL } = useContext(AuthContext);

  // State for form data with initial values
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'UPI',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    proofDocument: null
  });

  // State for transactions and UI
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Format currency in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      const email = localStorage.getItem("email")
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendURL}/api/getClient/payments?email=${email}`,{
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem("token")
          }
        });
        console.log(response.data)
        setTransactions(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

     

    
    fetchTransactions();
  }, [backendURL]);


  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for amount field
    if (name === 'amount') {
      // Ensure amount is a positive number
      if (value && (isNaN(value) || parseFloat(value) <= 0)) {
        setError('Please enter a valid positive amount');
        return;
      }
    }
    
    // Special handling for transaction ID
    if (name === 'transactionId' && value.trim() === '') {
      setError('Transaction ID cannot be empty');
      return;
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error when input changes
  };

  // Handle file upload with comprehensive validation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG/PNG/JPG only)');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError(`File size should be less than ${maxSize/1024/1024}MB`);
      return;
    }

    setPaymentData(prev => ({
      ...prev,
      proofDocument: file
    }));
    setError(null);
  };

  // Validate form before submission
  const validateForm = () => {
    // Amount validation
    if (!paymentData.amount || isNaN(paymentData.amount)) {
      return 'Please enter a valid amount';
    }
    if (parseFloat(paymentData.amount) <= 0) {
      return 'Amount must be greater than zero';
    }

    // Transaction ID validation
    if (!paymentData.transactionId || paymentData.transactionId.trim() === '') {
      return 'Transaction ID is required';
    }

    // File validation
    if (!paymentData.proofDocument) {
      return 'Payment proof is required';
    }

    return null; // No errors
  };



  

  // Handle form submission with proper error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    const email = localStorage.getItem('email')
    try {
      setIsLoading(true);

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('amount', paymentData.amount);
      formData.append('paymentMethod', paymentData.paymentMethod);
      formData.append('transactionId', paymentData.transactionId);
      formData.append('date', paymentData.date);
      formData.append('proofDocument', paymentData.proofDocument);

      // Submit payment with progress tracking
      const response = await axios.post(
        `${backendURL}/api/client/payments?email=${email}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',// Important for file uploads
            'token':localStorage.getItem('token')

          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );

      console.log(response.data)

      // Update UI with new transaction
      const newPayment = {
        ...response.data.payment,
        method: response.data.payment.paymentMethod,
        date: response.data.payment.paymentDate,
        proofDocument: response.data.payment.proofDocument
      };

      setTransactions(prev => [newPayment, ...prev]);
      setSuccess('Payment submitted successfully! Status: Pending Verification');

      // Reset form
      setPaymentData({
        amount: '',
        paymentMethod: 'UPI',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        proofDocument: null
      });
      setUploadProgress(0);
    } catch (err) {
      console.error('Payment submission error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // Server responded with error status
        setError(err.response.data.message || 'Payment submission failed. Please try again.');
      } else if (err.request) {
        // Request was made but no response
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other errors
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ...existing code...
  // Download invoice with error handling
  // we download the invoice using paymentID
  const downloadInvoice = async (paymentId) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/client/payments/${paymentId}/invoice`,
        {
          responseType: 'blob'
        }
      );

      console.log(response.data)

      const blob = new Blob([response.data], { type: 'text/plain' });
      saveAs(blob, `invoice_${paymentId}.txt`);
      setSuccess('Invoice downloaded successfully');
    } catch (err) {
      console.error('Invoice download error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to download invoice. Please try again.'
      );
    }
  };


  //The viewProof function is now fully fixed. It will always convert any 
  // local file path (including absolute Windows paths and file:// URLs) 
  // to a public HTTP URL that your backend serves

  // View payment proof with validation
  const viewProof = (proofUrl) => {
    if (!proofUrl) {
      setError('Proof document not available');
      return;
    }
    let url = proofUrl;
    // Handle file:/// URLs (absolute local paths)
    if (proofUrl.startsWith('file:///')) {
      // Extract the path after /uploads/ (case-insensitive)
      const match = proofUrl.replace(/\\/g, '/').match(/\/uploads\/(.+)$/i);
      if (match && match[1]) {
        url = `${backendURL}/uploads/${match[1]}`;
      } else {
        setError('Invalid proof document path');
        return;
      }
    } else if (proofUrl.includes('uploads') || proofUrl.includes('payments')) {
      // Handles both relative and absolute Windows paths
      // Find the /uploads/... or /payments/... part
      const regex = /uploads[\\/][\w\\/.-]+|payments[\\/][\w\\/.-]+/i;
      const match = proofUrl.match(regex);
      if (match) {
        url = `${backendURL}/${match[0].replace(/\\/g, '/')}`;
      }
    }
    window.open(url, '_blank');
  };

 



  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Payments
      </h1>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Add Payment Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Add New Payment
        </h2>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)*
              </label>
              <input
                type="number"
                name="amount"
                value={paymentData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                // min="1"
                required
              />
            </div>

            {/* Payment Method Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method*
              </label>
              <select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* Transaction ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID/Reference*
              </label>
              <input
                type="text"
                name="transactionId"
                value={paymentData.transactionId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter transaction ID"
                required
              />
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date*
              </label>
              <input
                type="date"
                name="date"
                value={paymentData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Proof (Screenshot)*
            </label>
            <div className="flex items-center">
              <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-1 text-sm text-gray-600">
                  {paymentData.proofDocument
                    ? paymentData.proofDocument.name
                    : 'Choose file (JPEG/PNG, max 2MB)'}
                </span>
                <input
                  type="file"
                  name="proofDocument"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  required
                />
              </label>
              {paymentData.proofDocument && (
                <button
                  type="button"
                  onClick={() =>
                    setPaymentData(prev => ({ ...prev, proofDocument: null }))
                  }
                  className="ml-2 p-1 text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Payment'
            )}
          </button>
        </form>
      </div>

      {/* Transaction Status Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Transaction Status
        </h2>
        {isLoading && transactions.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn._id || txn.transactionId}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(txn.date || txn.paymentDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatINR(txn.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {txn.method || txn.paymentMethod}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {txn.transactionId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          txn.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : txn.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {txn.status
                          ? txn.status.charAt(0).toUpperCase() + txn.status.slice(1)
                          : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewProof(txn.proofDocument)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Proof"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        {txn.invoice && (
                          <button
                            onClick={() => downloadInvoice(txn.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Download Invoice"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;