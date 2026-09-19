import './Dashboard.css';

export default function AssignmentCard({ task }) {
  const formattedDate = task.dueAt
    ? new Date(task.dueAt).toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No Due Date';

  const getUrgencyClass = (dueAt) => {
    if (!dueAt) return 'due-normal';

    const now = new Date();
    const due = new Date(dueAt);
    const diffInHours = (due - now) / (1000 * 60 * 60);

    if (diffInHours <= 24) return 'due-urgent';  // < 24 hrs
    if (diffInHours <= 72) return 'due-warning'; // 1-3 days
    return 'due-normal';                         // > 3 days
  };

  const isTAContext = task.courseRole === 'TA';

  return (
    <div className={`radar-card ${isTAContext ? 'ta-assignment-card' : ''}`}>
      <div>
        <div className="task-info-header">
          <span className="course-code">{task.courseCode || 'GENERAL'}</span>
          {isTAContext ? (
            <span className="ta-review-badge">🔍 TA Review</span>
          ) : (
            <span className="weight-badge">{task.weight || 'Task'}</span>
          )}
        </div>
        <div className="task-title">{task.name}</div>
      </div>
      <div className="task-meta">
        <div className={`due-time ${getUrgencyClass(task.dueAt)}`}>
          {formattedDate}
        </div>
        <div className="points-badge">
          <strong>{task.pointsPossible ?? 0}</strong> <span className="points-label">pts</span>
        </div>
      </div>
    </div>
  );
}