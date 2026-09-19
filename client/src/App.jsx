import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import DashboardView from './components/views/DashboardView';
import DraftingView from './components/views/DraftingView';
import PredictorView from './components/views/PredictorView';
import HeatmapView from './components/views/HeatmapView';
import GradesView from './components/views/GradesView';

import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCourses(data.courses || []);
        // Format or attach default fallbacks for missing properties like weight
        const formattedAssignments = (data.upcomingAssignments || []).map((task) => ({
          ...task,
          weight: task.weight || 'Assignment',
        }));
        setAssignments(formattedAssignments);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load Canvas dashboard data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const renderView = () => {
    if (loading) {
      return (
        <div className="placeholder-card">
          <h2>Syncing with Canvas...</h2>
          <p>Fetching active courses and upcoming deadlines.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="placeholder-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h2 style={{ color: '#ef4444' }}>Canvas Sync Error</h2>
          <p>{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            courses={courses}
            assignments={assignments}
            setActiveTab={setActiveTab}
          />
        );
      case 'drafting':
        return <DraftingView courses={courses}/* assignments={assignments} *//>;
      case 'predictor':
        return <PredictorView courses={courses} />;
      case 'heatmap':
        return <HeatmapView assignments={assignments} />;
      case 'grades':
        return <GradesView courses={courses} />;
      default:
        return (
          <DashboardView
            courses={courses}
            assignments={assignments}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="workspace">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">{renderView()}</main>
      </div>
    </div>
  );
}