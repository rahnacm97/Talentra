import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider,  } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Homepage from './components/Home/HomePage';
import Signup from './pages/auth/Signup';
import VerifyOtp from './pages/auth/VerifyOtp';
import Login from './pages/auth/Login';
import Profile from './components/common/Profile';
import AdminSignIn from './pages/admin/AdminSignin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminEmployers from './pages/admin/AdminEmployers';
import AdminLayout from './layout/admin/AdminLayout';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import SocketSetup from './components/common/SocketSetup';
import ProtectedRoute from './components/common/ProtectedRoute';
import VerificationPage from './pages/employer/VerificationPage';
import WaitVerificationPage from './pages/employer/WaitVerification';
import EmployerView from './pages/admin/AdminEmployerView';

const App: React.FC = () => {
  return (
    <>
      <SocketSetup />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ width: '320px' }}
        toastStyle={{
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }}
      />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={['candidate', 'employer']} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-signin" element={<AdminSignIn />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
          <Route path="/admin-candidates" element={<ProtectedRoute element={<AdminCandidates />} allowedRoles={['admin']} />} />
          <Route path="/admin-employers" element={<ProtectedRoute element={<AdminEmployers />} allowedRoles={['admin']} />} />
          <Route path="/admin/employers/:id/view" element={<ProtectedRoute element={<EmployerView />} allowedRoles={['admin']} />} />
        </Route>
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/wait-verification" element={<WaitVerificationPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <Router>
        <App />
      </Router>
    </PersistGate>
  </Provider>
);

export default AppWrapper;