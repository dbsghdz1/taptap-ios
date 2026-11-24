import Foundation

import ComposableArchitecture

import AnalyticsKit
import Shared

@objcMembers
public final class ReactNativeBridgeHandler: NSObject {
  public static let appInfoUnavailable = "APP_INFO_UNAVAILABLE"
  public static let unknownRoute = "UNKNOWN_ROUTE"
  public static let navigationUnavailable = "NAVIGATION_UNAVAILABLE"

  public static func loadAppInfo(completion: @escaping ([String: String]?, String?, String?) -> Void) {
    let delay = ReactNativeFaults.appInfoDelay
    DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
      if MainActor.assumeIsolated({ ReactNativeFaults.consumeAppInfoFailure() }) {
        completion(nil, appInfoUnavailable, "App info is unavailable")
        return
      }
      completion(["version": Constants.appVersion], nil, nil)
    }
  }

  public static func navigate(route: String, completion: @escaping (String?, String?) -> Void) {
    DispatchQueue.main.async {
      guard let destination = ReactNativeRoute(rawValue: route) else {
        completion(unknownRoute, "Unknown route: \(route)")
        return
      }
      guard ReactNativeNavigator.shared.send(.open(destination)) else {
        completion(navigationUnavailable, "Navigator is not attached")
        return
      }
      completion(nil, nil)
    }
  }

  public static func goBack() {
    DispatchQueue.main.async {
      _ = ReactNativeNavigator.shared.send(.back)
    }
  }

  public static func trackSettingRowTapped(_ row: String) {
    @Dependency(\.analytics) var analytics
    analytics.track(UsageEvent.settingRowTapped(row: row))
  }
}
