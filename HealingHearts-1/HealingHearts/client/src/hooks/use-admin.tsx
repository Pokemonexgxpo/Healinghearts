import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: adminStatus } = useQuery({
    queryKey: ['/api/auth/status'],
    queryFn: async () => {
      const response = await fetch('/api/auth/status');
      return response.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  useEffect(() => {
    if (adminStatus?.isAdmin !== undefined) {
      setIsAdmin(adminStatus.isAdmin);
    }
  }, [adminStatus]);

  const login = (loggedIn: boolean) => {
    setIsAdmin(loggedIn);
  };

  return { isAdmin, login };
}