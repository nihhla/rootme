import api from './api';

export const getAnalytics = async () => {
    const response = await api.get(
        '/analytics/student'
    );

    return response.data;
};

export const getReadingActivity = async () => {
    const response = await api.get(
        '/analytics/student/activity'
    );

    return response.data;
};