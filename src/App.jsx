import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CaseList from "./pages/admin/CaseList";
import CaseDetail from "./pages/admin/CaseDetail";
import OSHA300 from "./pages/admin/OSHA300";
import StaffPortal from "./pages/portal/StaffPortal";
import IncidentForm from "./pages/portal/IncidentForm";
import CaseView from "./pages/portal/CaseView";
import WorkersCompForm from "./pages/portal/WorkersCompForm";

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/cases" element={<ProtectedRoute requiredRole="admin"><CaseList /></ProtectedRoute>} />
        <Route path="/admin/cases/:id" element={<ProtectedRoute requiredRole="admin"><CaseDetail /></ProtectedRoute>} />
        <Route path="/admin/osha300" element={<ProtectedRoute requiredRole="admin"><OSHA300 /></ProtectedRoute>} />

        {/* Staff routes */}
        <Route path="/portal" element={<ProtectedRoute requiredRole="staff"><StaffPortal /></ProtectedRoute>} />
        <Route path="/portal/report/new" element={<ProtectedRoute requiredRole="staff"><IncidentForm /></ProtectedRoute>} />
        <Route path="/portal/cases/:id" element={<ProtectedRoute requiredRole="staff"><CaseView /></ProtectedRoute>} />
        <Route path="/portal/workers-comp/:caseId" element={<ProtectedRoute requiredRole="staff"><WorkersCompForm /></ProtectedRoute>} />
        <Route path="/admin/workers-comp/:caseId" element={<ProtectedRoute requiredRole="admin"><WorkersCompForm /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
