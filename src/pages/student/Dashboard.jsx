import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/layout/PageHeader';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

const Dashboard = () => {
  const { user } = useAuth();

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

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm font-medium text-slate-400">
                    XP
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {user?.xp || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm font-medium text-slate-400">
                    Level
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {user?.level || 1}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm font-medium text-slate-400">
                    Streak
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {user?.streak || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm font-medium text-slate-400">
                    Student ID
                  </p>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {user?.studentId || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-white">
                  Your Reading Journey
                </h2>

                <p className="mt-2 text-slate-400">
                  Start exploring books and build your reading streak.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;