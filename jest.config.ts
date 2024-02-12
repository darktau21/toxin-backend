import { type Config } from 'jest';

const config: Config = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx',
  ],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
  },
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    ".(js|jsx)": "babel-jest",
    ".(ts|tsx)": "ts-jest",
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;