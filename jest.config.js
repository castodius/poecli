module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '@lib/(.*)$': '<rootDir>/src/lib/$1',
    '@test/(.*)$': '<rootDir>/test/$1',
    '@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '@models/(.*)$': '<rootDir>/src/models/$1'
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10
    }
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/models/*.ts'
  ],
  verbose: true
}
