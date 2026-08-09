import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
    const links = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard'
        },
        {
            name: 'Books',
            path: '/admin/books'
        },
        {
            name: 'Students',
            path: '/admin/students'
        },
        // {
        //     name: 'Reviews',
        //     path: '/admin/reviews'
        // },
        // {
        //     name: 'Challenges',
        //     path: '/admin/challenges'
        // },
        // {
        //     name: 'Analytics',
        //     path: '/admin/analytics'
        // }
    ];

    return (
        <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950">

            <div className="border-b border-slate-800 p-8">
                <h1 className="text-2xl font-bold text-white">
                    ReadQuest
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Admin Panel
                </p>
            </div>

            <nav className="space-y-2 p-4">

                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `block rounded-xl px-4 py-3 font-medium transition ${
                                isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}

            </nav>

        </aside>
    );
};

export default AdminSidebar;