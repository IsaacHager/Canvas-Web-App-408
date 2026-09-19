import { useState } from 'react';
import AssignmentCard from '../AssignmentCard';
import CourseCard from '../CourseCard';
import '../Dashboard.css';

const DISPLAY_LIMIT = 10;

export default function DashboardView({ courses, assignments, setActiveTab }) {
  const [showAll, setShowAll] = useState(false);

  const hasMoreThanLimit = assignments.length > DISPLAY_LIMIT;

  // Strict truncation to DISPLAY_LIMIT when collapsed
  const displayedAssignments = showAll
    ? assignments
    : assignments.slice(0, DISPLAY_LIMIT);

  // Group displayed items by course code
  const groupedAssignments = displayedAssignments.reduce((acc, task) => {
    const code = task.courseCode || 'OTHER';
    if (!acc[code]) acc[code] = [];
    acc[code].push(task);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      {/* 7-Day Priority Radar */}
      <section>
        <h3 className="section-title">Next 7 Days Priority Radar</h3>
        
        {assignments.length === 0 ? (
          <div className="placeholder-card">
            <p style={{ margin: 0, color: '#64748b' }}>No assignments due in the next 7 days 🎉</p>
          </div>
        ) : (
          <div className="radar-list-wrapper">
            {Object.entries(groupedAssignments).map(([courseCode, taskGroup]) => (
              <div key={courseCode} style={{ marginBottom: '1rem' }}>
                <div className="course-group-header">{courseCode}</div>
                <div className="radar-list">
                  {taskGroup.map((task) => (
                    <AssignmentCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}

            {hasMoreThanLimit && (
              <button className="see-more-btn" onClick={() => setShowAll(!showAll)}>
                {showAll 
                  ? `Show Top ${DISPLAY_LIMIT}` 
                  : `See More (+${assignments.length - DISPLAY_LIMIT})`
                }
              </button>
            )}
          </div>
        )}
      </section>

      {/* Active Courses */}
      <section>
        <h3 className="section-title">Active Courses</h3>
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpenDrafts={() => setActiveTab('drafting')}
              onOpenPredictor={() => setActiveTab('predictor')}
            />
          ))}
        </div>
      </section>
    </div>
  );
}