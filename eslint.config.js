import js from '@eslint/js'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': await import('typescript-eslint'),
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
    },
  },
  prettier,
]
