package com.nbs.taptap.rnhost.bridge

import android.content.Context
import android.content.Intent
import com.nbs.taptap.rnhost.NativeGuideActivity
import com.nbs.taptap.rnhost.OpenSourceListActivity

enum class NativeRoute(val key: String, val title: String) {
  EXTENSION_SETTING("extensionSetting", "Safari 익스텐션 허용하기"),
  HIGHLIGHT_GUIDE("highlightGuide", "문장 하이라이트"),
  SHARE_SETTING("shareSetting", "Safari에서 공유하기"),
  FAVORITE_SETTING("favoriteSetting", "즐겨찾기 설정하기"),
  PRIVACY_POLICY("privacyPolicy", "개인정보 처리방침"),
  TERMS_OF_SERVICE("termsOfService", "서비스 이용약관"),
  OPEN_SOURCE_LIST("openSourceList", "사용된 오픈소스");

  fun intent(context: Context): Intent =
    when (this) {
      OPEN_SOURCE_LIST -> Intent(context, OpenSourceListActivity::class.java)
      else -> NativeGuideActivity.intent(context, this)
    }

  companion object {
    fun from(key: String): NativeRoute? = entries.firstOrNull { it.key == key }
  }
}
