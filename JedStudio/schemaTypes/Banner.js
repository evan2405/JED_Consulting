import {approval, imageFields} from './shared'
export default {
  name: 'banner',
  title: 'Banners',
  type: 'document',
  fields: [
    ...approval,
    {name: 'title', type: 'string', validation: (r) => r.required().max(160)},
    {name: 'subtitle', type: 'text'},
    {...imageFields[0]},
    imageFields[1],
    {name: 'ctaText', title: 'Link text', type: 'string'},
    {
      name: 'ctaLink',
      title: 'Link',
      type: 'url',
      validation: (r) => r.uri({scheme: ['https'], allowRelative: true}),
    },
    {name: 'isActive', title: 'Active', type: 'boolean', initialValue: false},
    {
      name: 'placement',
      type: 'string',
      initialValue: 'homepage_top',
      options: {
        list: [
          {title: 'Latest updates', value: 'updates'},
          {title: 'Homepage top', value: 'homepage_top'},
          {title: 'Homepage bottom', value: 'homepage_bottom'},
          {title: 'Homepage feature', value: 'homepage'},
          {title: 'Promotional', value: 'promotional'},
        ],
      },
    },
    {name: 'publishAt', title: 'Publish at', type: 'datetime'},
    {
      name: 'expiresAt',
      title: 'Expires at',
      type: 'datetime',
      validation: (r) =>
        r.custom(
          (value, context) =>
            !value ||
            !context.document.publishAt ||
            new Date(value) > new Date(context.document.publishAt) ||
            'Expiry must be after publication.',
        ),
    },
    {name: 'order', type: 'number', initialValue: 0},
  ],
}
