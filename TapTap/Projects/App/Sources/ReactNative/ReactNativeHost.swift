import UIKit

import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

final class ReactNativeHost: RCTDefaultReactNativeFactoryDelegate {
  static let shared = ReactNativeHost()

  private lazy var factory: RCTReactNativeFactory = {
    dependencyProvider = RCTAppDependencyProvider()
    return RCTReactNativeFactory(delegate: self)
  }()

  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }

  func makeRootView(for screen: ReactNativeScreen) -> UIView {
    let view = factory.rootViewFactory.view(withModuleName: screen.moduleName)
    view.backgroundColor = .clear
    return view
  }
}
