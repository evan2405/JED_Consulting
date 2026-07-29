import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { exportEnquiriesPlugin } from './plugins/exportEnquiriesPlugin.js'

export default defineConfig({
  name: 'Jed-Consultancy',
  title: 'Jed',

  projectId: '62ycsw57',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), exportEnquiriesPlugin()],

  schema: {
    types: schemaTypes,
  },
})
