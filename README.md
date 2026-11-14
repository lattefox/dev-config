# @lattefox/dev-config

所有项目共用的 ESLint / Prettier / tsconfig / commitlint / knip 基线，以及可复用的 CI 流程。改规则只改这里，各仓库升级 tag 即可。

跨项目的工程准则（分级、提交与合并、测试、文档、精简）见 [GOVERNANCE.md](GOVERNANCE.md)。

## 安装

```sh
pnpm add -D github:lattefox/dev-config#v2.0.0
```

## 使用

| 文件                       | 内容                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `eslint.config.js`         | `export { default } from '@lattefox/dev-config/eslint/react'`（NestJS 用 `eslint/nest`）                   |
| `prettier.config.js`       | `export { default } from '@lattefox/dev-config/prettier'`                                                  |
| `commitlint.config.js`     | `export { default } from '@lattefox/dev-config/commitlint'`，另需 `@commitlint/cli`                        |
| `tsconfig.json`            | `"extends": "@lattefox/dev-config/tsconfig/react.json"`，本地只写 `paths`、`include`、`exclude` 等相对路径 |
| `knip.config.js`           | `export { default } from '@lattefox/dev-config/knip/react'`（NestJS 用 `knip/nest`），另需 `knip`          |
| `.husky/`                  | 复制 `templates/husky/pre-commit`、`commit-msg`                                                            |
| `.github/workflows/ci.yml` | `uses: lattefox/dev-config/.github/workflows/node-check.yml@v2`（Python 用 `python-check.yml`）            |
| Python                     | 复制 `python/ruff.toml`、`python/Makefile` 到仓库根目录                                                    |

死代码检查在 CI 里默认关闭，仓库的 knip 报告清零后给 `node-check.yml` 传 `unused: true`。

需要仓库特有规则时，在本地配置里展开预设再追加，并注释原因：

```js
import react from '@lattefox/dev-config/eslint/react'

export default [...react, { rules: { '@typescript-eslint/no-unnecessary-condition': 'off' } }]
```

## AI 编码约定

`ai/` 下是可共享的 AI 编码约定，各仓库在自己的 `CLAUDE.md` 里引用，再写仓库特有的内容：

| 文件                      | 适用                                     |
| ------------------------- | ---------------------------------------- |
| `ai/code-organization.md` | 所有仓库：分层、拆分、抽象、常量、命名等 |
| `ai/tanstack-start.md`    | 所有 TanStack Start 前端                 |
| `ai/nestjs.md`            | lattefx-backend、auth-service            |
| `ai/fastapi.md`           | nexus-api                                |
| `ai/android.md`           | lattefx-android                          |
| `ai/ios.md`               | lattefx-ios                              |

引用方式：`CLAUDE.md` 中单独一行引用，通用约定和对应技术栈各一行。Node 仓库写 `@node_modules/@lattefox/dev-config/ai/<文件>`（需先安装依赖）；Python 和移动端仓库不安装 dev-config，写本地 dev-config 仓库的相对路径，例如 `@../../dev-config/ai/<文件>`。

## 脚本契约

每个仓库对外只暴露这 5 个入口，CI 只调用它们：

| 入口     | Node                | Python              |
| -------- | ------------------- | ------------------- |
| 格式检查 | `pnpm format:check` | `make format-check` |
| Lint     | `pnpm lint`         | `make lint`         |
| 类型检查 | `pnpm type-check`   | `make type-check`   |
| 死代码   | `pnpm lint:unused`  | `make unused`       |
| 全部     | `pnpm check`        | `make check`        |

## 发版

1. 修改后运行 `pnpm check`。
2. 改 `package.json` 版本号，打 tag `vX.Y.Z`，并移动大版本 tag（当前 `v2`）指向它（可复用 workflow 用 `@v2` 引用）。
3. 各仓库把依赖改为新 tag。

v2 起可读性规则（`max-lines` 400、`max-lines-per-function` 60、`complexity` 10）为 `error`；测试文件不检查行数。
