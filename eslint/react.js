// TanStack Start / React 应用预设（ministry、keeper、nexus-web、lattefx-www、lattefx-console）

import { tanstackConfig } from '@tanstack/eslint-config'

import { ignores, readability } from './shared.js'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  readability,
  {
    // 纯数据文件（命名为 *.data.ts）与 shadcn 组件不受可读性规则约束；data/ 目录里带逻辑的文件照常检查
    files: ['src/components/ui/**', '**/*.data.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
    },
  },
  ignores,
]
