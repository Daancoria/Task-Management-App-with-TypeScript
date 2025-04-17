import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component to protect routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Destructure authentication state and loading state from Auth0 hook
  const { isAuthenticated, isLoading } = useAuth0();

  // Display a loading message while authentication status is being determined
  if (isLoading) return <div>Loading...</div>;

  // Render the children if the user is authenticated; otherwise, redirect to the login page
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
