/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  transform: {},
  setupFiles: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/src/**/*.test.ts', '**/tests/**/*.test.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}
