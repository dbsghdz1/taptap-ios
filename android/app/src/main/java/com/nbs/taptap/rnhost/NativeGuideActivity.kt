package com.nbs.taptap.rnhost

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import com.nbs.taptap.rnhost.bridge.NativeRoute

class NativeGuideActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    setContentView(R.layout.activity_native_guide)
    fitContentToSystemBars(findViewById<View>(R.id.guide_root))
    val route = NativeRoute.from(intent.getStringExtra(EXTRA_ROUTE).orEmpty())
    findViewById<TextView>(R.id.guide_title).text = route?.title.orEmpty()
    findViewById<TextView>(R.id.guide_body).setText(R.string.guide_note)
    findViewById<View>(R.id.guide_back).setOnClickListener { finish() }
  }

  companion object {
    private const val EXTRA_ROUTE = "route"

    fun intent(context: Context, route: NativeRoute): Intent =
      Intent(context, NativeGuideActivity::class.java).putExtra(EXTRA_ROUTE, route.key)
  }
}
