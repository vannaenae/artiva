import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

/**
 * Gate for pages that require a signed-in user. Redirects to /login and
 * carries the current path along as ?next=, so LoginPage can send the
 * resident/artisan straight back to what they were trying to reach.
 */
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userSession, navigate, currentPath } = useApp();

  useEffect(() => {
    if (!userSession) {
      navigate(`/login?next=${encodeURIComponent(currentPath)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSession]);

  if (!userSession) return null;
  return <>{children}</>;
};
