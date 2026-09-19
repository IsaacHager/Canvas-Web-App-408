import './Dashboard.css';

export default function Dashboard({ courses, assignments }) {
  return (
    <div className="dashboard-container">
      <section>
        <h3 className="section-title">Up Next Priority Radar</h3>
        <div className="radar-list">
          {assignments.map((task) => (
            <div key={task.id} className="radar-card">
              <div>
                <div className="task-info-header">
                  <span className="course-code">{task.courseCode}</span>
                  <span className="weight-badge">{task.weight}</span>
                </div>
                <div className="task-title">{task.name}</div>
              </div>
              <div className="task-meta">
                <div className="due-time">
                  {new Date(task.dueAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
                <div className="points-text">{task.pointsPossible} pts</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="section-title">Active Courses</h3>
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <span className="term-text">{course.term}</span>
              <h4 className="course-title">{course.name}</h4>
              <p className="course-subcode">{course.courseCode}</p>
              
              <div className="card-actions">
                <button className="btn-primary">Drafts</button>
                <button className="btn-secondary">Predictor</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}