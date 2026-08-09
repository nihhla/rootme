import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import './App.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/student/Dashboard';
import Books from './pages/student/Books';
import BookDetails from './pages/student/BookDetails';
import Reading from './pages/student/Reading';
import Quiz from './pages/student/Quiz';
import Gamification from './pages/student/Gamification';
import Badges from './pages/student/Badges';
import Challenges from './pages/student/Challenges';
import Reviews from './pages/student/Reviews';
import Analytics from './pages/student/Analytics';

import StudentRoute from './routes/StudentRoutes';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './pages/auth/AdminRoute';

import AdminBooks from './pages/admin/AdminBooks';
import AdminStudents from './pages/admin/AdminStudents';

import RoleRedirect from './pages/auth/RoleRedirect';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<RoleRedirect />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <StudentRoute>
                            <Dashboard />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/books"
                    element={
                        <StudentRoute>
                            <Books />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/books/:id"
                    element={
                        <StudentRoute>
                            <BookDetails />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/reading/:id"
                    element={
                        <StudentRoute>
                            <Reading />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/reading/:id/quiz"
                    element={
                        <StudentRoute>
                            <Quiz />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/gamification"
                    element={
                        <StudentRoute>
                            <Gamification />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/badges"
                    element={
                        <StudentRoute>
                            <Badges />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/challenges"
                    element={
                        <StudentRoute>
                            <Challenges />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/reviews"
                    element={
                        <StudentRoute>
                            <Reviews />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <StudentRoute>
                            <Analytics />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/books"
                    element={
                        <AdminRoute>
                            <AdminBooks />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/students"
                    element={
                        <AdminRoute>
                            <AdminStudents />
                        </AdminRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default App;