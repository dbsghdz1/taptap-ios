import AnalyticsKit

public enum ReactNativeScreen: String, Equatable, Hashable, Sendable {
  case setting
  case openSourceList

  var moduleName: String {
    switch self {
    case .setting:
      return "TapTapSetting"
    case .openSourceList:
      return "TapTapOpenSourceList"
    }
  }

  var analyticsScreen: UsageEvent.Screen {
    switch self {
    case .setting:
      return .setting
    case .openSourceList:
      return .settingOpenSource
    }
  }
}
