import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📌' },
    { id: 'drafting', label: 'Drafting Table', icon: '📝' },
    { id: 'predictor', label: 'Grade Predictor', icon: '🧮' },
    { id: 'heatmap', label: 'Workload Matrix', icon: '🗺️' },
    { id: 'grades', label: 'Grades Hub', icon: '📊' },
  ];

  return (
    <aside className="sidebar">
      <nav className="nav-list">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-button ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}