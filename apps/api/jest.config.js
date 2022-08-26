/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  // testEnvironment: 'node',
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {},
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.ts$'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}
