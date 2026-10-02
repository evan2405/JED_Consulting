import CoursePage from "../../../../components/CoursePage";
import { getCourse } from "../../../../Sainity/queries";
import { pageMetadata } from "../../../../lib/metadata";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getCourse(slug);
  return pageMetadata(
    c?.title || "Course not found",
    c?.description?.slice(0, 155) || "Programme information",
    "/courses/" + slug,
    c?.seo,
  );
}
export default async function Course({ params }) {
  return <CoursePage slug={(await params).slug} />;
}
