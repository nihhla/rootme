import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import './App.css'

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/student/Dashboard';
import Books from './pages/student/Books';
import BookDetails from './pages/student/BookDetails';
import Reading from './pages/student/Reading';
import Quiz from './pages/student/Quiz';

import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
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
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/:id"
          element={
            <ProtectedRoute>
              <Reading />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/:id/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;