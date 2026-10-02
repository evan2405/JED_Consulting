import {defineConfig} from 'sanity'
import ContentDashboard from './plugins/ContentDashboard.jsx'
import {contentStructure} from './structure'
import {structureTool} from 'sanity/structure'
import {contentTypes, enquiryTypes} from './schemaTypes'
import {exportEnquiriesPlugin} from './plugins/exportEnquiriesPlugin.js'
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '62ycsw57'
const contentDataset = process.env.SANITY_STUDIO_DATASET || 'production'
const enquiryDataset = process.env.SANITY_STUDIO_ENQUIRY_DATASET
export default defineConfig([
  {
    name: 'content',
    title: 'J.Ed — Website content',
    basePath: '/content',
    projectId,
    dataset: contentDataset,
    plugins: [
      {
        name: 'jed-dashboard',
        tools: [{name: 'dashboard', title: 'Dashboard', component: ContentDashboard}],
      },
      structureTool({structure: contentStructure}),
      exportEnquiriesPlugin(),
    ],
    document: {
      newDocumentOptions: (options) =>
        options.filter((item) => !['homepage', 'siteSettings'].includes(item.templateId)),
      actions: (actions, context) =>
        ['homepage', 'siteSettings'].includes(context.schemaType)
          ? actions.filter((a) => !['delete', 'duplicate', 'unpublish'].includes(a.action))
          : actions,
    },
    schema: {types: contentTypes},
  },
  ...(enquiryDataset && enquiryDataset !== contentDataset
    ? [
        {
          name: 'enquiries',
          title: 'J.Ed — Private enquiries',
          basePath: '/enquiries',
          projectId,
          dataset: enquiryDataset,
          plugins: [structureTool(), exportEnquiriesPlugin()],
          schema: {types: enquiryTypes},
          document: {
            actions: (actions, context) => (context.schemaType === 'auditEvent' ? [] : actions),
          },
        },
      ]
    : []),
])
