# TanStack Start 开发约定（共享）

适用于所有 TanStack Start 前端。各仓库的 `CLAUDE.md` 引用本文件和 `code-organization.md`，再补充自己特有的约定。框架用法以官方文档为准。

## SSR 与水合

- 同一份代码会先在服务端渲染一次。`window`、`localStorage`、`document`、`navigator` 只能在 effect 里或判断运行环境后使用。
- 渲染结果要两端一致：不要在渲染时直接输出当前时间、随机数；需要时在 effect 里赋值。
- HTML 嵌套要合法：`<a>` 里不能再套链接，`<p>` 里不能放块级元素；Radix 的 `asChild` 只能有一个子元素。这三类问题是水合失败最常见的原因。
- 需要登录态（token 存在 localStorage）的数据，服务端渲染时拿不到：loader 在服务端直接返回，由客户端查询。

## 数据获取

- 异步数据通过路由 loader 预取或 TanStack Query 获取，不在渲染过程中新建 Promise（React 19 会报 uncached promise）。不再新增 SWR 或在 useEffect 里手动取数。
- QueryClient 放进 router context，用 `@tanstack/react-router-ssr-query` 接入；全局默认不重试、切回窗口不刷新，需要轮询或重试的查询单独配置。参考：www `src/router.tsx`。
- 查询 key 用结构化数组（领域、资源、参数），和查询选项一起集中定义在领域内，修改数据后用 `invalidateQueries` 或 `setQueryData` 更新。参考：www `src/features/notes/query.ts`、console `src/features/admin/rbac/roles-query.ts`。
- 服务端渲染时查询不执行；首屏需要显示加载态时用 `isPending` 判断，需要预渲染的数据放进 loader。
- 组件保持同步函数，不写 async 组件。
- 接口请求统一走仓库里的请求客户端，不直接写 fetch。

## Server Function

- 输入校验用 `.validator()`（1.169 起 `inputValidator` 已改名），校验失败直接拒绝。
- 权限检查写在 handler 里，不依赖前端隐藏按钮。
- 密钥、数据库连接只在服务端代码中使用，不通过返回值带到客户端。

## 测试

- 单元测试用独立的 `vitest.config.ts`，只配置路径别名，不加载 `vite.config` 里的插件：content-collections 插件在 vitest 环境下会报 `__dirname is not defined`，导致所有测试无法启动。参考：console、ministry 的 `vitest.config.ts`。
- 纯函数和 hook 的状态规则写单元测试；页面级行为靠构建产物对比和 system-tests，不为页面写快照测试。

## 容错

- 根路由用 Suspense 包住页面出口，并为路由配置错误组件，局部出错时不至于整站白屏。

## 目录与分层

- `src/routes/`：只放路由定义和页面组装（`createFileRoute`、loader、把配置交给领域组件），不写业务逻辑和大段 JSX。
- `src/features/<领域>/`：领域内按职责分文件——组件、hooks（状态与取数）、api（server function 或请求）、types、constants、query（查询 key 与选项）、配置。领域之间不互相引用内部文件，需要共用的上移到 `common` 或 `lib`。
- `src/components/ui/`：shadcn 生成的组件，保持原样；`src/components/shared/`：跨领域的业务无关组件。
- `src/lib/`：请求客户端、配置、纯工具函数和 SQL 构造等公共层。参考：ministry `src/lib/sql/`。

## 组件

- 组件保持同步函数，只负责渲染；状态、取数、副作用放进自定义 hook，组件通过 hook 的返回值渲染。参考：www `src/features/learning/common/use-learning-list.ts`。
- 结构相同的页面用「通用组件 + 每个领域一份配置」实现，差异通过配置和渲染函数传入。
- props 只传组件需要的数据和回调，不把整个上层状态对象往下传；超过三层的传递改用 context 或把状态下移。
- 新增 shadcn 组件用 `pnpm dlx shadcn@latest add <组件名>`；业务封装放在各 feature 里。
- 样式用 Tailwind 工具类；重复三次以上的样式组合抽成组件，不抽成全局 class。
