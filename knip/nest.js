// NestJS 服务的 knip 基线（lattefx-backend、auth-service）
// nest-cli、jest、prisma 由 knip 插件识别

export default {
  entry: ['src/main.ts', 'prisma/**/*.ts', 'scripts/**/*.ts'],
  project: ['src/**/*.ts', 'prisma/**/*.ts', 'scripts/**/*.ts'],
  ignoreExportsUsedInFile: true,
  // tsconfig 继承自 dev-config 时 knip 读不到 paths，这里显式声明两个服务共用的别名
  paths: { '@/*': ['src/*'] },
}
