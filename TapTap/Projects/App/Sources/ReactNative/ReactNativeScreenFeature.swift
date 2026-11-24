import ComposableArchitecture

import AnalyticsKit

@Reducer
public struct ReactNativeScreenFeature {
  @Dependency(\.analytics) var analytics

  @ObservableState
  public struct State: Equatable {
    public let screen: ReactNativeScreen

    public init(screen: ReactNativeScreen) {
      self.screen = screen
    }
  }

  public enum Action: Equatable {
    case onAppear
  }

  public var body: some ReducerOf<Self> {
    Reduce { state, action in
      switch action {
      case .onAppear:
        analytics.track(UsageEvent.screenViewed(state.screen.analyticsScreen))
        return .none
      }
    }
  }

  public init() {}
}
