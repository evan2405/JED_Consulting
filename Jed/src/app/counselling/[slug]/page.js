import ServicePage from "../../../../components/ServicePage";
import { getService } from "../../../../Sainity/queries";
import { pageMetadata } from "../../../../lib/metadata";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = await getService(slug);
  return pageMetadata(
    s?.title || "Service not found",
    s?.description?.slice(0, 155) || "Counselling information",
    "/counselling/" + slug,
    s?.seo,
  );
}
export default async function Service({ params }) {
  return <ServicePage slug={(await params).slug} />;
}
