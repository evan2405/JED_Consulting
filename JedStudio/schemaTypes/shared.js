export const approval = [
  {name: 'approved', title: 'Approved for public display', type: 'boolean', initialValue: false},
  {
    name: 'isDemo',
    title: 'Development sample',
    type: 'boolean',
    initialValue: false,
    description: 'Samples are never displayed by the production website.',
  },
]
export const slugField = {
  name: 'slug',
  type: 'slug',
  options: {source: 'title', maxLength: 96},
  validation: (r) => r.required(),
}
export const imageFields = [
  {
    name: 'image',
    type: 'image',
    options: {hotspot: true},
    validation: (r) =>
      r.custom(async (value, context) => {
        if (!value?.asset?._ref) return true
        const asset = await context
          .getClient({apiVersion: '2026-01-01'})
          .getDocument(value.asset._ref)
        return (
          !asset ||
          (asset.size <= 5000000 &&
            ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(asset.mimeType)) ||
          'Use a JPEG, PNG, WebP or AVIF image below 5 MB.'
        )
      }),
  },
  {
    name: 'imageAlt',
    title: 'Image description',
    type: 'string',
    validation: (r) =>
      r.custom(
        (value, context) =>
          !context.document?.image?.asset ||
          Boolean(value?.trim()) ||
          'Describe this image for screen readers.',
      ),
  },
]
export const link = (name, title) => ({
  name,
  title,
  type: 'url',
  validation: (r) => r.uri({scheme: ['https'], allowRelative: true}),
})
export const strings = (name, title) => ({
  name,
  title,
  type: 'array',
  of: [{type: 'string'}],
  validation: (r) => r.max(50),
})
export const seo = {
  name: 'seo',
  title: 'Search & sharing',
  type: 'object',
  fields: [
    {name: 'title', type: 'string', validation: (r) => r.max(100)},
    {name: 'description', type: 'text', rows: 3, validation: (r) => r.max(300)},
    {name: 'image', title: 'Social sharing image', type: 'image'},
  ],
}
export const curriculum = {
  name: 'curriculum',
  title: 'Curriculum / service modules',
  type: 'array',
  validation: (r) => r.max(50),
  of: [
    {
      type: 'object',
      name: 'curriculumModule',
      fields: [
        {name: 'title', type: 'string', validation: (r) => r.required().max(200)},
        strings('topics', 'Topics in this module'),
      ],
      preview: {select: {title: 'title'}},
    },
  ],
}
export const order = {name: 'order', title: 'Display order', type: 'number', initialValue: 0}
