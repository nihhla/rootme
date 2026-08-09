import { useEffect, useState } from 'react';

import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';

import {
    getAnalytics
} from '../../services/analytics.service';

const Analytics = () => {
    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const response =
                    await getAnalytics();

                const data =
                    response?.data?.analytics ||
                    response?.analytics;

                setAnalytics(data);

            } catch (error) {
                console.error(
                    'Analytics error:',
                    error
                );

                setError(
                    error.response?.data?.message ||
                    'Failed to load analytics'
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="flex min-h-screen">

                    <Sidebar />

                    <div className="flex min-w-0 flex-1 flex-col">

                        <Navbar />

                        <main className="flex-1 px-6 py-8">

                            <div className="mx-auto max-w-7xl">

                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

                                    <p className="text-slate-400">
                                        Loading analytics...
                                    </p>

                                </div>

                            </div>

                        </main>

                    </div>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">

                <div className="flex min-h-screen">

                    <Sidebar />

                    <div className="flex min-w-0 flex-1 flex-col">

                        <Navbar />

                        <main className="flex-1 px-6 py-8">

                            <div className="mx-auto max-w-7xl">

                                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">

                                    {error}

                                </div>

                            </div>

                        </main>

                    </div>

                </div>

            </div>
        );
    }

    const overview =
        analytics?.overview || {};

    const readingActivity =
        analytics?.readingActivity || [];

    const recentXP =
        analytics?.recentXP || [];

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <div className="flex min-h-screen">

                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">

                    <Navbar />

                    <main className="flex-1 px-6 py-8">

                        <div className="mx-auto w-full max-w-7xl">

                            <PageHeader
                                title="Reading Analytics"
                                description="Track your reading progress, achievements and activity."
                            />

                            {/* OVERVIEW */}

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                                <StatCard
                                    title="Books Started"
                                    value={
                                        overview.totalBooksStarted || 0
                                    }
                                    icon="📚"
                                />

                                <StatCard
                                    title="Books Completed"
                                    value={
                                        overview.completedBooks || 0
                                    }
                                    icon="✅"
                                />

                                <StatCard
                                    title="Pages Read"
                                    value={
                                        overview.pagesRead || 0
                                    }
                                    icon="📖"
                                />

                                <StatCard
                                    title="Reading Time"
                                    value={`${overview.totalReadingTime || 0} min`}
                                    icon="⏱️"
                                />

                                <StatCard
                                    title="Average Progress"
                                    value={`${overview.averageProgress || 0}%`}
                                    icon="📈"
                                />

                                <StatCard
                                    title="Quiz Score"
                                    value={`${overview.averageQuizScore || 0}%`}
                                    icon="🎯"
                                />

                                <StatCard
                                    title="Current Streak"
                                    value={
                                        overview.currentStreak || 0
                                    }
                                    icon="🔥"
                                />

                                <StatCard
                                    title="Total XP"
                                    value={
                                        overview.totalXP || 0
                                    }
                                    icon="⭐"
                                />

                            </div>

                            {/* LEVEL / PROGRESS */}

                            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                Current Level
                                            </p>

                                            <h2 className="mt-1 text-3xl font-bold">
                                                Level {overview.level || 1}
                                            </h2>

                                        </div>

                                        <div className="text-4xl">
                                            🏆
                                        </div>

                                    </div>

                                    <div className="mt-6">

                                        <div className="mb-2 flex justify-between text-sm">

                                            <span className="text-slate-500">
                                                XP
                                            </span>

                                            <span className="text-indigo-400">
                                                {overview.totalXP || 0} XP
                                            </span>

                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                                            <div
                                                className="h-full rounded-full bg-indigo-500 transition-all"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        (overview.totalXP || 0) % 100
                                                    )}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                    <h2 className="text-xl font-semibold">
                                        Achievements
                                    </h2>

                                    <div className="mt-6 grid grid-cols-3 gap-4">

                                        <Achievement
                                            value={
                                                overview.badgesEarned || 0
                                            }
                                            label="Badges"
                                            icon="🏅"
                                        />

                                        <Achievement
                                            value={
                                                overview.challengesJoined || 0
                                            }
                                            label="Joined"
                                            icon="🎯"
                                        />

                                        <Achievement
                                            value={
                                                overview.challengesCompleted || 0
                                            }
                                            label="Completed"
                                            icon="🏆"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* READING ACTIVITY */}

                            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold">
                                            Reading Activity
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Your recent reading progress
                                        </p>

                                    </div>

                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-400">
                                        {readingActivity.length} books
                                    </span>

                                </div>

                                <div className="mt-6 space-y-4">

                                    {readingActivity.length === 0 ? (

                                        <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">

                                            <p className="text-slate-500">
                                                No reading activity yet.
                                            </p>

                                        </div>

                                    ) : (

                                        readingActivity
                                            .slice(0, 10)
                                            .map((item) => {

                                                const progress =
                                                    Number(
                                                        item.progress || 0
                                                    );

                                                return (
                                                    <div
                                                        key={item._id}
                                                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                                                    >

                                                        <div className="flex items-center justify-between gap-4">

                                                            <div className="min-w-0">

                                                                <h3 className="truncate font-semibold">

                                                                    {item.bookId?.title ||
                                                                        'Unknown Book'}

                                                                </h3>

                                                                <p className="mt-1 text-sm text-slate-500">

                                                                    {item.bookId?.author ||
                                                                        'Unknown Author'}

                                                                </p>

                                                            </div>

                                                            <span className="shrink-0 text-sm font-semibold text-indigo-400">

                                                                {progress}%

                                                            </span>

                                                        </div>

                                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                                                            <div
                                                                className="h-full rounded-full bg-indigo-500"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        100,
                                                                        progress
                                                                    )}%`
                                                                }}
                                                            />

                                                        </div>

                                                        <div className="mt-3 flex justify-between text-xs text-slate-600">

                                                            <span>
                                                                {item.pagesRead || 0}{' '}
                                                                pages read
                                                            </span>

                                                            <span>
                                                                {item.status}
                                                            </span>

                                                        </div>

                                                    </div>
                                                );
                                            })

                                    )}

                                </div>

                            </div>

                            {/* RECENT XP */}

                            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                <h2 className="text-xl font-semibold">
                                    Recent XP Activity
                                </h2>

                                <div className="mt-5 space-y-3">

                                    {recentXP.length === 0 ? (

                                        <p className="text-slate-500">
                                            No XP activity yet.
                                        </p>

                                    ) : (

                                        recentXP.map(
                                            (transaction) => (

                                                <div
                                                    key={
                                                        transaction._id
                                                    }
                                                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
                                                >

                                                    <div>

                                                        <p className="font-medium">
                                                            {
                                                                transaction.reason
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-600">
                                                            {transaction.createdAt
                                                                ? new Date(
                                                                      transaction.createdAt
                                                                  ).toLocaleDateString()
                                                                : ''}
                                                        </p>

                                                    </div>

                                                    <span className="font-bold text-green-400">
                                                        +
                                                        {
                                                            transaction.amount
                                                        }{' '}
                                                        XP
                                                    </span>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        </div>
    );
};


/* STAT CARD */

const StatCard = ({
    title,
    value,
    icon
}) => {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                    {title}
                </p>

                <span className="text-2xl">
                    {icon}
                </span>

            </div>

            <p className="mt-4 text-3xl font-bold">
                {value}
            </p>

        </div>
    );
};


/* ACHIEVEMENT */

const Achievement = ({
    value,
    label,
    icon
}) => {
    return (
        <div className="rounded-xl bg-slate-950 p-4 text-center">

            <div className="text-2xl">
                {icon}
            </div>

            <p className="mt-2 text-xl font-bold">
                {value}
            </p>

            <p className="text-xs text-slate-500">
                {label}
            </p>

        </div>
    );
};

export default Analytics;