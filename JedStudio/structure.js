export function contentStructure(S) {
  const groups = [
    [
      'Learning & counselling',
      ['course', 'courseCategory', 'counsellingService', 'counsellingReview'],
    ],
    ['Stories & announcements', ['testimonial', 'placement', 'banner', 'update', 'faq']],
  ]
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('Contact & site settings')
        .child(S.document().schemaType('siteSettings').documentId('site-settings')),
      ...groups.map(([title, types]) =>
        S.listItem()
          .title(title)
          .child(
            S.list()
              .title(title)
              .items(types.map((type) => S.documentTypeListItem(type))),
          ),
      ),
    ])
}
