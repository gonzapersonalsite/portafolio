import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import fsdPlugin from 'eslint-plugin-fsd-lint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'fsd-lint': fsdPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'fsd-lint/forbidden-imports': 'error',
      'fsd-lint/no-relative-imports': 'error',
      'fsd-lint/no-public-api-sidestep': 'error',
      'fsd-lint/no-cross-slice-dependency': 'error',
      'fsd-lint/no-ui-in-business-logic': 'error',
    },
  },
  prettierConfig,
);
