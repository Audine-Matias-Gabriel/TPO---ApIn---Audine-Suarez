import { createContext, useContext, useState, useEffect } from 'react';
import type { User, ReactNode } from '@/types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  clearCurrentUser: () => void;
  isUserSelected: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUserState(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const clearCurrentUser = () => {
    setCurrentUserState(null);
    localStorage.removeItem('currentUser');
  };

  const value: UserContextType = {
    currentUser,
    setCurrentUser,
    clearCurrentUser,
    isUserSelected: currentUser !== null,
  };

  if (isLoading) {
    return <div style={{ display: 'none' }} />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
