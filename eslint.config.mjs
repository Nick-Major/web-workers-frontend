import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      prettier: eslintPluginPrettier, // Активируем плагин Prettier
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.jest, ...globals.node, ...globals.serviceworker },
    },
    rules: {
      // Настройки отступов
      indent: ['error', 2], // 2 пробела для отступов
      'prettier/prettier': 'error', // Включает правила Prettier как ошибки

      // Дополнительные правила для единообразия
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
  prettier, // Применяем конфиг Prettier (должен быть последним!)
]);
