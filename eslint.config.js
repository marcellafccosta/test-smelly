// eslint.config.js
import js from '@eslint/js';
import jest from 'eslint-plugin-jest';

export default [
js.configs.recommended,
{
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      // Node.js globals
      console: 'readonly',
      process: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      Buffer: 'readonly',
      module: 'readonly',
      require: 'readonly',
      exports: 'readonly',
      // Jest globals
      ...jest.environments.globals.globals
    }
  },
  plugins: {
    jest
  },
  rules: {
    ...jest.configs.recommended.rules,
    'jest/no-disabled-tests': 'warn',
    'jest/no-conditional-expect': 'error',
    'jest/no-identical-title': 'error'
  }
}
];