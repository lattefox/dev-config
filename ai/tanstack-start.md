# TanStack Start 开发约定（共享）

适用于所有 TanStack Start 前端。各仓库的 `CLAUDE.md` 引用本文件，再补充自己特有的约定。只记录踩过的坑，框架用法以官方文档为准。

## SSR 与水合

- 同一份代码会先在服务端渲染一次。`window`、`localStorage`、`document`、`navigator` 只能在 effect 里或判断运行环境后使用。
- 渲染结果要两端一致：不要在渲染时直接输出当前时间、随机数；需要时在 effect 里赋值。
- HTML 嵌套要合法：`<a>` 里不能再套链接，`<p>` 里不能放块级元素；Radix 的 `asChild` 只能有一个子元素。这三类问题是水合失败最常见的原因。
- 需要登录态（token 存在 localStorage）的数据，服务端渲染时拿不到：loader 在服务端直接返回，由客户端查询。

## 数据获取

- 异步数据通过路由 loader 预取或 TanStack Query 获取，不在渲染过程中新建 Promise（React 19 会报 uncached promise）。
- 组件保持同步函数，不写 async 组件。
- 接口请求统一走仓库里的请求客户端，不直接写 fetch。

## Server Function

- 输入校验用 `.validator()`（1.169 起 `inputValidator` 已改名），校验失败直接拒绝。
- 权限检查写在 handler 里，不依赖前端隐藏按钮。
- 密钥、数据库连接只在服务端代码中使用，不通过返回值带到客户端。

## 容错

- 根路由用 Suspense 包住页面出口，并为路由配置错误组件，局部出错时不至于整站白屏。

## 组件与样式

- 新增 shadcn 组件用 `pnpm dlx shadcn@latest add <组件名>`；`components/ui/` 保持生成时的样子，业务封装放在各 feature 里。
- 业务代码按 `src/features/<领域>/` 组织，路由文件只负责组装页面。
