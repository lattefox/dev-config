// 所有预设共用的忽略项与可读性规则

export const ignores = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '.content-collections/**',
    '.vercel/**',
    '.output/**',
    '.tanstack/**',
    'venv/**',
    '.venv/**',
    'content/**',
    'src/routeTree.gen.ts',
    'src/generated/**',
    'eslint.config.*',
    'prettier.config.*',
    'commitlint.config.*',
  ],
}

// 计划书 6.4 的可读性指标；v1 只告警，各仓库清零后再升为 error
export const readability = {
  rules: {
    'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true, skipComments: true }],
    complexity: ['warn', 10],
  },
}
