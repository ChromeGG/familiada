/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns: ['dist'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}
