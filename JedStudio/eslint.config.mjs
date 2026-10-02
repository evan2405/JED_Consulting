import studio from '@sanity/eslint-config-studio'
export default [
  ...studio,
  {ignores: ['dist/**', '.sanity/**']},
  {languageOptions: {globals: {process: 'readonly', URL: 'readonly'}}},
]
