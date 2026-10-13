# 📝 IDoPhoto 開發工作日誌 (Development Log)

> **專案名稱**：IDoPhoto (原 PhotoCap Web)  
> **線上站點**：[https://idophoto.kanlin.org](https://idophoto.kanlin.org)  
> **原始碼儲存庫**：[https://github.com/kanlin-csu/IDoPhoto](https://github.com/kanlin-csu/IDoPhoto)  
> **開發日期**：2026-10-13  
> **負責人員**：kanlin & Antigravity  

---

## 📌 一、 專案緣起與目標

經典台灣本土軟體 **PhotoCap** 是許多人過去自行製作證件照、沖印 4x6 大頭照的必備工具。隨著作業系統更新與免安裝趨勢，使用者提出：
> *「有辦法寫一個像 PhotoCap 功能的 Web 嗎？」*

我們的核心目標：
1. **免安裝、免註冊、跨平台**：打開瀏覽器即可使用。
2. **極致隱私保護**：生物特徵與個人肖像 **100% 留在瀏覽器記憶體本機運算**，零資料上傳。
3. **還原 PhotoCap 靈魂功能**：
   - 證件照規格輔助線（頭頂、雙眼、下巴）。
   - 4x6 吋超商相紙高畫質排版（300 DPI、1800×1200 像素）。
   - 四角十字剪裁線、防融底微細外框。

---

## 🛠️ 二、 技術選型與架構決策

- **純靜態架構 (Client-Side Only)**：無任何後端伺服器負載，運算依賴客戶端 CPU/GPU。
- **高解析度物理映射**：
  - 1 mm ≈ 11.811 px（基於 300 DPI 沖印標準）。
  - 2 吋相片（35 mm × 45 mm）：413 × 531 px。
  - 1 吋相片（28 mm × 35 mm）：331 × 413 px。
  - 4×6 吋相紙（101.6 mm × 152.4 mm）：1800 × 1200 px。

---

## ⏱️ 三、 開發里程碑與歷程回顧

### 1. 核心排版引擎與原型建立 (Prototype)
* 建立基礎 Canvas 雙畫布渲染引擎：
  * **編輯工作台 Canvas**：支援拖曳平移、滾輪縮放、角度微調（±25°）、亮度與對比濾鏡。
  * **4x6 沖印相紙 Canvas**：
    * 2 吋 × 8 張（直排 4×2）。
    * 1 吋 × 10 張（直排 5×2）。
    * 經典混搭（2 吋 × 4 張 + 1 吋 × 4 張）。
* 實作四角十字剪裁導引線（Corner Crop Marks）與 1px 極淡灰相框，解決白底相片印在相紙上無法對齊裁切的經典難題。

### 2. 品牌重塑與專案獨立：從 PhotoCap 到 IDoPhoto
* 為尊重原作與避免商標爭議，經過腦力激盪後選定 **IDoPhoto**：
  * 雙關語含意：`ID Photo (證件照)` + `I do photo (交給我做證件照)`。
* 更新全站 UI 標誌（`IDo`）、文案與檔案下載命名。
* 初始化 Git 專案並推送至 GitHub。

### 3. 生產環境部署與自訂網域
* 部署至 **Cloudflare Pages**：
  * 綁定專屬自訂網域：`idophoto.kanlin.org`。
  * 享有全球 CDN Edge 快取與免費 SSL 憑證，秒級載入。
* 同步維護 `main` 與 `master` 雙分支，確保持續整合部署（CI/CD）不中斷。

### 4. 證件規格權威校驗（台灣護照 vs 台胞證）
* 針對使用者提出之「台胞證照片規格」進行權威核實：
  * **確認台胞證規格完全等同台灣護照**（35 × 45 mm，頭頂至下巴 3.2 ~ 3.6 cm）。
  * 於介面中明確標註「**2 吋 護照/身分證/台胞證**」。
  * 整理並提供台胞證「嚴禁穿白衣、嚴禁露齒、雙耳雙眉必須露出」等超高退件率防坑指南。

### 5. 隱私聲明、開源條款與範例迭代
* 加入常駐「100% 本地端離線運算」隱私承諾，建立彈窗聲明。
* 導入標準 **MIT License** 開源授權。
* 示範照片演進：
  * 初期：內嵌標準向量人像 SVG。
  * 中期：向量西裝橘貓（遭遇「貓咪沒脖子」趣味討論）。
  * 最終：引入真實可愛貓咪相片 `cat.jpg`，體現最直覺的測試效果。

---

### 6. 手機版與 RWD 觸控深度適配
* **觸控手勢原生支援 (Touch Gestures)**：
  * 實作單指流暢拖曳平移（Touch Pan）。
  * 實作雙指捏合縮放（Pinch-to-zoom），自動連動縮放比例尺。
  * 加入 `touch-action: none` 防止與行動裝置原生頁面滾動衝突。
* **行動端雙頁籤架構 (Mobile Tabbed UI)**：
  * 在窄螢幕下自動切換為分頁模式（[步驟 1-2：臉部裁切] ↔ [步驟 3：4x6 排版]）。
* **手機相機直拍支援**：
  * 導覽列整合 `capture="user"` 相機按鈕，支援直接自拍上傳。

### 7. 列印精度、300 DPI 實體標記與匯入防呆健全化
* **二進位 JFIF 300 DPI 標頭注入**：
  * 解決原生 HTML5 Canvas 匯出僅標記 72/96 DPI 導致家用印表機誤判尺寸的問題。
  * 透過純 JavaScript 二進位改寫 JPEG JFIF Header，下載圖檔 100% 自帶真 300 DPI 密度標籤。
* **實體列印校對尺標 (Physical Calibration Scale)**：
  * 在 4x6 相紙底部留白區繪製精準 20 mm（2 公分）實體物理刻度，印出後拿直尺量測即可驗證印表機縮放是否正確。
* **大圖防爆記憶體自動安全降採樣**：
  * 針對手機直出 48MP/100MP 超大照片，自動安全最佳化長邊至 2800px，兼顧 300 DPI 列印細節與低階手機記憶體安全。
* **檔案防呆與 Toast 提示系統**：
  * 格式與 25MB 大小檢核，支援拖曳重複選取。
* **官方規範出處與免責宣告標記**：
  * 明確標示外交部、戶政司與出入境管理局標準來源與免責說明。

### 8. 純本機 AI 一鍵去背（選用功能）與流量提醒機制
* **按需動態載入架構 (Zero Initial Overhead)**：
  * 使用 `@imgly/background-removal` 純 WebAssembly / ONNX 本機推論引擎。
  * 採取動態 ES Module `import(...)`，未點擊去背前**完全不載入任何外部模型庫**，維持網頁初始載入輕盈極速。
* **流量友善提醒與確認彈窗 (Traffic Alert Modal)**：
  * 明確提醒首次使用需下載約 35MB 神經網路模型（瀏覽器快取後可離線使用）。
  * 宣導智慧型手機使用者利用「手機相簿原生長按 1 秒去背」功能，最省流量且速度最快。
  * 內建即時下載與推論進度百分比動態指示器。
* **自動無縫融合白底**：
  * 去背完成後即時輸出透明圖並載入編輯畫布，背底自動填補標準證件純白色（#FFFFFF），直接銜接對齊排版。
* **核心問題修復 (Bugfix)**：
  * 修復底層函式型別限制：原先傳入 DOM `HTMLImageElement` 物件導致 `n.shape is undefined` 內部拋錯，改由離屏 Canvas 先轉為標準 `Blob` 資料流後再傳入。
  * 解決 `lodash memoize` 匯出錯誤：先前引用的 1.4.5 版底層依賴 CommonJS `lodash`，導致 CDN 產生的 ESM 缺失 `memoize` 具名匯出；升級至 `@imgly/background-removal@1.7.0`（遷移至 `lodash-es` 且單一打包零外部引用）。

### 9. v1.0 正式版號發布與 AI 引擎重構：Google MediaPipe 輕量化
* **標題常駐版號徽章 (v1.0 Release)**：
  * 於頂部導覽列標題旁增設醒目版號徽章 `v1.0`，明確標註目前版本，方便後續改版升級追蹤。
* **解決行動裝置 (Pixel / Android) "Failed to fetch" 與連線逾時**：
  * 分析原因：原 ONNX 方案需跨洋連線至德州伺服器併發下載 11 個 chunk（44MB），在行動網路下極易連線逾時中斷導致 `Failed to fetch`。
  * 徹底解決：全面遷移至 **Google MediaPipe Selfie Segmentation**。
    * **模型超輕量**：模型檔僅 **249 KB**，加 WASM 總共不到 **5.8 MB**（體積縮小近 90%）。
    * **本地 CDN 快取**：全面採用台灣本地邊緣快取節點（jsDelivr），載入速度降至 1 秒內。
    * **原生適配**：Google 專為 Android/Chrome/Pixel 設計之輕量邊緣端人像分割，SIMD 硬體加速，運算僅需 200ms。
    * 自動保留遮罩內人像主體，並於背景填補標準證件純白底（#FFFFFF）。

### 10. 髮絲防發灰演算法調校與雙軌產品定位 (方案 A + C)
* **方案 A：邊緣階調硬化演算法 (Anti-Graying Edge Hardening)**：
  * **成因剖析**：模型原生輸出之髮絲半透明過渡帶（Alpha 0.3~0.7）與證件純白底混合時，產生標準 Alpha 稀釋效應（$40\%\text{黑} + 60\%\text{白} = \text{灰色}$），造成「黑髮變灰、邊緣泛白起霧」。
  * **演算法實作**：在 Canvas 遮罩層加入自訂非線性 S 曲線（Smoothstep）：
    * $\text{val} < 0.28$：俐落消除背景雜色光暈。
    * $\text{val} > 0.48$：邊緣與髮絲迅速拉滿至 100% 不透明，保持真實飽滿黑髮色，黑髮不再發灰。
    * $0.28 \le \text{val} \le 0.48$：保留極窄微小羽化帶，消除馬賽克階梯感鋸齒。
* **方案 C：雙軌產品定位與教學引導 (Dual-Track Strategy)**：
  * 網頁 AI 按鈕標籤標註為「實驗選用」，彈窗內增設 iOS 16+ 與 Android（Pixel/三星）相簿原生「長按 1 秒去背」專屬指引卡片。
  * 形成「免跳 App 快速預覽（網頁本機 AI）」與「極致髮絲無損出圖（手機相簿原生長按）」的互補雙軌體驗。

### 11. 產品精簡與專業去背分流：移除端側 AI，推薦 Canva 與手機原生長按去背
* **架構決策與品質權衡 (Quality First)**：
  * 經過多輪實機測試（包含 Pixel 10 Pro 與電腦瀏覽器），端側瀏覽器輕量模型受限於參數量（5MB ~ 40MB），在面對極細碎髮絲邊緣與複雜背景時，極易出現「泛灰霧、毛邊或邊緣生硬」等問題，難以滿足高標準證件照沖印的完美要求。
* **回歸純淨與模組精簡**：
  * 果斷移除瀏覽器端 AI 去背按鈕、彈窗與外部 MediaPipe 腳本，徹底解除模型下載負擔與任何潛在連線異常，全站回歸 100% 輕盈極速。
* **專業去背分工與純白底整合**：
  * 於編輯控制面板常駐「需要照片去背？」專屬區塊，直接提供 **[Canva 線上免費去背](https://www.canva.com/zh_tw/features/background-remover/)** 官方專屬連結。
  * 明確引導使用者利用專業伺服器 AI（Canva）或手機晶片硬體（iPhone / Pixel 長按 1 秒去背）產生高精度透明圖，上傳至 IDoPhoto 後**自動無縫套用證件純白底（#FFFFFF）**，兼顧最完美髮絲效果與沖印規格。

### 12. PWA (Progressive Web App) 化：跨平台原生級 App 安裝與 100% 離線工作支援
* **Web App Manifest (`manifest.json`)**：
  * 定義標準 PWA 清單，包括 `name: IDoPhoto 證件照排版沖印工具`、`short_name: IDoPhoto`、`display: standalone`、`theme_color: #1e293b`、`background_color: #0f172a`。
  * 支援深色模式沈浸式標題列，消除瀏覽器網址列與外框，達到原生 App 般的沈浸全螢幕視覺體驗。
* **高解析度品牌應用圖示 (Icons)**：
  * 自動生成標準相機結合證件照輪廓的品牌圖示：
    * `icon-192.png` (192×192)：標準桌面/手機安裝圖示。
    * `icon-512.png` (512×512)：高解析度啟動啟動畫面圖示。
    * `icon-maskable-512.png` (512×512 Maskable)：針對 Android 適應性圖示裁切規範，保留 20% 安全邊距（Safe Zone）。
    * `apple-touch-icon.png` (180×180)：專為 iPhone / iPad Safari 「加入主畫面」優化之專用圖示。
* **離線 Service Worker (`sw.js`)**：
  * 實作 Network-First 策略搭配 Cache 回退機制，兼顧隨時取得最新版本與斷網極致可用性。
  * 快取核心本機靜態檔案與 Tailwind CSS CDN，確保使用者在無網路、飛航模式或訊號不佳環境下，仍可 100% 正常載入、自訂裁切排版並輸出 300 DPI 4×6 沖印大檔。
* **智慧安裝按鈕與跨平台體驗**：
  * 頂部導覽列整合「安裝 App」動態按鈕（`#btnInstallPwa`），攔截並監聽瀏覽器 `beforeinstallprompt` 事件，使用者一鍵即可呼叫瀏覽器原生安裝對話框。
  * 針對不支援 `beforeinstallprompt` 的 iOS Safari，完整支援 Apple 原生 Web App Meta 標籤，相容於「分享按鈕 -> 加入主畫面」。

### 13. SEO 與生成式 AI 搜尋最佳化 (GEO / LLM SEO)
* **社群與搜尋中繼標籤 (Meta TDK & Open Graph)**：
  * 注入標準 Meta Description、Keywords、Author、Robots、Canonical 網址。
  * 繪製生成 1200×630 高解析度 Open Graph 與 Twitter Card 品牌預覽圖（`og-image.png`），LINE、Facebook 分享自動顯示質感卡片。
* **Schema.org JSON-LD 三重結構化資料**：
  * `WebApplication`：宣告免費、純前端本機運算（Client-side Only）與護照/超商沖印排版特色。
  * `HowTo`：定義 4 步驟排版與 7-11 / 全家 4×6 沖印實體流程。
  * `FAQPage`：涵蓋超商沖印選型、外交部 3.2~3.6cm 規範、生物隱私保障、PWA 離線安裝、照片去背技巧等 5 大常見問答。
* **爬蟲指引與 AI 友好標準**：
  * `robots.txt`：開放 Googlebot、Bingbot，並明確歡迎 GPTBot、ChatGPT-User、PerplexityBot、ClaudeBot 等 AI 檢索代理人。
  * `sitemap.xml`：提供標準 XML 網站地圖。
  * `llms.txt`：依據新興 LLM 文字標準，提供低 Token 純文字說明與常見問答快速指引。
* **頁面語意化規格速查與 FAQ 手風琴**：
  * 於 `#panelPrint` 下方加入常用證件尺寸速查表、超商省錢攻略，以及語意化 `<details><summary>` 常見問答區，豐富長尾關鍵字，便於 Google 與 AI 引用。
