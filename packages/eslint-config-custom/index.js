module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jest-formatting/strict',
  ],
  env: {
    jest: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    curly: 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'jest/valid-title': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description', minimumDescriptionLength: 5 },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        alphabetize: { order: 'asc' },
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off', // we have TS for that
  },
}
