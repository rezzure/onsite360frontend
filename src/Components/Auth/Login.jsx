import { useState} from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaHardHat, FaChartLine, FaUsers, FaKey } from 'react-icons/fa';
import { RiShieldUserFill } from 'react-icons/ri';
import ReCAPTCHA from "react-google-recaptcha";
import { loginImg } from '../../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../../ContextApi/AuthContext';
import axios from 'axios';





const Login = () => {
  // State for form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // const payload = loginData.emailOrPhone.includes('@')
  // ? { email: loginData.emailOrPhone, password: loginData.password }
  // : { phone: loginData.emailOrPhone, password: loginData.password };




  const { navigate, backendURL } = useContext(AuthContext)

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'admin'
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  // State for UI
  const [isLogin, setIsLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isAdminExists, setIsAdminExists] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Check if admin already exists (simulating API call)
  // useEffect(() => {
  //   const checkAdminExists = async () => {
  //     try {
  //       // Simulate API call delay
  //      const response = await axios.get(backendURL+'/api/user/check-admin');
  //       // Mock response - in real app, this would come from backend
  //       // const mockAdminCheck = localStorage.getItem('adminRegistered');
       
  //       setIsAdminExists( response.data.adminExists);
        
  //     } catch (error) {
  //       console.error('Error checking admin existence:', error);
  //     }
  //   };

  //   checkAdminExists();
  // }, []);

  // Handle login input change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle signup input change
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle forgot password input change
  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate login form
  const validateLogin = () => {
    const newErrors = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email or phone is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email) && 
      !/^\d{10}$/.test(loginData.email)
    ) {
      newErrors.email = 'Please enter a valid email or 10-digit phone number';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate signup form
  const validateSignup = () => {
    const newErrors = {};
    
    if (!signupData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!signupData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!signupData.mobile) {
      newErrors.mobile = 'Phone number is required';
    } else if (!/^\d{10}$/.test(signupData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit phone number';
    }
    
    if (!recaptchaValue) {
      newErrors.recaptcha = 'Please complete the CAPTCHA';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate forgot password form
  const validateForgotPassword = () => {
    const newErrors = {};
    if (!forgotPasswordData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
      });

      const data =await response.json()


      console.log(data)
      if (data.success) {
        setIsLogin(true)
        console.log(data.token)
    



        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.data.name);
        localStorage.setItem('email', data.data.email);
        localStorage.setItem('mobile', data.data.mobile);
        localStorage.setItem('role', data.data.role);
        localStorage.setItem("_id", data.data._id );
        if(data.data.role === "admin"){
          navigate("/admin")
        }
        if(data.data.role === "supervisor"){
         navigate("/supervisor")
        }
        if(data.data.role === "client"){
         navigate("/client")
        }

        alert("Login Successful...")

      }
    
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ apiError: 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setIsLoading(true);
    try {

      const response = await fetch(`${backendURL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
      });
      const data= await response.json()
      console.log(data);
      if(data.success){
        localStorage.setItem('adminRegistered', 'true');
        setIsAdminExists(true);
        alert('Admin registration successful! Please login.');
        setIsLogin(true);
      }
 
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ apiError: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password submission
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validateForgotPassword()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to your backend
      console.log('Forgot password data to be sent to backend:', forgotPasswordData);
      
      // Mock successful password reset request
      setForgotPasswordSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ apiError: 'Failed to process your request. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setShowForgotPassword(false);
  };

  // Toggle forgot password view
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setErrors({});
    setForgotPasswordSuccess(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left side - Auth Forms */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
        {showForgotPassword ? (
          // Forgot Password Form
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h2>
            
            {errors.apiError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {errors.apiError}
              </div>
            )}
            
            {forgotPasswordSuccess ? (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                <p className="text-center">
                  Password reset link has been sent to your email. Please check your inbox.
                </p>
                <button
                  onClick={toggleForgotPassword}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="forgotEmail"
                      name="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                      placeholder="Your registered email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Send Reset Link'}
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={toggleForgotPassword}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : isLogin ? (
          // Login Form
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Site Management Login</h2>
            
            {errors.apiError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {errors.apiError}
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Email 
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loginData.email.includes('@') ? (
                      <FaEnvelope className="text-gray-400" />
                    ) : (
                      <FaPhone className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    placeholder="Email "
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:text-white hover:bg-black border text-black font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                {!isAdminExists && (
                  <p>
                    Need to register the first admin?{' '}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Register as Admin
                    </button>
                  </p>
                )}
                <p className="mt-2">
                  <button
                    type="button"
                    onClick={toggleForgotPassword}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                </p>
              </div>
            </form>
          </div>
        ) : (
          // Signup Form (Admin Only)
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto w-full relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">Admin Registration</h2>
            <div className="bg-blue-100 absolute right-10 top-20 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
              Only for first admin
            </div>
            
            {errors.apiError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {errors.apiError}
              </div>
            )}
            
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    placeholder="Your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={signupData.mobile}
                    onChange={handleSignupChange}
                    className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.mobile ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    placeholder="10-digit phone number"
                    maxLength="10"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiShieldUserFill className="text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={signupData.role}
                    onChange={handleSignupChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white appearance-none"
                    disabled
                  >
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4 ">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" 
                  onChange={(value) => setRecaptchaValue(value)}
                />
                {errors.recaptcha && (
                  <p className="mt-1 text-sm text-red-600 ">{errors.recaptcha}</p>
                )}
              </div>
              
              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:text-white hover:bg-black border text-black font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Registering...' : 'Register Admin'}
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Right side - Image and Info */}
      <div className="w-full md:w-1/2 bg-blue-700 text-white p-4 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={loginImg.img2} 
            alt="Construction Site Management" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center font-serif">OnSite360</h1>
          <p className="text-lg md:text-xl mb-8 text-center">
            Comprehensive solution for civil and interior project management
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className=" bg-opacity-80 p-4 rounded-lg shadow border backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <FaHardHat className="text-xl mr-3" />
                <h3 className="text-lg font-semibold">Project Tracking</h3>
              </div>
              <p className="text-sm opacity-90">Real-time monitoring of all site activities and progress</p>
            </div>
            
            <div className="shadow border bg-opacity-80 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <FaChartLine className="text-xl mr-3" />
                <h3 className="text-lg font-semibold">Financial Control</h3>
              </div>
              <p className="text-sm opacity-90">Track expenses and fund flows with detailed reporting</p>
            </div>
            
            <div className="shadow border bg-opacity-80 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <FaUsers className="text-xl mr-3" />
                <h3 className="text-lg font-semibold">Team Collaboration</h3>
              </div>
              <p className="text-sm opacity-90">Seamless communication between all stakeholders</p>
            </div>
            
            <div className="shadow border bg-opacity-80 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <FaKey className="text-xl mr-3" />
                <h3 className="text-lg font-semibold">Secure Access</h3>
              </div>
              <p className="text-sm opacity-90">Role-based access control for all system users</p>
            </div>
          </div>
          
          <div className="text-center text-sm opacity-80">
            <p>© {new Date().getFullYear()} ConstructionPro Solutions. All rights reserved.</p>
            <p className="mt-1">Version 2.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;