// src/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, allowedEmails }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && allowedEmails.includes(user.email)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedEmails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authorized ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;