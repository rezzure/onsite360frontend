import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../ContextApi/AuthContext';

const SiteUserManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [clients, setClients] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


   const { navigate, backendURL } = useContext(AuthContext)
  
  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'client'
  });
  
  const [siteForm, setSiteForm] = useState({
    name: '',
    address: '',
    client: '',
    supervisor: ''
  });

  // Initialize mock data
  useEffect(() => {

    handleUserList(); //getting users list
    handleSiteList(); //getting sites list
    console.log(`sites+${sites}`)

    // Simulate API call delay
    setTimeout(() => {  
      setIsLoading(false);
    }, 800);
  }, []);

  // Handle user form input changes
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle site form input changes
  const handleSiteInputChange = (e) => {
    const { name, value } = e.target;
    setSiteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle user form submission
  const handleUserSubmit = async(e) => {
    e.preventDefault();
    if(editingUser){
      try {
        console.log(editingUser)
        const response = await fetch(`${backendURL}/api/edit/user/${editingUser._id}`,{
          method:"PUT",
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem("token")
          },
          body: JSON.stringify(userForm)
        })
        const data = await response.json();
        if(data.success){
          alert("user detail updated")
          handleUserList()
        }
        alert(data.message)

      } catch (error) {
        console.log(error)
      }
    }
     else{
      try {
      const response = await fetch(`${backendURL}/api/create/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token':localStorage.getItem('token')
      },
      body: JSON.stringify(userForm)
      });
      const data= await response.json()
      console.log(users);
      if(data.success){
        alert('new User created ');
        handleUserList()
      }
 
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ apiError: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
     }
    setIsLoading(true);
    
      setIsLoading(false);
  };


  // getting user list
  const handleUserList =async()=>{
   
    try{
      const response = await fetch(`${backendURL}/api/get/users`,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
          "token":localStorage.getItem("token")
        }
      })
      let data = await response.json()
      console.log(data)
       setUsers(data)

      const filteredClients = data.data.filter(u => u.role === 'client');
    const filteredSupervisors = data.data.filter(u => u.role === 'supervisor');
    
    setClients(filteredClients);
    setSupervisors(filteredSupervisors);

    // Debug log
    console.log('Clients:', filteredClients);
    console.log('Supervisors:', filteredSupervisors);
    }
    catch(error){
      console.log(error)
    }
  }

  // Handle site form submission
  const handleSiteSubmit = async(e) => {
    e.preventDefault();
     if(editingSite){
      try{
        const response = await fetch(`${backendURL}/api/edit/site/:${editingSite._id}`,{
          method:"PUT",
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem("token")
          },
          body:JSON.stringify(siteForm)
        })
        const data = await response.json()
        console.log(data)
        handleSiteList()
        if(data.success){
          return alert("Site Detail updated")
        }
        return alert(`Something Went Wrong  ${data.message}`)
      }
      catch(error){
        console.log(`Error:- ${error}`)
      }
    }
    else{
      try {
      const response = await fetch(`${backendURL}/api/add/site`,{
        method:"POST",
        headers:{
          "Content-type":"application/json",
          "token":localStorage.getItem("token")
        },
        body:JSON.stringify(siteForm)
      })

      const result = await response.json()
      console.log(result)
      if(result.success){
        return alert("New Site Created..")
      }
      return alert(`Something Went Worng ${result.message}`)
      //  setSites(prev => [...prev, result]);
    } catch (error) {
      console.log("error")
    }
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setSiteForm({
        name: '',
        address: '',
        client: '',
        supervisor: ''
      });
      
      setShowSiteForm(false);
      setIsLoading(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1000);
  };

  // handle site list
  const handleSiteList =async()=>{
    try{
      const response = await fetch(`${backendURL}/api/get/sitesdetail`,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
          "token":localStorage.getItem("token")
        }
      })
      let data = await response.json()
      console.log(data)
      setSites(data)
      console.log(sites)

    }
    catch(error){
      console.log(error)
    }
  }

  // Handle user deletion
  const handleDeleteUser = async(id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {

      // const _id = e.target._id
      try{
        const response = await fetch(`${backendURL}/api/delete/user/${id}`,{
          method:"DELETE",
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem("token")
          }
        })
        const data = response.json()
        handleUserList()
        console.log(data.success)
        if(!data.success){
          alert("something wentwrong "+data.message)
        }
        return alert("user deleted...")
      }
      catch(error){
        console.log(error)
      }
    }
  };

  // Handle site deletion
  const handleDeleteSite = async(_Id) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      console.log(_Id)
      try {
        const response = await fetch(`${backendURL}/api/delete/site/${_Id}`,{
          method:"DELETE",
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem("token")
          }
        })
        const result = response.json();
        if(result.success){
          handleSiteList()
        return alert("site deleted...")
      }
      return alert(`something went Wrong ${result.message}`)
        
      } catch (error) {
        console.log(`Error:- ${error}`)
      }
      
      // Simulate API call
      // setIsLoading(true);
      // setTimeout(() => {
      //   setSites(prev => prev.filter(s => s.id !== siteId));
      //   setIsLoading(false);
      // }, 800);
    }
  };


  // Start editing a user
  const startEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      password: '', // Password should be reset separately
      role: user.role
    });
    setShowUserForm(true);
  };

  // Start editing a site
  const startEditSite = (site) => {
    setEditingSite(site);
    setSiteForm({
      name: site.name,
      address: site.address,
      client: site.client,
      supervisor: site.supervisor
    });
    setShowSiteForm(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
    setEditingSite(null);
    setShowUserForm(false);
    setShowSiteForm(false);
    setUserForm({
      name: '',
      email: '',
      mobile: '',
      password: '',
      role: 'client'
    });
    setSiteForm({
      name: '',
      address: '',
      client: '',
      supervisor: ''
    });
  };

  // Format date in Indian format
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.data.find(u => u._id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Site & User Management</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'sites'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('sites')}
        >
          Sites Management
        </button>
      </div>
      
      {/* Users Management Section */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Manage Users</h2>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowUserForm(true);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </button>
          </div>
          
          {/* User Form */}
          {showUserForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <form onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={userForm.name}
                      onChange={handleUserInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleUserInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">mobile Number*</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={userForm.mobile}
                      onChange={handleUserInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter 10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={handleUserInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    >
                      <option value="client">Client</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingUser ? 'New Password' : 'Password*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userForm.password}
                      onChange={handleUserInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder={editingUser ? 'Leave blank to keep current' : 'Set initial password'}
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : users.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-2">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">mobile</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.data.map(user => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.mobile}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Sites Management Section */}
      {activeTab === 'sites' && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Manage Sites</h2>
            <button
              onClick={() => {
                setEditingSite(null);
                setShowSiteForm(true);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Site
            </button>
          </div>
          
          {/* Site Form */}
          {showSiteForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                {editingSite ? 'Edit Site' : 'Add New Site'}
              </h3>
              <form onSubmit={handleSiteSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={siteForm.name}
                      onChange={handleSiteInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter site name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                    <textarea
                      name="address"
                      value={siteForm.address}
                      onChange={handleSiteInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter full address"
                      rows="2"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client*</label>
                      <select
                        name="client"
                        value={siteForm.client}
                        onChange={handleSiteInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="">Select Client</option>
                        {clients.map(client => (
                          <option key={client._id} value={client.email}>
                            {client.name} ({client.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor*</label>
                      <select
                        name="supervisor"
                        value={siteForm.supervisor}
                        onChange={handleSiteInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="">Select Supervisor</option>
                        {supervisors.map(supervisor => (
                          <option key={supervisor._id} value={supervisor.email}>
                            {supervisor.name} ({supervisor.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    {editingSite ? 'Update Site' : 'Create Site'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Sites Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : sites.data?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-2">No users found</p>
            </div>
          ): (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sites.data?.map(site => (
                    <tr key={site._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{site.siteName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">{site.address}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{site.clientName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{site.supervisorName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(site.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditSite(site)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteSite(site._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SiteUserManagement;