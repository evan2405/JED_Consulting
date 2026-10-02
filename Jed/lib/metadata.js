import { safeUrl } from "./validation.js";
export function pageMetadata(title, description, path, seo = {}) {
  const image = safeUrl(seo?.image) || "/logo.png";
  const resolvedTitle = seo?.title || title;
  const resolvedDescription = seo?.description || description;
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: path,
      images: [{ url: image, alt: resolvedTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [image],
    },
  };
}
