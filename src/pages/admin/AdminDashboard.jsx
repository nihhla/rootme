import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import useAuth from '../../hooks/useAuth';
import { getAdminAnalytics } from '../../services/analytics.service';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await getAdminAnalytics();

                console.log(
                    'ADMIN ANALYTICS RESPONSE:',
                    response
                );

                const data =
                    response?.data?.analytics ||
                    response?.analytics;

                setAnalytics(data || {});
            } catch (error) {
                console.error(
                    'Failed to load admin analytics:',
                    error
                );

                setError(
                    error.response?.data?.message ||
                    'Failed to load admin analytics'
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

const overview = analytics?.overview || {};

const totalStudents =
    overview?.totalStudents ??
    overview?.students ??
    0;

const totalBooks =
    overview?.totalBooks ??
    overview?.books ??
    0;

const totalReviews =
    overview?.totalReviews ??
    overview?.reviews ??
    0;

const activeReaders =
    overview?.activeReaders ??
    overview?.activeReadersCount ??
    0;  

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <div className="flex min-h-screen">

                <AdminSidebar />

                <main className="min-w-0 flex-1">

                    <header className="border-b border-slate-800 px-8 py-6">

                        <p className="text-sm text-slate-500">
                            Administration
                        </p>

                        <div className="mt-1 flex items-center justify-between">

                            <h1 className="text-3xl font-bold">
                                Admin Dashboard
                            </h1>

                            <div className="flex items-center gap-4">

                                <div className="text-right">
                                    <p className="text-sm text-slate-400">
                                        Logged in as
                                    </p>

                                    <p className="font-medium">
                                        {user?.name || 'Admin'}
                                    </p>
                                </div>

                                <button
                                    onClick={logout}
                                    className="rounded-xl border border-slate-700 px-5 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                                >
                                    Logout
                                </button>

                            </div>

                        </div>

                    </header>

                    <div className="p-8">

                        <div className="mx-auto max-w-7xl">

                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Overview
                                </h2>

                                <p className="mt-2 text-slate-400">
                                    Manage and monitor the ReadQuest platform.
                                </p>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6"
                                        >
                                            <div className="h-4 w-32 rounded bg-slate-800" />

                                            <div className="mt-5 h-10 w-20 rounded bg-slate-800" />

                                            <div className="mt-4 h-3 w-24 rounded bg-slate-800" />
                                        </div>
                                    ))}

                                </div>
                            ) : (
                                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                        <p className="text-sm text-slate-500">
                                            Total Students
                                        </p>

                                        <p className="mt-3 text-4xl font-bold">
                                            {totalStudents}
                                        </p>

                                        <p className="mt-3 text-sm text-slate-500">
                                            Registered students
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                        <p className="text-sm text-slate-500">
                                            Total Books
                                        </p>

                                        <p className="mt-3 text-4xl font-bold">
                                            {totalBooks}
                                        </p>

                                        <p className="mt-3 text-sm text-slate-500">
                                            Books in library
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                        <p className="text-sm text-slate-500">
                                            Reviews
                                        </p>

                                        <p className="mt-3 text-4xl font-bold">
                                            {totalReviews}
                                        </p>

                                        <p className="mt-3 text-sm text-slate-500">
                                            Reader reviews
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                        <p className="text-sm text-slate-500">
                                            Active Readers
                                        </p>

                                        <p className="mt-3 text-4xl font-bold">
                                            {activeReaders}
                                        </p>

                                        <p className="mt-3 text-sm text-slate-500">
                                            Currently reading
                                        </p>

                                    </div>

                                </div>
                            )}

                            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

                                    <h2 className="text-2xl font-semibold">
                                        Platform Overview
                                    </h2>

                                    <p className="mt-3 text-slate-400">
                                        Monitor students, books, reviews
                                        and reading activity from the
                                        administration panel.
                                    </p>

                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

                                    <h2 className="text-2xl font-semibold">
                                        Quick Actions
                                    </h2>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                        <button
                                            onClick={() => {
                                                window.location.href =
                                                    '/admin/books';
                                            }}
                                            className="rounded-xl border border-slate-700 px-4 py-3 text-left text-slate-300 transition hover:border-indigo-500 hover:bg-slate-800"
                                        >
                                            Manage Books
                                        </button>

                                        <button
                                            onClick={() => {
                                                window.location.href =
                                                    '/admin/students';
                                            }}
                                            className="rounded-xl border border-slate-700 px-4 py-3 text-left text-slate-300 transition hover:border-indigo-500 hover:bg-slate-800"
                                        >
                                            Manage Students
                                        </button>

                                        <button
                                            onClick={() => {
                                                window.location.href =
                                                    '/admin/reviews';
                                            }}
                                            className="rounded-xl border border-slate-700 px-4 py-3 text-left text-slate-300 transition hover:border-indigo-500 hover:bg-slate-800"
                                        >
                                            Manage Reviews
                                        </button>

                                        <button
                                            onClick={() => {
                                                window.location.href =
                                                    '/admin/analytics';
                                            }}
                                            className="rounded-xl border border-slate-700 px-4 py-3 text-left text-slate-300 transition hover:border-indigo-500 hover:bg-slate-800"
                                        >
                                            View Analytics
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default AdminDashboard;