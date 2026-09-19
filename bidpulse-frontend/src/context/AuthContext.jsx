import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demoUser = localStorage.getItem('bidpulse_demo_user');
    if (demoUser) {
      try {
        setUser(JSON.parse(demoUser));
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('bidpulse_demo_user');
      }
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    const demoUser = localStorage.getItem('bidpulse_demo_user');
    if (demoUser) {
      try {
        const parsed = JSON.parse(demoUser);
        setUser(parsed);
        return parsed;
      } catch (e) {
        localStorage.removeItem('bidpulse_demo_user');
      }
    }

    try {
      const response = await apiClient.get('/users/me');
      setUser(response.data); 
      return response.data;
    } catch (error) {
      console.error("Token invalid or expired", error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (role = 'USER') => {
    let mockUser = {
      id: 777,
      name: 'Operative Maverick',
      email: 'operative@bidpulse.com',
      roles: ['USER'],
    };

    if (role === 'ADMIN') {
      mockUser = {
        id: 999,
        name: 'Admin Commander',
        email: 'admin@bidpulse.com',
        roles: ['ADMIN', 'USER'],
      };
    } else if (role === 'SELLER') {
      mockUser = {
        id: 888,
        name: 'Apex Vendor',
        email: 'seller@bidpulse.com',
        roles: ['SELLER', 'USER'],
      };
    }

    localStorage.setItem('accessToken', `demo-token-${role.toLowerCase()}`);
    localStorage.setItem('bidpulse_demo_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('bidpulse_demo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchCurrentUser, loginAsDemo, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};