# @lattefox/dev-config

所有项目共用的 ESLint / Prettier / tsconfig / commitlint 基线，以及可复用的 CI 流程。改规则只改这里，各仓库升级 tag 即可。

## 安装

```sh
pnpm add -D github:lattefox/dev-config#v1.0.0
```

## 使用

| 文件                       | 内容                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `eslint.config.js`         | `export { default } from '@lattefox/dev-config/eslint/react'`（NestJS 用 `eslint/nest`）                   |
| `prettier.config.js`       | `export { default } from '@lattefox/dev-config/prettier'`                                                  |
| `commitlint.config.js`     | `export { default } from '@lattefox/dev-config/commitlint'`，另需 `@commitlint/cli`                        |
| `tsconfig.json`            | `"extends": "@lattefox/dev-config/tsconfig/react.json"`，本地只写 `paths`、`include`、`exclude` 等相对路径 |
| `.husky/`                  | 复制 `templates/husky/pre-commit`、`commit-msg`                                                            |
| `.github/workflows/ci.yml` | `uses: lattefox/dev-config/.github/workflows/node-check.yml@v1`（Python 用 `python-check.yml`）            |
| Python                     | 复制 `python/ruff.toml`、`python/Makefile` 到仓库根目录                                                    |

需要仓库特有规则时，在本地配置里展开预设再追加，并注释原因：

```js
import react from '@lattefox/dev-config/eslint/react'

export default [...react, { rules: { '@typescript-eslint/no-unnecessary-condition': 'off' } }]
```

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
2. 改 `package.json` 版本号，打 tag `vX.Y.Z`，并移动大版本 tag `v1` 指向它（可复用 workflow 用 `@v1` 引用）。
3. 各仓库把依赖改为新 tag。可读性规则（`max-lines` 等）当前为 `warn`，所有仓库清零后在下一个大版本升为 `error`。
