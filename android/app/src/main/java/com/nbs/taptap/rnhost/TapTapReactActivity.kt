package com.nbs.taptap.rnhost

import android.os.Bundle
import android.view.View
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

abstract class TapTapReactActivity : ReactActivity() {

  protected abstract val analyticsScreen: String

  abstract override fun getMainComponentName(): String

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    fitContentToSystemBars(findViewById<View>(android.R.id.content))
  }

  override fun onResume() {
    super.onResume()
    HostAnalytics.screenViewed(analyticsScreen)
  }
}

class SettingActivity : TapTapReactActivity() {
  override val analyticsScreen: String
    get() = "setting"

  override fun getMainComponentName(): String = "TapTapSetting"
}

class OpenSourceListActivity : TapTapReactActivity() {
  override val analyticsScreen: String
    get() = "setting_open_source"

  override fun getMainComponentName(): String = "TapTapOpenSourceList"
}
