// Keep curricula, SEO and detail-page fields out of client-side filter props.
export function courseCards(courses) {
  return courses.map(
    ({ _id, title, slug, description, category, duration }) => ({
      _id,
      title,
      slug,
      description,
      category,
      duration,
    }),
  );
}
