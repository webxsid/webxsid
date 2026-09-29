// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { createCssVariablesTheme } from 'shiki';
import { SITE_URL } from './site.config.js';


// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), react()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: createCssVariablesTheme({
        variablePrefix: '--code-',
        variableDefaults: {
          background: 'rgb(23 23 27)',
          foreground: 'rgb(238 238 242)',
          'token-comment': 'rgb(158 158 168)',
          'token-string': 'rgb(102 187 106)',
          'token-constant': 'rgb(93 184 205)',
          'token-keyword': 'rgb(124 145 255)',
          'token-parameter': 'rgb(224 170 44)',
          'token-function': 'rgb(198 140 255)',
          'token-string-expression': 'rgb(102 187 106)',
          'token-punctuation': 'rgb(238 238 242)',
          'token-link': 'rgb(124 145 255)',
          'token-inserted': 'rgb(102 187 106)',
          'token-deleted': 'rgb(224 170 44)',
        },
      }),
    },
  },
  output: "static",
  site: SITE_URL,
});
