import api from './api';

export const register = async (data) => {
  const response = await api.post(
    '/auth/register',
    data
  );

  return response.data;
};

export const login = async (data) => {
  const response = await api.post(
    '/auth/login',
    data
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get(
    '/auth/me'
  );

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('readquest_token');
  localStorage.removeItem('readquest_user');
};

export const getStudents = async (params = {}) => {
    const response = await api.get(
        '/auth/students',
        {
            params
        }
    );

    return response.data;
};

export const deleteStudent = async (studentId) => {
    const response = await api.delete(
        `/auth/students/${studentId}`
    );

    return response.data;
};