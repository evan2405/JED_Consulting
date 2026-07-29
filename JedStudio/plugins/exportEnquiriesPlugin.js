import {definePlugin} from 'sanity'
import ExportEnquiriesTool from './ExportEnquiriesTool.jsx'

export const exportEnquiriesPlugin = definePlugin({
  name: 'export-enquiries-plugin',
  tools: [
    {
      name: 'export-enquiries',
      title: 'Export Enquiries',
      icon: () => '📥',
      component: ExportEnquiriesTool,
    },
  ],
})
