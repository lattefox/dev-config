// NestJS 服务预设（lattefx-backend、auth-service）
// 以 lattefx-backend 原有规则为蓝本；格式交给 Prettier 单独执行，不再走 eslint-plugin-prettier

import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

import { ignores, readability } from './shared.js'

const testFiles = ['**/*.spec.ts', '**/*.e2e-spec.ts', 'test/**/*.ts']

export default tseslint.config(
  ignores,
  { ignores: ['prisma/migrations/**', 'scripts/**', 'data/**', '.hypothesis/**', '**/*.js'] },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
        // 让 consistent-type-imports 识别依赖注入用到的类型，避免改成 import type 破坏 DI
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
  readability,
  {
    files: testFiles,
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: testFiles,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  eslintConfigPrettier,
)
