import Foundation

public enum ReactNativeRoute: String, Equatable, Sendable {
  case extensionSetting
  case highlightGuide
  case shareSetting
  case favoriteSetting
  case privacyPolicy
  case termsOfService
  case openSourceList
}

public enum ReactNativeNavigationRequest: Equatable, Sendable {
  case open(ReactNativeRoute)
  case back
}

@MainActor
final class ReactNativeNavigator {
  static let shared = ReactNativeNavigator()

  var handler: ((ReactNativeNavigationRequest) -> Void)?

  func send(_ request: ReactNativeNavigationRequest) -> Bool {
    guard let handler else {
      return false
    }
    handler(request)
    return true
  }
}
