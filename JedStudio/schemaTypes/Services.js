import {approval, slugField, imageFields, link, strings, seo, curriculum, order} from './shared'
export default {
  name: 'counsellingService',
  title: 'Counselling services',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', validation: (r) => r.required()},
    slugField,
    {
      name: 'service',
      title: 'Enquiry category',
      type: 'string',
      options: {list: ['academic', 'career', 'financial']},
      validation: (r) => r.required(),
    },
    {name: 'short', title: 'Card heading', type: 'string'},
    {name: 'description', type: 'text'},
    ...imageFields,
    strings('items', 'Benefits'),
    strings('process', 'Counselling process'),
    curriculum,
    {
      name: 'offerings',
      title: 'Service offerings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', validation: (r) => r.required()},
            {name: 'eligibility', type: 'text'},
            strings('items', 'Included assistance'),
            {
              name: 'loanType',
              type: 'string',
              options: {list: ['Personal', 'Mortgage', 'Business', 'Startup', 'Others']},
            },
          ],
        },
      ],
    },
    {name: 'counsellorName', type: 'string'},
    {name: 'counsellorBio', type: 'text'},
    link('demoUrl', 'External demo URL'),
    {name: 'demoText', title: 'Orientation / demo page', type: 'text'},
    {name: 'relatedCourses', type: 'array', of: [{type: 'reference', weak: true, to: [{type: 'course'}]}]},
    seo,
    order,
    ...approval,
  ],
}
