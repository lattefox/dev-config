# NestJS 开发约定（共享）

适用于 lattefx-backend、auth-service。在 `code-organization.md` 的基础上补充 NestJS 的分层与细节，框架用法以官方文档为准。

## 模块与目录

- 一个业务领域一个 module：`<领域>.module.ts`、`<领域>.controller.ts`、`<领域>.service.ts`、`dto/`，需要时加 `types`、`utils/`、`guards/`、`decorators/`。
- 跨领域的基础设施（Prisma、日志、异常过滤、拦截器）放 `common/` 或独立 module，业务 module 只通过依赖注入使用它们。
- module 只导出确实被其他 module 使用的 provider；注册了却没有注入点的 provider 要删除。

## Controller

- 只负责路由、参数绑定、权限装饰器和 Swagger 文档，然后调用 service 返回结果；不注入 PrismaService，不写 SQL 和业务规则。参考：auth-service `src/rbac/rbac.controller.ts` 与 `rbac-admin.service.ts`。
- 从请求里取 token、当前用户等横切数据用参数装饰器，不在 controller 里手动解析请求头和 Cookie。参考：backend `src/auth/decorators/auth-token.decorator.ts`、`src/auth/utils/extract-token.ts`。
- 响应模型用 DTO 类声明；只在 `$ref` 里引用的模型用 `@ApiExtraModels` 注册、`getSchemaPath` 引用，避免文档出现悬空引用。

## Service 与数据访问

- 业务规则和数据库读写放在 service；一个 service 超过阈值时按子职责拆成多个 service，而不是一个大文件。
- 优先用 Prisma 的类型化查询；必须写原生 SQL 时，值一律参数化，排序字段、表名等标识符走白名单或格式校验。参考：backend `src/admin/utils/admin-list-query.ts`。
- 列表接口的筛选、排序、分页在 SQL 里完成，不先分页再在内存里过滤。
- 调用其他服务（auth-service 等）只通过一个客户端类，统一处理超时、重试和错误映射。

## DTO 与校验

- 入参 DTO 用 class-validator 校验，全局 ValidationPipe 开启 whitelist；枚举类参数用 `@IsEnum`，标识符类参数用 `@Matches` 限定格式。
- 同一含义的字段在所有 DTO 里同名、同类型。
- 新增列表接口沿用所在模块已有的分页参数；已发布的移动端在用的接口不改参数名，避免旧版 App 失效。

## 错误与日志

- 业务错误抛 Nest 的 HttpException 子类，由全局过滤器统一转换成响应格式；service 不直接构造 HTTP 响应。
- 日志用 Nest Logger，带上下文（类名、方法），不记录 token、Cookie、密码和完整用户信息。

## 测试

- service 的业务逻辑写单元测试（mock Prisma 和外部客户端）；纯函数工具配单测。
- 接口行为由 E2E 和契约测试覆盖；只搬移代码、不改行为的重构，依赖现有 E2E 验证即可。
