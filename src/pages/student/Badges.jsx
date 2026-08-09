import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import {
  getBadges,
  getMyBadges
} from '../../services/badge.service';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [myBadges, setMyBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const [badgesResponse, myBadgesResponse] =
          await Promise.all([
            getBadges(),
            getMyBadges()
          ]);

        const allBadges =
          badgesResponse?.data?.badges ||
          badgesResponse?.badges ||
          [];

        const unlockedBadges =
          myBadgesResponse?.data?.badges ||
          myBadgesResponse?.data?.userBadges ||
          myBadgesResponse?.badges ||
          myBadgesResponse?.userBadges ||
          [];

        setBadges(allBadges);
        setMyBadges(unlockedBadges);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load badges'
        );
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, []);

  const isUnlocked = (badgeId) => {
    return myBadges.some((item) => {
      const currentId =
        item.badgeId?._id ||
        item.badgeId ||
        item.badge?._id ||
        item.badge ||
        item._id;

      return String(currentId) === String(badgeId);
    });
  };

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
                    Loading badges...
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

  const unlockedCount = badges.filter(
    (badge) => isUnlocked(badge._id)
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <PageHeader
                title="Badges & Achievements"
                description="Complete reading quests and unlock achievements."
              />

              <div className="mb-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-500">
                    Badges Unlocked
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {unlockedCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-500">
                    Total Badges
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {badges.length}
                  </p>
                </div>
              </div>

              {badges.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
                  <div className="text-5xl">
                    🏆
                  </div>

                  <h2 className="mt-4 text-xl font-semibold">
                    No badges available
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Keep completing reading activities to earn achievements.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {badges.map((badge) => {
                    const unlocked =
                      isUnlocked(badge._id);

                    return (
                      <div
                        key={badge._id}
                        className={`rounded-2xl border p-6 transition ${
                          unlocked
                            ? 'border-indigo-500/40 bg-indigo-500/10'
                            : 'border-slate-800 bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${
                              unlocked
                                ? 'bg-indigo-500/20'
                                : 'bg-slate-800 grayscale'
                            }`}
                          >
                            {badge.icon || '🏆'}
                          </div>

                          {unlocked && (
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                              Unlocked
                            </span>
                          )}
                        </div>

                        <h2 className="mt-5 text-lg font-semibold">
                          {badge.name}
                        </h2>

                        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                          {badge.description}
                        </p>

                        {badge.xpReward !== undefined && (
                          <div className="mt-5 border-t border-slate-800 pt-4">
                            <span className="text-sm font-medium text-indigo-400">
                              +{badge.xpReward} XP
                            </span>
                          </div>
                        )}

                        {!unlocked && (
                          <div className="mt-5 border-t border-slate-800 pt-4">
                            <span className="text-xs text-slate-600">
                              🔒 Locked
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Badges;