// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Mood from "./pages/Mood";
import Tests from "./pages/Tests";
import Profile from "./pages/Profile";
import Journal from "./pages/Journal";
import Goals from "./pages/Goals";
import Helplines from "./pages/FindHelp/Helplines";
import FindTherapist from "./pages/FindHelp/FindTherapist";
import SelfHelpTechniques from "./pages/FindHelp/SelfHelpTechniques";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.png" alt="serene" className="w-12 animate-pulse" />
          <p className="text-sm text-[#787586] font-mono tracking-widest">Loading…</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected */}
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
      <Route path="/tests" element={<ProtectedRoute><Tests /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />

      {/* Find Help */}
      <Route path="/find-help/helplines" element={<ProtectedRoute><Helplines /></ProtectedRoute>} />
      <Route path="/find-help/therapist" element={<FindTherapist />} />
      <Route path="/find-help/self-help" element={<SelfHelpTechniques />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
