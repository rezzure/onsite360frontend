import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../ContextApi/AuthContext';

const ExpenseEntry = () => {
  const { backendURL } = useContext(AuthContext);
  const [userDetail, setUserDetail] = useState({
    allocated: 0,
    spent: 0,
    remaining: 0,
    site: []
  });

  const [details, setDetails] = useState({
    expenseType: "",
    site: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    status: "submitted"
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const expenseTypes = [
    'Materials',
    'Labour',
    'Equipment',
    'Transportation',
    'Miscellaneous'
  ];

  const userData = async () => {
    setIsLoading(true);
    const email = localStorage.getItem("email");
    try {
      const response = await fetch(`${backendURL}/api/supervisor/detail?email=${email}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "token": localStorage.getItem("token")
        }
      });
      const data = await response.json();
      if (data.success) {
        setUserDetail({
          allocated: (data.data.total_payment || 0),
          spent: (data.data.total_expense || 0),
          remaining: (data.data.total_payment || 0)-(data.data.total_expense || 0),
          site: data.data.site_name || []
        });
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  const handleChange = (e) => {
    setDetails({...details, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (validTypes.includes(file.type)) {
        setImage(file);
      } else {
        alert('Please upload a JPEG, PNG, or PDF file');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!details.expenseType) newErrors.expenseType = 'Expense type is required';
    if (!details.site) newErrors.site = 'Site selection is required';
    if (!details.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(details.amount)) newErrors.amount = 'Amount must be a number';
    else if (parseFloat(details.amount) > userDetail.remaining) {
      newErrors.amount = `Amount exceeds remaining balance (₹${userDetail.remaining.toLocaleString()})`;
    }
    if (!details.description) newErrors.description = 'Description is required';
    if (!details.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('expenseType', details.expenseType);
    formData.append('amount', details.amount);
    formData.append('description', details.description);
    formData.append('date', details.date);
    formData.append('site', details.site);
    formData.append('status', details.status);
    if (image) formData.append("image", image);
    formData.append("supervisor_id", localStorage.getItem("_id"));
    formData.append("supervisorName", localStorage.getItem("name"));
    formData.append("supervisorEmail", localStorage.getItem("email"));

    try {
      const response = await fetch(`${backendURL}/api/expense/detail`, {
        method: "POST",
        headers: {
          'token': localStorage.getItem("token")
        },
        body: formData
      });
      const result = await response.json();
      console.log(result)
      
      if (result.success) {
        setSubmissionStatus('success');
        // Reset form
        setDetails({
          expenseType: '',
          site: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          status: 'submitted'
        });
        setImage(null);
        // Refresh user data
        await userData();
      } else {
        throw new Error(result.message || 'Failed to submit expense');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Expense Entry</h1>
      
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <h3 className="text-sm md:text-base font-medium text-gray-500">Allocated Amount</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800">₹{userDetail.allocated.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <h3 className="text-sm md:text-base font-medium text-gray-500">Spent Amount</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800">₹{userDetail.spent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <h3 className="text-sm md:text-base font-medium text-gray-500">Remaining Amount</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800">₹{userDetail.remaining.toLocaleString()}</p>
        </div>
      </div>

      {/* Expense Entry Form */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">New Expense Entry</h2>
        
        {submissionStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Expense submitted successfully!
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Error submitting expense. Please try again.
          </div>
        )}

        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Expense Type */}
            <div>
              <label htmlFor="expenseType" className="block text-sm font-medium text-gray-700 mb-1">
                Expense Type <span className="text-red-500">*</span>
              </label>
              <select
                id="expenseType"
                name="expenseType"
                value={details.expenseType}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.expenseType ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              >
                <option value="">Select Expense Type</option>
                {expenseTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.expenseType && <p className="mt-1 text-sm text-red-500">{errors.expenseType}</p>}
            </div>

            {/* Site Name */}
            <div>
              <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                Site Name <span className="text-red-500">*</span>
              </label>
              <select
                id="site"
                name="site"
                value={details.site}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.site ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading || userDetail.site.length === 0}
              >
                <option value="">Select site</option>
                {userDetail.site.map((siteName, index) => (
                  <option key={index} value={siteName}>{siteName}</option>
                ))}
              </select>
              {errors.site && <p className="mt-1 text-sm text-red-500">{errors.site}</p>}
              {userDetail.site.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">No sites available</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={details.amount}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter amount"
                disabled={isLoading}
              />
              {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
              {details.amount && !errors.amount && (
                <p className="mt-1 text-sm text-gray-500">
                  Remaining after this expense: ₹{(userDetail.remaining - parseFloat(details.amount)).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={details.date}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              />
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>

            {/* Bill Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Bill (Optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isLoading}
              />
              {image && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected file: {image.name} ({(image.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={details.description}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter expense description"
              disabled={isLoading}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Status (read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="p-2 bg-gray-100 rounded-md inline-block">
              <span className="font-medium">{details.status}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Status will be updated after admin review</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Expense'}
            </button>
          </div>
        </form>
      </div>

      {/* Validation Rules */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Validation Rules</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>All fields marked with <span className="text-red-500">*</span> are required</li>
          <li>Expense amount cannot exceed the remaining balance (₹{userDetail.remaining.toLocaleString()})</li>
          <li>Bill upload must be JPEG, PNG, or PDF (max 5MB)</li>
          <li>All expenses require admin approval before being finalized</li>
          <li>You will be notified when your expense is approved or rejected</li>
        </ul>
      </div>
    </div>
  );
};

export default ExpenseEntry;