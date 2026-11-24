package com.nbs.taptap.rnhost

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import com.nbs.taptap.rnhost.bridge.BridgeFaults

class HomeActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    BridgeFaults.configure(this, intent)
    setContentView(R.layout.activity_home)
    fitContentToSystemBars(findViewById<View>(R.id.home_root))
    findViewById<View>(R.id.home_settings).setOnClickListener {
      startActivity(Intent(this, SettingActivity::class.java))
    }
  }
}
