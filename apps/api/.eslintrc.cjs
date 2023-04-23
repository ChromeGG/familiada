module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  extends: ['custom', 'plugin:import/recommended'],
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        alphabetize: { order: 'asc' },
      },
    ],
  },
}
