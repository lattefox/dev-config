# Android 开发约定（共享）

适用于 lattefx-android（Kotlin + Jetpack Compose + Hilt）。在 `code-organization.md` 的基础上补充 Android 的分层，遵循 Android 官方架构指南（UI 层、数据层，按需加领域层）。

## 目录与分层

- `ui/<功能>/`：Compose 页面与该页面的 ViewModel；`data/api`、`data/dto`、`data/repository`、`data/local`：接口定义、传输对象、仓库、本地存储；`core/`：网络、配置等基础设施；`di/`：Hilt 模块。
- 依赖方向：UI → ViewModel → Repository → API / 本地存储。Composable 不直接调用 API 或 Repository。
- 页面之间不互相引用内部 Composable；共用组件放 `ui/` 下的公共目录。

## UI 与状态

- ViewModel 暴露不可变的 UI 状态（`StateFlow`），UI 只读取状态、发出事件；状态变更都在 ViewModel 里完成。
- Composable 尽量无状态，状态上提给调用方；预览函数只放在对应页面文件里。
- 字符串、尺寸、颜色放资源或主题，不在 Composable 里写死。

## 数据层

- Repository 是数据的唯一出口，统一把网络结果转换成结果类型（成功、业务错误、网络错误），错误映射集中在一处，ViewModel 不再处理 HTTP 细节。
- DTO 只用于传输；页面需要的模型在 Repository 或 ViewModel 里转换，不让 DTO 直接进 UI。
- 令牌等敏感数据存应用私有存储（DataStore），不写日志、不放外部存储。

## 网络与日志

- 网络日志只在 debug 包开启，并隐去 Authorization、Cookie 等请求头。参考：`di/NetworkModule.kt`。
- 签名密码等密钥从 `~/.gradle/gradle.properties` 或环境变量读取，不写进仓库。

## 测试

- ViewModel 和 Repository 写单元测试（替换掉网络层）；纯转换函数配单测。
- 不保留 Android Studio 生成的示例测试。
