import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Step1 from "./pages/Onboarding/Step1";
import Step2 from "./pages/Onboarding/Step2";
import Step3 from "./pages/Onboarding/Step3";
import Step4 from "./pages/Onboarding/Step4";

/** Redirect unauthenticated users to /login */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <img src="logo.png" alt="serene" className="w-12 animate-pulse" />
          <p className="text-sm text-[#9AA5B1] font-medium">Loading…</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

/** Redirect already-logged-in users away from login page */
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
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Onboarding (protected — user must be logged in) */}
      <Route
        path="/onboarding/1"
        element={
          <ProtectedRoute>
            <Step1 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/2"
        element={
          <ProtectedRoute>
            <Step2 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/3"
        element={
          <ProtectedRoute>
            <Step3 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/4"
        element={
          <ProtectedRoute>
            <Step4 />
          </ProtectedRoute>
        }
      />

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
