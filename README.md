# 攻略閱讀器

一個純前端的遊戲攻略閱讀器，貼上攻略網址即可獲得乾淨、沉浸式的閱讀體驗。

## 功能特色

- **網址貼上即讀** — 輸入任意攻略網址，自動擷取並清理內容
- **深色閱讀主題** — 使用 [Iansui 字型](https://fonts.google.com/specimen/Iansui)，護眼且適合長時間閱讀
- **側邊欄目錄** — 自動從標題產生章節目錄，點擊快速跳轉
- **專注模式** — 全螢幕逐節瀏覽，支援滑動手勢與鍵盤方向鍵
- **全文搜尋** — 即時關鍵字搜尋並高亮標記
- **圖片燈箱** — 點擊圖片放大檢視（自動擷取高解析度來源）
- **瀏覽紀錄** — 自動儲存最近 30 筆瀏覽歷史，可一鍵重新開啟或刪除
- **離線快取** — 已載入的攻略會快取至 localStorage，下次秒開
- **行動裝置友好** — 響應式設計，針對手機觸控操作優化

## 專案結構

```
game-guide/
├── index.html    # 單一 HTML 檔案（含 CSS + JS，零依賴）
└── README.md
```

## 工作原理

1. 使用者貼上攻略網址
2. 透過公共 CORS 代理（allorigins.win → corsproxy.io）取得原始 HTML
3. 使用 `DOMParser` 解析，擷取文章主體（`.article-content`、`article` 等容器）
4. 過濾廣告、導航列、腳本等雜訊
5. 智慧分類內容：章節標題（`【...】`）、攻略路線（含 `→`）、提示（`※`）、收集進度等
6. 渲染為乾淨的閱讀介面，自動產生側邊欄目錄

## 使用方式

### 直接開啟

用瀏覽器開啟 `index.html` 即可使用。無需安裝、無需建構。

### 部署至 Cloudflare Pages

**方法一：直接上傳**

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左側選 **Workers & Pages** → **Create** → **Pages** → **Upload assets**
3. 上傳 `index.html`
4. 部署完成，取得 `xxx.pages.dev` 網址

**方法二：Git 連接（推薦）**

1. Cloudflare Dashboard → Workers & Pages → Create → Pages
2. 連接 GitHub，選擇此 repo
3. Build 設定：
   - Framework: None
   - Build command:（留空）
   - Output directory: `/`
4. 部署

**方法三：Wrangler CLI**

```bash
npm i -g wrangler
wrangler login
wrangler pages deploy . --project-name game-guide
```

### 自訂域名（可選）

1. Pages 專案 → Custom domains
2. 加入你的域名（如 `guide.yourdomain.com`）
3. Cloudflare 自動設定 DNS + SSL

## 技術細節

- **零依賴** — 不使用任何框架或建構工具，純 HTML + CSS + vanilla JS
- **CORS 處理** — 依序嘗試 allorigins.win、corsproxy.io、直接 fetch
- **內容快取** — 解析後的 HTML 與目錄存入 localStorage，避免重複載入
- **內容辨識** — 針對常見攻略網站結構（WordPress、部落格平台）優化解析邏輯
