import { BrowserRouter, Routes, Route } from 'react-router-dom';
import client from './ApolloClient';
import { ApolloProvider } from '@apollo/client';

import LoginPage from './component/LoginPage'
import SignupPage from './component/SignupPage'
import Dashboard from './component/Dashboard';
import PreviewPage from './component/PreviewPage';
import PublicProfilePage from './component/PublicProfilePage';
import PrivateRoute from './component/PrivateRoute';
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/:userId" element={<PublicProfilePage />} />
            <Route
              path="/preview"
              element={
                <PrivateRoute>
                  <PreviewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;