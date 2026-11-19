# AURA 2.0 — Android 優先的 AI 精靈夥伴原型

## 目前內容
- 動態精靈風格首頁與手機版介面
- 陪伴聊天、遊戲助手兩種模式
- 使用 OpenAI Responses API 的後端串接範例
- 本機提醒清單與通知權限
- PWA manifest / service worker 基礎檔案

## 重要限制
1. 這是可執行的 Web/PWA 原型，不是已簽署的 Android APK。
2. 真正 AI 對話需要你自己的 OpenAI API key；API 使用可能產生額外費用，與 ChatGPT 訂閱分開。
3. API key 只放在伺服器 `.env`，不可放進 HTML、APK 或公開程式碼。
4. 提醒目前以 App 頁面開啟期間的定時檢查為主。要做到 Android 關閉 App 後仍可靠觸發的本機排程通知，下一階段需加入原生 Android 通知排程；遠端推播則需推播服務與使用者授權。
5. 遊戲助手目前根據使用者輸入分析，不會自動讀取畫面、登入遊戲或操控遊戲。

## 在電腦啟動
需要 Node.js 22 或相容版本。

```bash
npm install
cp .env.example .env
```

編輯 `.env`，填入自己的 API key。接著：

```bash
npm start
```

瀏覽器開啟 `http://localhost:3000`。

## Android 手機測試
部署到有 HTTPS 的主機後，用 Android Chrome 開啟網址，從瀏覽器選單選「新增至主畫面」即可用類 App 方式啟動。若要正式 APK，建議下一步以 Capacitor 或原生 Kotlin 封裝，並加入 Android 原生排程通知。

## 下一階段建議
- 原生 Android 通知排程與通知頻道
- 角色立繪、表情狀態、語音輸入與語音播放
- 遊戲知識庫／官方資料查證流程
- 使用者授權後的雲端記憶與資料匯出／刪除


## AURA 表情素材整合（Prototype 0.2）
- 已加入六張表情裁切素材：開心、害羞、困倦、認真攻略、撒嬌、生氣嘟嘴。
- 首頁可手動切換表情；切換聊天／遊戲頁面會自動切換預設表情。
- 目前是表情圖切換與浮動 CSS 動畫，尚非逐格動畫或 Live2D。
- 素材來自本專案的角色表情概念圖，正式公開或商用前請確認原圖授權。


## 本次新增：語音互動
- 聊天頁新增語音輸入按鈕（使用瀏覽器 Web Speech Recognition，語系 zh-TW）。
- AI 回覆可透過瀏覽器 Speech Synthesis 朗讀，可開關或停止播放。
- 語音辨識支援度依 Android 瀏覽器、裝置語音服務及麥克風權限而異；建議以 HTTPS 網址在 Android Chrome 測試。
- 這是瀏覽器端語音功能，不等於原生 Android 背景語音助理；App 關閉時不會持續聆聽。


## 本次新增：每日陪伴設定（Prototype 0.3）
- 提醒頁新增早安、晚安問候與每日心情關心設定。
- 可設定早安／晚安時間，並在 App 頁面開啟期間每 15 秒檢查一次；每日每種類型最多觸發一次。
- 若已授權通知，觸發時會嘗試顯示瀏覽器通知；若語音回答開啟，亦會嘗試朗讀問候。
- 已補上聊天頁語音輸入、語音回答開關與停止播放控制項。

## 重要提醒限制
這一版仍是 PWA／網頁原型。每日問候與自訂提醒依賴頁面 JavaScript 計時器，App 關閉、瀏覽器被系統凍結、手機省電模式或裝置重新啟動時，無法保證準時觸發。要達到可靠的背景提醒，必須再封裝 Android 原生功能，使用 Android 通知排程（例如 WorkManager／AlarmManager，依需求選擇），並處理 Android 13 以上通知權限。


## Android APK 雲端編譯（不需要自己的電腦）

1. 用 Android 手機登入 GitHub，建立新的 repository。
2. 將解壓縮後的專案檔案上傳至 repository 根目錄，包含隱藏的 `.github` 資料夾。
3. 開啟 **Actions**，選擇 **Build AURA Android APK**，按 **Run workflow**。
4. 編譯完成後，在該次執行頁面的 **Artifacts** 下載 `AURA-debug-apk`。
5. 解壓縮後取得 `app-debug.apk`，即可在 Android 手機安裝。

### 重要限制
- 這是供測試安裝的 Debug APK，不是已簽署、可上架 Google Play 的發布版。
- Google 帳號與 GitHub 帳號不同；可用 Google 帳號註冊／登入 GitHub。
- AI 對話仍需將 Node.js 後端部署到 HTTPS 主機，並在 `public/api-config.js` 設定後端網址。API 金鑰只能放在後端環境變數。
- APK 不會自動執行 Node.js 後端；後端需獨立部署。
- 目前提醒仍依賴 App 執行期間的計時器，尚未加入 Android 原生背景排程通知。
