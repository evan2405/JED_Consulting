import PublicPage from "../../../components/PublicPage";
import CourseList from "../../../components/CourseList";
import { courseCards } from "../../../lib/course-cards";
import { getCourses } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Professional courses",
  "Explore accounting, finance, language and career training with J.ed in Shillong.",
  "/courses",
);
export default async function Courses() {
  const { courses, unavailable } = await getCourses();
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">LEARN WITH DIRECTION</p>
          <h1>Find your next programme.</h1>
          <p>
            Explore your options, compare details and talk to our academic
            counselling team.
          </p>
        </div>
      </section>
      <section id="courses" className="section container">
        {unavailable && (
          <p className="notice">
            Live course updates are temporarily unavailable. Ask our team for
            current information.
          </p>
        )}
        <CourseList courses={courseCards(courses)} initialExpanded />
      </section>
    </PublicPage>
  );
}
