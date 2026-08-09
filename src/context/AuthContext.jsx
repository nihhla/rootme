import {
  createContext,
  useEffect,
  useState
} from 'react';

import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService
} from '../services/auth.service';

import {
  setToken,
  setUser,
  getToken,
  getUser,
  clearStorage
} from '../utils/storage';

export const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children
}) => {
  const [user, setUserState] =
    useState(() => getUser());

  const [loading, setLoading] =
    useState(true);

  const isAuthenticated =
    Boolean(getToken());

  useEffect(() => {
    const initializeAuth =
      async () => {
        const token = getToken();

        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const response =
            await getCurrentUser();

          const currentUser =
            response?.data?.user ||
            response?.user;

          if (currentUser) {
            setUserState(
              currentUser
            );

            setUser(
              currentUser
            );
          }
        } catch {
          clearStorage();
          setUserState(null);
        } finally {
          setLoading(false);
        }
      };

    initializeAuth();
  }, []);

  const login = async (data) => {
    const response =
      await loginService(data);

    const token =
      response?.data?.token ||
      response?.token;

    const loggedUser =
      response?.data?.user ||
      response?.user;

    if (!token) {
      throw new Error(
        'Authentication token not received'
      );
    }

    setToken(token);

    if (loggedUser) {
      setUser(loggedUser);
      setUserState(loggedUser);
    }

    return response;
  };

  const register = async (data) => {
    const response =
      await registerService(data);

    const token =
      response?.data?.token ||
      response?.token;

    const registeredUser =
      response?.data?.user ||
      response?.user;

    if (token) {
      setToken(token);
    }

    if (registeredUser) {
      setUser(
        registeredUser
      );

      setUserState(
        registeredUser
      );
    }

    return response;
  };

  const logout = () => {
    logoutService();
    clearStorage();
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};