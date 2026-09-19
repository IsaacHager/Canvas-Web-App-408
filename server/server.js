const express = require('express');
require('dotenv').config();

const app = express();

const CANVAS_URL = process.env.CANVAS_URL;
const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


app.get('/', (req, res) => {
    console.log('URL:', CANVAS_URL, 'TOKEN:', CANVAS_TOKEN ? 'EXISTS' : 'MISSING');
});

// Helper to recursively fetch all Canvas pages and handle HTTP errors
async function fetchCanvasAllPages(endpoint) {
  if (!CANVAS_TOKEN) {
    throw new Error('MISSING_TOKEN: Canvas API access token is missing from environment.');
  }

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${CANVAS_URL}${endpoint}`;
  let accumulatedResults = [];

  while (url) {
    let response;
    try {
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${CANVAS_TOKEN}` },
      });
    } catch (networkErr) {
      throw new Error('NETWORK_ERROR: Unable to reach Canvas API server.');
    }

    if (!response.ok) {
      if (response.status === 401) throw new Error('UNAUTHORIZED: Canvas token is invalid or expired.');
      if (response.status === 403) throw new Error('FORBIDDEN: You lack permission for this course resource.');
      if (response.status === 404) throw new Error('NOT_FOUND: The requested Canvas resource was not found.');
      throw new Error(`CANVAS_HTTP_ERROR_${response.status}: Canvas server returned status ${response.status}`);
    }

    const data = await response.json();

    // If result is not an array (e.g. single profile object), return directly
    if (!Array.isArray(data)) {
      return data;
    }

    accumulatedResults.push(...data);

    // Parse Link header for rel="next"
    const linkHeader = response.headers.get('link');
    url = null; // Default break unless 'next' exists

    if (linkHeader) {
      const links = linkHeader.split(',');
      for (const link of links) {
        const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
        if (match && match[2] === 'next') {
          url = match[1];
          break;
        }
      }
    }
  }

  return accumulatedResults;
}

// Dashboard API endpoint
app.get('/api/dashboard', async (req, res) => {
    try {
        // Fetch favorited courses
        const rawCourses = await fetchCanvasAllPages(`${CANVAS_URL}/api/v1/users/self/favorites/courses?include[]=term&include[]=enrollments&include[]=course_image`);

        // Cleanup verify id and name
        const courses = (Array.isArray(rawCourses) ? rawCourses : [])
            .filter((c) => c.id && c.name)
            .map((c) => {
                // Find role from enrollments array
                const enrollTypes = (c.enrollments || []).map((e) => e.type || e.role);
                let role = 'Student';
                if (enrollTypes.includes('TaEnrollment') || enrollTypes.includes('ta')) {
                    role = 'TA';
                } else if (enrollTypes.includes('TeacherEnrollment') || enrollTypes.includes('teacher')) {
                    role = 'Teacher';
                }

                return {
                    id: c.id,
                    name: c.name,
                    courseCode: c.course_code || 'GENERAL',
                    term: c.term?.name || 'N/A',
                    role: role,
                    imageUrl: c.image_download_url || c.course_image || null,
                };
            });

        console.log(`[Dashboard] Loaded ${courses.length} courses from Canvas.`);

        // Fetch assignments for each active course
        const assignmentPromises = courses.map(async (course) => {
            try {
                const rawAssignments = await fetchCanvasAllPages(`/api/v1/courses/${course.id}/assignments`);

                if (!Array.isArray(rawAssignments)) return [];

                return rawAssignments.map((a) => ({
                    id: a.id,
                    courseId: course.id,
                    courseCode: course.courseCode,
                    name: a.name,
                    dueAt: a.due_at,
                    pointsPossible: a.points_possible,
                    htmlUrl: a.html_url,
                }));
            } catch (err) {
                console.error(`Error fetching assignments for course ${course.id}:`, err);
                return [];
            }
        });

        const assignmentResults = await Promise.all(assignmentPromises);

        // Filter for upcoming deadlines within the next 7 days
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcomingAssignments = assignmentResults
            .flat()
            .filter((a) => {
                if (!a.dueAt) return false;
                const dueDate = new Date(a.dueAt);
                return dueDate >= now && dueDate <= sevenDaysFromNow;
            })
            .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));

        console.log(`[Dashboard] Loaded ${upcomingAssignments.length} total assignments with due dates.`);

        res.json({ courses, upcomingAssignments });
    } catch (error) {
        console.error('Error in /api/dashboard:', error);
        res.status(500).json({ error: 'Failed to load dashboard data.' });
    }
});

// Profile API endpoint
app.get('/api/user/profile', async (req, res) => {
    try {
        const profileRes = await fetch(`${CANVAS_URL}/api/v1/users/self/profile`, {
            headers: { Authorization: `Bearer ${CANVAS_TOKEN}` },
        });

        if (!profileRes.ok) {
            console.error('Canvas profile fetch error:', profileRes.status, profileRes.statusText);
            return res.status(profileRes.status).json({ error: 'Failed to fetch user profile' });
        }

        const data = await profileRes.json();

        res.json({
            id: data.id,
            name: data.name,
            shortName: data.short_name || data.name,
            avatarUrl: data.avatar_image_url || data.avatar_url,
            primaryEmail: data.primary_email || '',
            title: data.title || 'DeskCanvas Member',
        });
    } catch (error) {
        console.error('Error in /api/user/profile:', error);
        res.status(500).json({ error: 'Failed to load profile details.' });
    }
});