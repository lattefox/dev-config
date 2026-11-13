# FastAPI 开发约定（共享）

适用于 nexus-api 等 Python 后端。在 `code-organization.md` 的基础上补充 FastAPI 的分层与细节，框架用法以官方文档为准。

## 目录与分层

- `app/api/<版本>/`：路由层，每个领域一个文件，只做参数校验、依赖注入、调用服务、返回响应模型。
- `app/core/services/`：业务逻辑和对外部平台的调用；`app/core/models/`：SQLModel 表模型与读写 schema；`app/core/config.py`：配置。
- 跨领域的工具放 `app/core/` 下的独立模块，一个模块一个职责。参考：nexus-api `app/core/stdout_capture.py`。
- 路由函数里不写 SQL 和业务规则；超过一屏的处理逻辑下沉到 service。

## 模型与 schema

- 表模型、创建 schema、更新 schema、读取 schema 分开定义；接口只返回读取 schema，不直接返回表模型。
- 运行时不再读取的字段从读写 schema 中去掉；没有迁移工具时数据库列和表模型字段保留，并注释原因。
- 敏感字段（token、API Key）只存加密值，读取 schema 只返回脱敏后的值。

## 依赖与配置

- 数据库会话、当前用户、权限检查用 `Depends` 注入，不在路由里手动创建会话或解析 token。
- 配置用 pydantic-settings 在 `config.py` 读取并校验一次，其余代码从配置对象取值。

## 异步与外部调用

- 路由函数用 `async def`；阻塞的第三方调用（CrewAI、同步 SDK）放进线程执行，不阻塞事件循环。
- 外部平台调用集中在对应 service，统一处理超时和错误；测试里替换掉，不依赖网络。

## 错误与日志

- 业务错误抛 `HTTPException` 或自定义异常，由全局异常处理器转换成统一格式。
- 用 `logging` 记录日志，不用 print；不记录密钥和凭据。

## 类型与检查

- 函数签名写类型注解，mypy 检查通过；ruff 负责格式和 lint，vulture、deptry 报告清零。
- 被取代的接口和模块整条删除，相关测试和文档同步清理。
