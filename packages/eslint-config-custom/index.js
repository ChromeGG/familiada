module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    // 'plugin:import/recommended', // cannot be shared because of conflict with nextjs eslint config
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
  ignorePatterns: ['node_modules', 'dist', 'generated'],
  rules: {
    curly: 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'jest/valid-title': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description', minimumDescriptionLength: 5 },
    ],
    '@typescript-eslint/no-unused-vars': 'off', // we have TS for that
  },
}
