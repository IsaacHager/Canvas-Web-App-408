# Canvas Desk

Provides a quick and easy view of Canvas Assignments and Courses, with plans to add tools to help manage and work on projects. 

## Reflection

I started working on this fairly apprehensively, as I struggled to understand what was actually going on in the Hello World program.
It all seemed to blur into abstraction at some point. Luckily, in this case things went much smoother. I got most of the features of
the page up while fully understanding what I was doing at every step and how to proceed. I started to get very excited about the
project when I saw my canvas courses appear on the site. I started to see how much I might be able to do with this framework. My goal
was to make a sort of workspace environment with a quick view of immediate assignments. I wanted to make a "Drafting Table" that would
let me manage several files and resources and store them in incomplete states in a nice visual environment. Then I could drag them 
around to different assignments, look at file or version diffs, or do small edits along side a rubric. I got very excited at the prospect
of including a basic PDF editor, because I can never find convenient ways to do that.

I started to put all of these things together, and I ran into a bit of a momentum issue. I wanted to have the page in a good well-rounded
state before pushing it to GitHub and leaving it for the day. My vision of this 'well-rounded state' continued to change as I worked.
At the beginning, it was something simple to satisfy the assignment that could list my upcoming assignments and important details. Then
I decided I neded to store something in a database, so I ought to incorporate the file rough drafting page. Eventually I was trying to
rapidly finish so many things to just be done that I realized I really wasn't making the thing I wanted to anymore. So I cut back to the
place where I really understood what was happening, tried to figure out recursive page parsing and error handling quickly (and poorly),
and ended up with step 1 of a proof of concept of the app I want to make. I'm still very happy with the dashboard page, and I'm excited
again to see what the rest of it might look like if I actually approach it in a reasonable manner.

## Future Plans

I'd like to drastically change the style of the site. I want something that feels light and personal, not like every other AI-generated
rounded-corners corporate template do-it-yourself site out there. I'd love it to feel almost like a virtual desk, with sidebars that look
like notebook paper, wallpaper images, and so on. I want it to feel calming and tactile to work with.

I want to develop a "Drafting Table" tab as I mentioned earlier. It would be very convenient to have most of the tools I need to do simple
edits and assignment management all in one little workspace. To be able to have notes visible in the same window as an assignment rubric
and a text document, that sort of thing.

I had other tabs like "Predictor" (which should really be called grade calculator) or "Heatmap" for visually representing assignment
data and urgency and such, but those are really unecessary and overly fancy. I don't need any of those. Something I do want to add is
a way to quickly and easily see my grades across all of my courses. I think that actually would be an improvement over Canvas, where
much of that information (especially comments and graded rubrics) can be fairly hidden.

## Getting Started

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/IsaacHager/Canvas-Web-App-408.git
   ```
2. Create .env file
   ```bash
   touch .env
   ```
   Add lines: <br />
      PORT=PORT_TO_LISTEN_ON <br />
      CANVAS_URL=https://boisestatecanvas.instructure.com <br />
      CANVAS_API_TOKEN=YOUR_TOKEN <br />
3. Install dependencies:
   ```bash
   cd /client
   npm install
   cd ../server
   npm install
   ```
4. Start server
   ```bash
   npm run devStart
   ```
5. Start Vite
   ```bash
   cd ../client
   npm run dev
   ```
6. Check command line output to see what port Vite is running on

## API Endpoints Used

- /api/v1/users/self/favorites/courses : Gets information about favorited courses (Term, Class Role, Banner Image)
- /api/v1/courses/:courseID/assignments : Gets assignments from a given course
- /api/v1/users/self/profile : Gets profile information (Name, Email, Picture)
