import api from './api';

export const getAnalytics = async () => {
    const response = await api.get('/analytics/student');

    return response.data;
};

export const getStudentAnalytics = async () => {
    const response = await api.get('/analytics/student');

    return response.data;
};

export const getReadingActivity = async () => {
    const response = await api.get(
        '/analytics/student/activity'
    );

    return response.data;
};

export const getLeaderboard = async () => {
    const response = await api.get(
        '/analytics/leaderboard'
    );

    return response.data;
};

export const getAdminAnalytics = async () => {
    const response = await api.get(
        '/analytics/admin'
    );

    return response.data;
};