package com.nbs.taptap.rnhost.bridge

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.nbs.taptap.rnhost.HostAnalytics

class TapTapBridgeModule(private val context: ReactApplicationContext) : NativeTapTapBridgeSpec(context) {

  private val mainHandler = Handler(Looper.getMainLooper())

  override fun getAppInfo(promise: Promise) {
    mainHandler.postDelayed({
      if (BridgeFaults.consumeAppInfoFailure()) {
        promise.reject(APP_INFO_UNAVAILABLE, "App info is unavailable")
        return@postDelayed
      }
      val version = runCatching {
        context.packageManager.getPackageInfo(context.packageName, 0).versionName
      }.getOrNull()
      if (version.isNullOrEmpty()) {
        promise.reject(APP_INFO_UNAVAILABLE, "Version name is missing")
        return@postDelayed
      }
      promise.resolve(Arguments.createMap().apply { putString("version", version) })
    }, BridgeFaults.appInfoDelayMillis)
  }

  override fun navigate(route: String, promise: Promise) {
    val destination = NativeRoute.from(route)
    if (destination == null) {
      promise.reject(UNKNOWN_ROUTE, "Unknown route: $route")
      return
    }
    val activity = context.currentActivity
    if (activity == null) {
      promise.reject(NAVIGATION_UNAVAILABLE, "No foreground activity")
      return
    }
    activity.runOnUiThread {
      activity.startActivity(destination.intent(activity))
      promise.resolve(null)
    }
  }

  override fun goBack() {
    val activity = context.currentActivity ?: return
    activity.runOnUiThread { activity.finish() }
  }

  override fun trackSettingRowTapped(row: String) {
    HostAnalytics.settingRowTapped(row)
  }

  private companion object {
    const val APP_INFO_UNAVAILABLE = "APP_INFO_UNAVAILABLE"
    const val UNKNOWN_ROUTE = "UNKNOWN_ROUTE"
    const val NAVIGATION_UNAVAILABLE = "NAVIGATION_UNAVAILABLE"
  }
}
