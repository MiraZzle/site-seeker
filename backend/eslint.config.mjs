import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  prettierConfig, // Disable ESLint rules that conflict with Prettier
  {
    plugins: { prettier: pluginPrettier }, // Add Prettier as a plugin
    rules: {
      'prettier/prettier': 'error', // Run Prettier as a linting rule
    },
  },
];
