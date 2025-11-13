import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserProvider, useUser } from '@/context/UserContext';
import { Header } from '@/components/Header';
import { UserSelector } from '@/components/UserSelector';
import { Dashboard } from '@/pages/Dashboard';
import { Tasks } from '@/pages/Tasks';
import Projects from './pages/Projects';
import { Activity } from '@/pages/Activity';
import type { User } from '@/types';

function AppContent() {
  const { currentUser, setCurrentUser, isUserSelected } = useUser();

  if (!isUserSelected) {
    return <UserSelector onUserSelect={setCurrentUser} />;
  }

  return (
    <div className="App">
      <Header currentUser={currentUser} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
