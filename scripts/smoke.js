// 确认每个导出都能被加载，避免发布一个坏 tag
import { readFileSync } from 'node:fs'

const modules = [
  '../eslint/react.js',
  '../eslint/nest.js',
  '../prettier/index.js',
  '../commitlint/index.js',
  '../knip/react.js',
  '../knip/nest.js',
]
for (const path of modules) {
  const { default: config } = await import(path)
  if (!config) throw new Error(`${path} has no default export`)
}

for (const path of ['../tsconfig/react.json', '../tsconfig/nest.json']) {
  JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
}

console.log('dev-config: all exports load')
