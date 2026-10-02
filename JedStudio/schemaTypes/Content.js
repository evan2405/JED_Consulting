import {approval, slugField, imageFields, link, strings, seo, order} from './shared'
const title = {name: 'title', type: 'string', validation: (r) => r.required().max(200)}
const description = {name: 'description', type: 'text'}
const points = (name, label) => ({
  name,
  title: label,
  type: 'array',
  of: [{type: 'object', fields: [title, {name: 'text', type: 'text'}]}],
})
export const extraContentTypes = [
  {
    name: 'courseCategory',
    title: 'Course categories',
    type: 'document',
    fields: [title, slugField, description, order, ...approval],
  },
  {
    name: 'counsellingReview',
    title: 'Counselling reviews',
    type: 'document',
    fields: [
      title,
      {name: 'author', type: 'string', validation: (r) => r.required()},
      {name: 'quote', type: 'text', validation: (r) => r.required()},
      {name: 'service', type: 'reference', weak: true, to: [{type: 'counsellingService'}]},
      ...imageFields,
      order,
      ...approval,
    ],
  },
  {
    name: 'testimonial',
    title: 'Testimonials',
    type: 'document',
    fields: [
      title,
      {name: 'author', type: 'string', validation: (r) => r.required()},
      {name: 'quote', type: 'text', validation: (r) => r.required()},
      {name: 'course', type: 'reference', weak: true, to: [{type: 'course'}]},
      ...imageFields,
      order,
      ...approval,
    ],
  },
  {
    name: 'placement',
    title: 'Placements',
    type: 'document',
    fields: [
      title,
      {name: 'studentName', type: 'string', validation: (r) => r.required()},
      {name: 'course', type: 'string'},
      {name: 'company', type: 'string', validation: (r) => r.required()},
      {name: 'position', type: 'string'},
      {name: 'package', title: 'Approved salary/package information', type: 'string'},
      {name: 'year', type: 'number', validation: (r) => r.min(2000).max(2100)},
      {name: 'testimonial', type: 'text'},
      ...imageFields,
      order,
      ...approval,
    ],
  },
  {
    name: 'update',
    title: 'Latest updates',
    type: 'document',
    fields: [
      title,
      slugField,
      description,
      {
        name: 'category',
        type: 'string',
        options: {list: ['admissions', 'courses', 'exams', 'notices', 'offers', 'events']},
      },
      link('link', 'Optional link'),
      {name: 'publishAt', type: 'datetime'},
      ...imageFields,
      seo,
      order,
      ...approval,
    ],
  },
  {
    name: 'siteSettings',
    title: 'Contact & site settings',
    type: 'document',
    fields: [
      {name: 'organization', type: 'string', validation: (r) => r.required()},
      {name: 'location', type: 'string'},
      {name: 'address', type: 'text'},
      {name: 'phone', type: 'string'},
      {name: 'email', type: 'string', validation: (r) => r.email()},
      {name: 'hours', type: 'string'},
      link('mapUrl', 'Map link'),
      {
        name: 'mapEmbedUrl',
        title: 'Google Maps embed URL',
        type: 'url',
        description:
          'Google Maps → Share → Embed a map: paste only the URL inside src="…". Clear this field to hide the interactive map.',
        validation: (rule) =>
          rule.custom((value) => {
            if (!value) return true
            try {
              const url = new URL(value)
              return (
                (url.origin === 'https://www.google.com' &&
                  url.pathname === '/maps/embed' &&
                  !!url.searchParams.get('pb') &&
                  !url.username &&
                  !url.password) ||
                'Use a Google Maps embed URL from www.google.com/maps/embed.'
              )
            } catch {
              return 'Enter a valid Google Maps embed URL.'
            }
          }),
      },
      link('whatsapp', 'WhatsApp'),
      link('instagram', 'Instagram'),
      {
        name: 'membershipFee',
        title: 'Annual membership fee (INR)',
        type: 'number',
        validation: (r) => r.min(0),
      },
      strings('membershipBenefits', 'Membership includes'),
      strings('partners', 'Approved employer / opportunity names'),
      {name: 'footerDescription', type: 'text'},
      {name: 'contactTitle', type: 'string'},
      {name: 'contactDescription', type: 'text'},
      {name: 'placementTitle', type: 'string'},
      {name: 'placementDescription', type: 'text'},
      ...approval,
    ],
  },
  {
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
      {name: 'heroEyebrow', type: 'string'},
      {name: 'heroTitle', type: 'string'},
      {name: 'heroSubtitle', type: 'string'},
      {name: 'heroAccent', type: 'string'},
      {name: 'heroDescription', type: 'text'},
      ...imageFields,
      {name: 'photoCaption', type: 'string'},
      points('benefits', 'Benefits strip'),
      {name: 'courseTitle', type: 'string'},
      {name: 'courseDescription', type: 'text'},
      {name: 'whyTitle', type: 'string'},
      {name: 'whyDescription', type: 'text'},
      points('steps', 'Our approach'),
      {name: 'membershipTitle', type: 'string'},
      {name: 'membershipDescription', type: 'text'},
      {
        name: 'statistics',
        title: 'Verified statistics (leave empty without evidence)',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              title,
              {name: 'value', type: 'string', validation: (r) => r.required()},
              {
                name: 'source',
                title: 'Public source / context',
                type: 'string',
                validation: (r) => r.required(),
              },
            ],
          },
        ],
      },
      ...approval,
    ],
  },
]
