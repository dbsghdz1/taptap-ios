package com.nbs.taptap.rnhost.bridge

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.os.Bundle

object BridgeFaults {
  private var remainingAppInfoFailures = 0

  @Volatile
  var appInfoDelayMillis = 0L
    private set

  @Synchronized
  fun configure(context: Context, intent: Intent) {
    val debuggable = (context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
    val extras = intent.extras
    if (!debuggable || extras == null) {
      return
    }
    remainingAppInfoFailures = extras.readCount("RNFaultAppInfoFailCount")
    appInfoDelayMillis = extras.readCount("RNFaultAppInfoDelayMs").toLong()
  }

  @Synchronized
  fun consumeAppInfoFailure(): Boolean {
    if (remainingAppInfoFailures <= 0) {
      return false
    }
    remainingAppInfoFailures -= 1
    return true
  }

  private fun Bundle.readCount(key: String): Int {
    @Suppress("DEPRECATION")
    val raw = get(key) ?: return 0
    return raw.toString().toIntOrNull()?.coerceAtLeast(0) ?: 0
  }
}
