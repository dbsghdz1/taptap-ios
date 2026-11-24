import SwiftUI

import ComposableArchitecture

import DesignSystem

struct ReactNativeScreenView: View {
  let store: StoreOf<ReactNativeScreenFeature>

  var body: some View {
    ZStack {
      Color.background.ignoresSafeArea()
      ReactRootView(screen: store.screen)
        .ignoresSafeArea(.container, edges: .bottom)
    }
    .toolbar(.hidden)
    .onAppear {
      store.send(.onAppear)
    }
  }
}

private struct ReactRootView: UIViewRepresentable {
  let screen: ReactNativeScreen

  func makeUIView(context: Context) -> UIView {
    ReactNativeHost.shared.makeRootView(for: screen)
  }

  func updateUIView(_ uiView: UIView, context: Context) {}
}
