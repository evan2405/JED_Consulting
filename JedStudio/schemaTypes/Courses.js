import {curriculum, seo, link, imageFields} from './shared'
export default {
  name: 'course',
  title: 'Courses',
  type: 'document',
  fields: [
    curriculum,
    seo,
    {name: 'shortDescription', type: 'text', rows: 3},
    {
      name: 'curriculumStatus',
      type: 'string',
      initialValue: 'awaiting-material',
      options: {list: ['awaiting-material', 'overview', 'approved']},
    },
    link('demoUrl', 'External demo URL'),
    {name: 'demoText', title: 'Orientation / demo page', type: 'text'},
    {name: 'counsellingAvailable', type: 'boolean', initialValue: true},
    {
      name: 'isDemo',
      title: 'Development sample (hidden in production)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'categoryReference',
      title: 'Managed category (overrides legacy category)',
      type: 'reference',
      weak: true,
      to: [{type: 'courseCategory'}],
    },
    imageFields[1],
    {
      name: 'approved',
      title: 'Approved for publication',
      type: 'boolean',
      initialValue: false,
      description: 'Only publish after the client approves claims, fees and programme details.',
    },
    {name: 'eligibility', title: 'Eligibility', type: 'text'},
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    // ── Media ──────────────────────────────────────────────────────────
    {
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      validation: imageFields[0].validation,
    },
    // ── Classification ─────────────────────────────────────────────────
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Professional', value: 'professional'},
          {title: 'Development', value: 'development'},
          {title: 'Language & career', value: 'career'},
          {title: 'Accounting & finance', value: 'Accounting & finance'},
          {title: 'Career & language', value: 'Career & language'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'Beginner'},
          {title: 'Intermediate', value: 'Intermediate'},
          {title: 'Advanced', value: 'Advanced'},
          {title: 'All Levels', value: 'All Levels'},
        ],
        layout: 'radio',
      },
    },
    // ── Pricing & Duration ─────────────────────────────────────────────
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g. "6 Months", "12 Weeks"',
    },
    {
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'isFree',
      title: 'Is Free?',
      type: 'boolean',
    },
    // ── Certification & Accreditation ──────────────────────────────────
    {
      name: 'accreditation',
      title: 'Accreditation Body',
      type: 'string',
      description: 'e.g. "ACCA", "CPA Australia", "CIMA"',
    },
    {
      name: 'examDates',
      title: 'Upcoming Exam Dates',
      type: 'string',
      description: 'e.g. "March, June, September, December"',
    },
    // ── Resources ──────────────────────────────────────────────────────
    {
      name: 'syllabusUrl',
      validation: (Rule) => Rule.uri({scheme: ['https'], allowRelative: true}),
      title: 'Syllabus PDF URL',
      type: 'url',
      description: 'Link to downloadable syllabus PDF',
    },
    {
      name: 'enrollmentLink',
      validation: (Rule) => Rule.uri({scheme: ['https'], allowRelative: true}),
      title: 'Enrollment Link',
      type: 'url',
    },
    // ── Reviews ────────────────────────────────────────────────────────
    {
      name: 'reviews',
      title: 'Student Reviews',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'author', title: 'Student Name', type: 'string'},
            {name: 'role', title: 'Role / Course Track', type: 'string'},
            {name: 'quote', title: 'Review Quote', type: 'text'},
            {
              name: 'rating',
              title: 'Rating (1–5)',
              type: 'number',
              validation: (Rule) => Rule.min(1).max(5),
            },
          ],
          preview: {
            select: {title: 'author', subtitle: 'quote'},
          },
        },
      ],
    },
  ],
}
