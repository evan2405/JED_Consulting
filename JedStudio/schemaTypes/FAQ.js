import {approval, order} from './shared'
export default {
  name: 'faq',
  title: 'FAQs',
  type: 'document',
  fields: [
    {name: 'question', type: 'string', validation: (r) => r.required().max(300)},
    {name: 'answer', type: 'text', validation: (r) => r.required().max(4000)},
    order,
    ...approval,
  ],
}
