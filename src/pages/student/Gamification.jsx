import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import { getGamificationStats } from '../../services/gamification.service';

const Gamification = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response =
          await getGamificationStats();

        const data =
          response?.data?.stats ||
          response?.stats;

        setStats(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load gamification stats'
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                  <p className="text-slate-400">
                    Loading gamification stats...
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

            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
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

  const xp = stats?.xp || 0;
  const level = stats?.level || 1;
  const streak = stats?.streak || 0;

  const levelProgress =
    stats?.levelProgress || {};

  const currentXP =
    levelProgress.currentXP ?? xp;

  const nextLevelXP =
    levelProgress.nextLevelXP ?? 100;

  const progress =
    levelProgress.progress ?? 0;

  const remainingXP =
    levelProgress.remainingXP ??
    Math.max(
      0,
      nextLevelXP - currentXP
    );

  const recentXP =
    stats?.recentXP || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <PageHeader
                title="Your Progress"
                description="Track your XP, level, streak, and rewards."
              />

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-500">
                    Total XP
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {xp}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Keep reading to earn more.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-500">
                    Current Level
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {level}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {remainingXP} XP remaining
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-500">
                    Reading Streak
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {streak}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Keep your streak alive.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Level Progress
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Level {level} → Level {level + 1}
                      </p>
                    </div>

                    <span className="font-semibold text-indigo-400">
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, progress)
                        )}%`
                      }}
                    />
                  </div>

                  <div className="mt-4 flex justify-between text-sm text-slate-500">
                    <span>
                      {currentXP} XP
                    </span>

                    <span>
                      {nextLevelXP} XP
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 text-4xl">
                      🔥
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                      {streak} Day Streak
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Read consistently to keep building your streak.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                <div>
                  <h2 className="text-xl font-semibold">
                    Recent XP Activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest XP transactions.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {recentXP.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                      <p className="text-slate-500">
                        No XP activity yet.
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Complete reading activities to earn XP.
                      </p>
                    </div>
                  ) : (
                    recentXP.map(
                      (transaction, index) => (
                        <div
                          key={
                            transaction._id ||
                            transaction.id ||
                            index
                          }
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
                        >
                          <div>
                            <p className="font-medium">
                              {transaction.reason ||
                                transaction.description ||
                                'XP Earned'}
                            </p>

                            {transaction.createdAt && (
                              <p className="mt-1 text-xs text-slate-600">
                                {new Date(
                                  transaction.createdAt
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <span className="font-bold text-emerald-400">
                            +{transaction.amount ??
                              transaction.xp ??
                              0}{' '}
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

export default Gamification;