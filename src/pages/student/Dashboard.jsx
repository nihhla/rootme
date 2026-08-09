import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/layout/PageHeader';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { getGamificationStats } from '../../services/gamification.service';
import { getReadingProgress } from '../../services/reading.service';
import { getStreak } from '../../services/streak.service';

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [readings, setReadings] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          gamificationResponse,
          readingResponse,
          streakResponse
        ] = await Promise.all([
          getGamificationStats(),
          getReadingProgress(),
          getStreak()
        ]);

        setStats(
          gamificationResponse?.data?.stats ||
          gamificationResponse?.stats ||
          null
        );

        setReadings(
          readingResponse?.data?.readings ||
          readingResponse?.readings ||
          []
        );

        setStreak(
          streakResponse?.data?.streak?.streak ??
          streakResponse?.data?.streak ??
          streakResponse?.streak ??
          0
        );
      } catch (error) {
        console.error(
          'Dashboard loading failed:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const xp =
    stats?.xp ??
    user?.xp ??
    0;

  const level =
    stats?.level ??
    user?.level ??
    1;

  const currentLevelXP =
    stats?.levelProgress?.currentXP ??
    xp;

  const nextLevelXP =
    stats?.levelProgress?.nextLevelXP ??
    100;

  const levelProgress =
    stats?.levelProgress?.progress ??
    0;

  const activeReadings =
    readings.filter(
      (reading) =>
        reading.status === 'reading'
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <PageHeader
                title={`Welcome, ${user?.name || 'Student'}`}
                description="Track your reading journey and keep building your streak."
              />

              {loading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                  <p className="text-slate-400">
                    Loading your dashboard...
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <p className="text-sm font-medium text-slate-400">
                        XP
                      </p>

                      <p className="mt-3 text-3xl font-bold">
                        {xp}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        {currentLevelXP} / {nextLevelXP} XP
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <p className="text-sm font-medium text-slate-400">
                        Level
                      </p>

                      <p className="mt-3 text-3xl font-bold">
                        {level}
                      </p>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                levelProgress
                              )
                            )}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <p className="text-sm font-medium text-slate-400">
                        Reading Streak
                      </p>

                      <p className="mt-3 text-3xl font-bold">
                        {streak}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Keep reading every day
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <p className="text-sm font-medium text-slate-400">
                        Books Reading
                      </p>

                      <p className="mt-3 text-3xl font-bold">
                        {activeReadings.length}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Currently in progress
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold">
                            Continue Reading
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            Pick up where you left off.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        {activeReadings.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                            <p className="text-slate-400">
                              You aren't reading any books yet.
                            </p>

                            <p className="mt-2 text-sm text-slate-600">
                              Explore the library to start reading.
                            </p>
                          </div>
                        ) : (
                          activeReadings
                            .slice(0, 3)
                            .map((reading) => (
                              <div
                                key={reading._id}
                                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <h3 className="font-semibold">
                                      {reading.bookId?.title ||
                                        'Unknown Book'}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                      {reading.bookId?.author ||
                                        'Unknown Author'}
                                    </p>
                                  </div>

                                  <span className="text-sm font-semibold text-indigo-400">
                                    {reading.progress || 0}%
                                  </span>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                                  <div
                                    className="h-full rounded-full bg-indigo-500"
                                    style={{
                                      width: `${reading.progress || 0}%`
                                    }}
                                  />
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                      <h2 className="text-xl font-semibold">
                        Student Profile
                      </h2>

                      <div className="mt-6 space-y-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Name
                          </p>

                          <p className="mt-1 font-medium">
                            {user?.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Student ID
                          </p>

                          <p className="mt-1 font-medium">
                            {user?.studentId}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Department
                          </p>

                          <p className="mt-1 font-medium">
                            {user?.department}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Semester
                          </p>

                          <p className="mt-1 font-medium">
                            {user?.semester}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;