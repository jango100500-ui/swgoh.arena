import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading };
};
