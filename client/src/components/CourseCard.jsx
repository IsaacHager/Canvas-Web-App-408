import './Dashboard.css';

export default function CourseCard({ course, onOpenDrafts, onOpenPredictor }) {
  const isTA = course.role === 'TA';

  return (
    <div className="course-card">
      {/* Banner / Image Header */}
      <div
        className="course-banner"
        style={{
          backgroundImage: course.imageUrl ? `url(${course.imageUrl})` : undefined,
        }}
      >
        <div className="banner-overlay">
          <span className={`role-badge ${isTA ? 'role-ta' : 'role-student'}`}>
            {course.role}
          </span>
          <span className="term-text">{course.term}</span>
        </div>
      </div>

      <div className="course-card-body">
        <h4 className="course-title">{course.name}</h4>
        <p className="course-subcode">{course.courseCode}</p>

        <div className="card-actions">
          <button className="btn-primary" onClick={() => onOpenDrafts(course.id)}>
            {isTA ? 'TA Drafts' : 'Drafts'}
          </button>
          <button className="btn-secondary" onClick={() => onOpenPredictor(course.id)}>
            {isTA ? 'Overview' : 'Predictor'}
          </button>
        </div>
      </div>
    </div>
  );
}