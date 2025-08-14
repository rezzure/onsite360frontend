
import './App.css'
import Login from './Components/Auth/Login'
import ProtectedRoute from './Utils/protectedRoute'
import AdminLayout from './Layouts/AdminLayout'
import AdminDashboard from './Pages/AdminOnly/AdminDashboard'

import SupervisorLayout from './Layouts/SupervisorLayout'
import SupervisorDashboard from './Pages/Supervisor.jsx/SupervisorDashboard'
import ClientLayout from './Layouts/ClientLayout'
import ClientDashboard from './Pages/ClientPage/ClientDashboard'

import Payments from './Pages/ClientPage/Payments'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Components/Common/Home'
import FundManagement from './Pages/AdminOnly/FundManagement'
import ExpenseApproval from './Pages/AdminOnly/ExpenseApproval'
import SiteUserManagement from './Pages/AdminOnly/SiteUserManagement'
import SiteProgressUpdate from './Pages/Supervisor.jsx/SiteProgressUpdate'
import ExpenseEntry from './Pages/Supervisor.jsx/ExpenseEntry'
import ViewHistory from './Pages/Supervisor.jsx/ViewHistory'
import SiteUpdates from './Pages/ClientPage/SiteUpdates'
import QuerySupport from './Pages/AdminOnly/QuerySupport'
import HelpDesk from './Pages/ClientPage/HelpDesk'

function App() {


  return (
    <>
      <div className=' px-2'>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path='dashboard' element={<AdminDashboard />} />
            {/* <Route path="users" element={<AdminUsers />} /> */}
            <Route path="fund-management" element={<FundManagement />} />
            <Route path="expense-approval" element={<ExpenseApproval />} />

            <Route path="site-user" element={<SiteUserManagement />} />
            <Route path="query-support" element={<QuerySupport/>} />
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Supervisor Routes */}
          <Route path="/supervisor" element={
            <ProtectedRoute allowedRoles={['supervisor']}>
              <SupervisorLayout />
            </ProtectedRoute>
          }>
            <Route path='dashboard' element={<SupervisorDashboard />} />
            <Route index element={<SupervisorDashboard />} />
            <Route path="site-progress" element={<SiteProgressUpdate />} />
            <Route path="expense-entry" element={<ExpenseEntry />} />
            <Route path="history" element={<ViewHistory />} />
          </Route>

          {/* Client Routes */}
          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientLayout />
            </ProtectedRoute>
          }>
            <Route path='dashboard' element={<ClientDashboard />} />
            <Route index element={<ClientDashboard />} />
            <Route path="site-update" element={<SiteUpdates />} />
            <Route path="payment" element={<Payments />} />
            <Route path="help-desk-client" element={<HelpDesk/>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

    </>

  )
}

export default App
