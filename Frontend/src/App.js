import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Hospital from './pages/Hospital';
import Diagnosis from './pages/Diagnosis';
import Doctor from './pages/Doctor';
import OPD from './pages/OPD';
import Patient from './pages/Patient';
import Receipt from './pages/Receipt';
import TreatmentType from './pages/TreatmentType';
import SubTreatmentType from './pages/SubTreatmentType';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/dashboard"    element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><Dashboard/></AppLayout></ProtectedRoute>}/>
          <Route path="/hospital"     element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><Hospital/></AppLayout></ProtectedRoute>}/>
          <Route path="/doctor"       element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><Doctor/></AppLayout></ProtectedRoute>}/>
          <Route path="/treatment"    element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><TreatmentType/></AppLayout></ProtectedRoute>}/>
          <Route path="/receipt"      element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><Receipt/></AppLayout></ProtectedRoute>}/>
          <Route path="/subtreatment" element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><SubTreatmentType/></AppLayout></ProtectedRoute>}/>
          <Route path="/patient"      element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><Patient/></AppLayout></ProtectedRoute>}/>
          <Route path="/diagnosis"    element={<ProtectedRoute allowedRoles={['Admin']}><AppLayout><Diagnosis/></AppLayout></ProtectedRoute>}/>

          {/* Shared */}
          <Route path="/opd" element={<ProtectedRoute allowedRoles={['Admin','Doctor','Patient']}><AppLayout><OPD/></AppLayout></ProtectedRoute>}/>

          {/* Role dashboards */}
          <Route path="/doctor-dashboard"  element={<ProtectedRoute allowedRoles={['Doctor']}><AppLayout><DoctorDashboard/></AppLayout></ProtectedRoute>}/>
          <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['Patient']}><AppLayout><PatientDashboard/></AppLayout></ProtectedRoute>}/>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
