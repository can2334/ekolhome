"use client";

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'EkolHome',

  // Sanity Dashboard'dan aldığın bilgiler
  projectId: 'pvnpssbh',
  dataset: 'production',

  // Admin panelinin hangi URL'de çalışacağını belirler
  // Tarayıcıda http://localhost:3000/admin yazınca açılması için:
  basePath: '/admin',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})