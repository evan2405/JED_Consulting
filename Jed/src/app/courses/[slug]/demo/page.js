import { notFound } from "next/navigation";
import DemoPage from "../../../../../components/DemoPage";
import { getCourse } from "../../../../../Sainity/queries";
import { pageMetadata } from "../../../../../lib/metadata";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = await getCourse(slug);
  return pageMetadata(
    (r?.title || "Programme") + " introduction",
    "Explore the programme or counselling process before making an enquiry.",
    "/courses/" + slug + "/demo",
  );
}
export default async function Demo({ params }) {
  const r = await getCourse((await params).slug);
  if (!r) notFound();
  return <DemoPage record={r} kind="courses" />;
}
