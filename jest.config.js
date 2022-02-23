const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^jobs/(.*)$': '<rootDir>/jobs/$1',
    '^services/(.*)$': '<rootDir>/services/$1',
    '^utils/(.*)$': '<rootDir>/utils/$1',
  },
};
