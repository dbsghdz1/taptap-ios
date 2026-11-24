package com.nbs.taptap.rnhost

import android.app.Activity
import android.content.res.Configuration
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat

fun Activity.fitContentToSystemBars(content: View) {
  val isNight =
    (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES
  WindowCompat.getInsetsController(window, window.decorView).apply {
    isAppearanceLightStatusBars = !isNight
    isAppearanceLightNavigationBars = !isNight
  }
  val base = intArrayOf(content.paddingLeft, content.paddingTop, content.paddingRight, content.paddingBottom)
  ViewCompat.setOnApplyWindowInsetsListener(content) { view, insets ->
    val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
    view.setPadding(base[0] + bars.left, base[1] + bars.top, base[2] + bars.right, base[3] + bars.bottom)
    insets
  }
  ViewCompat.requestApplyInsets(content)
}
