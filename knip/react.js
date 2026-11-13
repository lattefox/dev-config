// TanStack Start / React 应用的 knip 基线（ministry、keeper、nexus-web、lattefx-www、lattefx-console）
// 路径别名读 tsconfig；vite、tanstack-router、vitest 等由 knip 插件识别；
// project 带上 CSS，tailwind / shadcn / 字体这类只在 CSS 里引入的依赖不用再手工忽略

export default {
  entry: ['src/router.tsx', 'src/routes/**/*.{ts,tsx}'],
  project: ['src/**/*.{ts,tsx,css}'],
  ignoreExportsUsedInFile: true,
  // shadcn 生成的组件按原样保留，文件里没用到的子组件不逐个删
  ignoreIssues: { 'src/components/ui/**': ['exports', 'types'] },
}
