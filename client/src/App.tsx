import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactListPage } from './pages/ContactListPage';
import { ContactDetailPage } from './pages/ContactDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function ErrorBoundaryTestPage(): React.ReactElement {
  throw new Error('Simulated crash for error boundary verification');
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ErrorBoundary title="Login page crashed" resetLabel="Reload login">
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/register"
        element={
          <ErrorBoundary title="Registration page crashed" resetLabel="Reload registration">
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/"
        element={
          <ErrorBoundary title="Application shell crashed" resetLabel="Reload app shell">
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          </ErrorBoundary>
        }
      >
        <Route
          index
          element={
            <ErrorBoundary title="Dashboard crashed" resetLabel="Reload dashboard">
              <DashboardPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="contacts"
          element={
            <ErrorBoundary title="Contact list crashed" resetLabel="Reload contacts">
              <ContactListPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="contacts/:id"
          element={
            <ErrorBoundary title="Contact details crashed" resetLabel="Reload contact">
              <ContactDetailPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="settings"
          element={
            <ErrorBoundary title="Settings crashed" resetLabel="Reload settings">
              <SettingsPage />
            </ErrorBoundary>
          }
        />
      </Route>

      {import.meta.env.DEV && (
        <Route
          path="/__error-boundary-test"
          element={
            <ErrorBoundary title="Error boundary test" resetLabel="Retry test">
              <ErrorBoundaryTestPage />
            </ErrorBoundary>
          }
        />
      )}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
