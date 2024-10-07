/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Usa ts-jest como preset para transformar arquivos TypeScript e JSX
  preset: 'ts-jest',

  // Define o ambiente de teste para simular o DOM
  testEnvironment: 'jsdom',

  // Especifica o arquivo de setup que será executado antes de cada teste
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Configura o mapeamento de módulos para lidar com arquivos de estilo
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Transforma arquivos .ts e .tsx usando ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Limpa todos os mocks entre os testes
  clearMocks: true,

  // Coleta informações de coverage durante a execução dos testes
  collectCoverage: true,

  // Diretório onde os relatórios de coverage serão armazenados
  coverageDirectory: 'coverage',

  // Ignora transformação de módulos dentro de node_modules
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

export default config;
