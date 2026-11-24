import Foundation

@MainActor
enum ReactNativeFaults {
  #if DEBUG
  private static var remainingAppInfoFailures = UserDefaults.standard.integer(forKey: "RNFaultAppInfoFailCount")
  #endif

  nonisolated static var appInfoDelay: DispatchTimeInterval {
    #if DEBUG
    return .milliseconds(max(0, UserDefaults.standard.integer(forKey: "RNFaultAppInfoDelayMs")))
    #else
    return .milliseconds(0)
    #endif
  }

  static func consumeAppInfoFailure() -> Bool {
    #if DEBUG
    guard remainingAppInfoFailures > 0 else {
      return false
    }
    remainingAppInfoFailures -= 1
    return true
    #else
    return false
    #endif
  }
}
