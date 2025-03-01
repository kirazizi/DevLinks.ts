import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface Profile {
  id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
}

interface AuthContextType {
  user: string | null;
  loading: boolean;
  links: any[];
  setLinks: React.Dispatch<React.SetStateAction<any[]>>;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken: { sub: string } = jwtDecode(token);
          setUser(decodedToken.sub);
        } catch (error) {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    const decodedToken: { sub: string } = jwtDecode(token);
    setUser(decodedToken.sub);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      links, 
      setLinks, 
      profile, 
      setProfile, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};