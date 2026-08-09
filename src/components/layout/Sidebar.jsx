import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    {
      name: 'Dashboard',
      path: '/dashboard'
    },
    {
      name: 'Books',
      path: '/books'
    },
    {
      name: 'My Reading',
      path: '/reading'
    },
    {
      name: 'Challenges',
      path: '/challenges'
    },
    {
      name: 'Badges',
      path: '/badges'
    },
    {
      name: 'Reviews',
      path: '/reviews'
    },
    {
      name: 'Analytics',
      path: '/analytics'
    }
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 lg:flex lg:min-h-screen lg:flex-col">
      <div className="border-b border-slate-800 px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          ReadQuest
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Gamified Reading Platform
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <p className="text-xs text-slate-600">
          Read. Play. Grow.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;