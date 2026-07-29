export default {
  name: 'submission',
  title: 'Customer Enquiries',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'country',
      title: 'Country of Residence',
      type: 'string',
    },
    {
      name: 'preferredDestination',
      title: 'Preferred Study Destination',
      type: 'string',
      options: {
        list: [
          { title: 'United Kingdom', value: 'UK' },
          { title: 'United States', value: 'USA' },
          { title: 'Canada', value: 'Canada' },
          { title: 'Australia', value: 'Australia' },
          { title: 'Germany', value: 'Germany' },
          { title: 'Other', value: 'Other' },
        ],
      },
    },
    {
      name: 'interestedCourse',
      title: 'Interested Course',
      type: 'string',
    },
    {
      name: 'service',
      title: 'Interested Service',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
    },
    {
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    },
  ],

  // Only allow deletion — form creates records, not studio users
  __experimental_actions: ['delete'],
}