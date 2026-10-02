import PublicPage from "../../../components/PublicPage";
import Link from "next/link";
import { getServices } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Counselling services",
  "Academic, career and financial guidance for your next step.",
  "/counselling",
);
export default async function Counselling() {
  const services = await getServices();
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">GUIDANCE BUILT AROUND YOU</p>
          <h1>A clearer next step.</h1>
          <p>Explore academic, career and financial counselling.</p>
        </div>
      </section>
      <section className="section container">
        <div className="course-grid">
          {services.map((s) => (
            <Link
              className="course-card"
              href={"/counselling/" + s.slug.current}
              prefetch={false}
              key={s._id}
            >
              <h2>{s.title}</h2>
              <p>{s.description}</p>
              <span className="text-link">Explore counselling ↗</span>
            </Link>
          ))}
        </div>
        {!services.length && (
          <p className="notice">
            Service information is currently unavailable.{" "}
            <Link href="/contact">Contact J.ed for guidance.</Link>
          </p>
        )}
      </section>
    </PublicPage>
  );
}
