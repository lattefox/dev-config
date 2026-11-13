# iOS 开发约定（共享）

适用于 lattefx-ios（SwiftUI + MVVM）。在 `code-organization.md` 的基础上补充 iOS 的分层，遵循 Swift API Design Guidelines。

## 目录与分层

- `Views/<功能>/`：SwiftUI 视图；`ViewModels/<功能>/`：视图模型；`Repositories/`：数据仓库；`Services/`：网络、存储等基础设施；`Models/`：DTO 与页面模型；`Utils/`：配置与常量。
- 依赖方向：View → ViewModel → Repository → Services。View 不直接调用网络或存储。
- 新文件放进对应目录即可被工程收录（文件系统同步的 group），不要手工改 `project.pbxproj`。

## 视图与状态

- ViewModel 用 `@Observable` / `ObservableObject` 暴露状态，View 只读取状态、触发方法；异步加载在 ViewModel 里用 `async/await` 完成。
- View 保持小而可组合，超过一屏的视图拆成子视图；预览放在对应文件里。
- 文案、颜色、尺寸集中在主题或常量中，不在视图里写死。

## 数据层

- Repository 的每个方法通过 `safeApiCall` 把请求结果转换成 `NetworkResult`，错误映射集中在 `NetworkExtensions.swift`，需要不同文案时传入映射配置，不在各方法里重复写 do/catch。参考：`lattefx/Repositories/`。
- 通过协议注入依赖（`APIService` 等），不用 `as!` 强制转换，不用 `try!`。
- 成功后的副作用（保存 token、写缓存）在 Repository 里完成，ViewModel 只关心结果。

## 日志与安全

- 不用 `print` 记录业务日志；调试日志只在 Debug 下输出，并隐去 Authorization、Cookie、密码和 token。参考：`Services/Network/Interceptors/LoggingInterceptor.swift` 的 `LogRedactor`。
- 令牌存 Keychain，不写 UserDefaults。

## 测试

- 纯逻辑（错误映射、数据转换、脱敏）用 Swift Testing 写单元测试，CI 会运行 `lattefxTests`。
- 不保留 Xcode 生成的示例测试和占位页面。
