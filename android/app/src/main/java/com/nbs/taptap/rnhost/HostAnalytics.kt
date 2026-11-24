package com.nbs.taptap.rnhost

import android.util.Log

object HostAnalytics {
  private const val TAG = "TapTapAnalytics"

  fun screenViewed(screen: String) {
    Log.i(TAG, "screen_viewed screen=$screen")
  }

  fun settingRowTapped(row: String) {
    Log.i(TAG, "setting_row_tapped row=$row")
  }
}
