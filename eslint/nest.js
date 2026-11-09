// NestJS 服务预设（lattefx-backend、auth-service）
// 以 lattefx-backend 原有规则为蓝本；格式交给 Prettier 单独执行，不再走 eslint-plugin-prettier

import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

import { ignores, readability } from './shared.js'

const testFiles = ['**/*.spec.ts', '**/*.e2e-spec.ts', 'test/**/*.ts']

export default tseslint.config(
  ignores,
  // prisma/ 下是 tsx 直接运行的 seed 脚本，不在 tsconfig 中
  { ignores: ['prisma/**', 'scripts/**', 'data/**', '.hypothesis/**', '**/*.js'] },
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
      // recommendedTypeChecked 中原有后端配置未开启的规则：v1 先告警，清零后再升为 error
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
    },
  },
  readability,
  {
    // 根目录的工具配置文件（jest.config.ts 等）不在 tsconfig 中，只做语法检查
    files: ['*.config.ts', '*.config.mts'],
    ...tseslint.configs.disableTypeChecked,
  },
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
