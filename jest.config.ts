import { pathsToModuleNameMapper } from 'ts-jest';
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import { compilerOptions } from './tsconfig.json';
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>/src/'],
  modulePaths: [compilerOptions.baseUrl],
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/loaders/jest.ts'],

  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths /*, {prefix: '<rootDir>/src/',}*/
  ),
};

export default jestConfig;
