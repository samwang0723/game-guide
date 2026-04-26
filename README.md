# 攻略閱讀器 — Cloudflare Pages 部署

## 專案結構

```
guide-reader/
├── index.html          # 前端頁面
├── functions/
│   └── proxy.ts        # Cloudflare Pages Function (CORS proxy)
└── README.md
```

## 部署步驟

### 方法一：直接上傳（最快）

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左側選 **Workers & Pages**
3. 點 **Create** → **Pages** → **Upload assets**
4. 把整個 `guide-reader/` 資料夾拖進去
5. 部署完成，會得到一個 `xxx.pages.dev` 的網址

### 方法二：Git 連接（推薦，方便更新）

1. 把 `guide-reader/` 推到 GitHub repo

```bash
cd guide-reader
git init
git add .
git commit -m "init guide reader"
git remote add origin git@github.com:YOUR_USER/guide-reader.git
git push -u origin main
```

2. Cloudflare Dashboard → Workers & Pages → Create → Pages
3. 連接 GitHub，選你的 repo
4. Build 設定：
   - Framework: None
   - Build command: （留空）
   - Output directory: `/`
5. 部署

### 方法三：Wrangler CLI

```bash
npm i -g wrangler
wrangler login
cd guide-reader
wrangler pages deploy . --project-name guide-reader
```

## 工作原理

- `index.html` — 純前端，fetch URL → DOMParser 解析 → 乾淨渲染
- `functions/proxy.ts` — Cloudflare Pages Function，自動部署為 serverless function
  - 路徑：`/proxy?url=https://...`
  - 作用：繞過 CORS，server-side fetch 目標網頁 HTML
  - 自帶 Cloudflare edge cache (1hr)

## 自訂域名（可選）

1. Pages 專案 → Custom domains
2. 加入你的域名（如 `guide.yourdomain.com`）
3. Cloudflare 會自動設定 DNS + SSL

## 安全加固（可選）

取消 `functions/proxy.ts` 中的 allowlist 註解，只允許特定攻略網站：

```ts
const allowed = ['entertainment14.net', 'gamersky.com'];
if (!allowed.some(d => url.hostname.endsWith(d))) {
  return new Response('Domain not allowed', { status: 403 });
}
```
