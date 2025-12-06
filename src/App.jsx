import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import Dashboard from './components/Dashboard'; // (Lo crearemos después)
import CreateCircle from './components/CreateCircle';
import CircleDetail from './components/CircleDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-circle" element={<CreateCircle />} />
          <Route path="/circle/:id" element={<CircleDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
