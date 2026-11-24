//
//  SettingCoordinatorReducer.swift
//  TapTap
//
//  Created by 여성일 on 2/23/26.
//

import ComposableArchitecture

import Shared

struct SettingCoordinatorReducer: Reducer {
  typealias State = AppCoordinator.State
  typealias Action = AppCoordinator.Action
  
  var body: some ReducerOf<Self> {
    Reduce { state, action in
      switch action {
      case .reactNative(.back):
        if !state.path.isEmpty { state.path.removeLast() }
        return .none

      case let .reactNative(.open(route)):
        state.path.append(Self.destination(for: route))
        return .none

      // MARK: - 자식(하위) 피쳐 네비게이션
      case .path(.element(id: _, action: .extensionSetting(.delegate(.route(.back))))):
        if !state.path.isEmpty { state.path.removeLast() }
        return .none
        
      case .path(.element(id: _, action: .shareSetting(.delegate(.route(.back))))):
        if !state.path.isEmpty { state.path.removeLast() }
        return .none
        
      case .path(.element(id: _, action: .favoriteSetting(.delegate(.route(.back))))):
        if !state.path.isEmpty { state.path.removeLast() }
        return .none
        
      case .path(.element(id: _, action: .policyDetail(.delegate(.route(.back))))):
        if !state.path.isEmpty { state.path.removeLast() }
        return .none

      case .path(.element(id: _, action: .onboardingHighlightGuide(.delegate(.route(.back))))):
        if !state.path.isEmpty { state.path.removeLast() }
        return .none
        
      default:
        return .none
      }
    }
  }

  static func destination(for route: ReactNativeRoute) -> AppCoordinator.Path.State {
    switch route {
    case .extensionSetting:
      return .extensionSetting(.init())
    case .highlightGuide:
      return .onboardingHighlightGuide(.init())
    case .shareSetting:
      return .shareSetting(.init())
    case .favoriteSetting:
      return .favoriteSetting(.init())
    case .privacyPolicy:
      return .policyDetail(.init(title: "개인정보 처리방침", text: Constants.AppInfo.privacyPolicy))
    case .termsOfService:
      return .policyDetail(.init(title: "서비스 이용약관", text: Constants.AppInfo.termsOfService))
    case .openSourceList:
      return .reactNative(.init(screen: .openSourceList))
    }
  }
}
