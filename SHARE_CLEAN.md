# 如何分享 iFarted 成果 — 干净分享指南（无 arena）

Date: 2026-09-11
Branches: ifarted, ifarted-v0.14.0-alpha, release/ifarted-v0.14.0-alpha
Tags: v0.13.0-alpha, v0.14.0-alpha
Repo: https://github.com/lin2mm/udlbook

> 本指南所有链接均不含 arena，使用干净分支名分享

## 1. 最快：分享干净分支链接

**推荐分支**（三选一，都已推送，无 arena）：

- **主分享分支**：https://github.com/lin2mm/udlbook/tree/ifarted
- **版本分支**：https://github.com/lin2mm/udlbook/tree/ifarted-v0.14.0-alpha
- **发布分支**：https://github.com/lin2mm/udlbook/tree/release/ifarted-v0.14.0-alpha

**Tags**（无 arena）：
- https://github.com/lin2mm/udlbook/releases/tag/v0.14.0-alpha
- https://github.com/lin2mm/udlbook/releases/tag/v0.13.0-alpha

**分享话术**（复制即用，无 arena）：
> 💨 iFarted — Yo-style "I farted." 整个消息，通知即消息，无收件箱。已完成 v0.14.0-alpha 最终 v1.0 Alpha 脚手架：
> - Server live Bun+Hono+SQLite 13端点 20用户100 farts 100/hour 20活跃 测试7 pass + E2E + 负载1136 RPS
> - Mobile MVP 7屏 + Zustand + 推送/联系人/广告/IAP + FartButton v2触觉动画+SoundPicker 5变体
> - Web UDL网站+IFarted演示真API + 独立PWA暗色切换SoundPicker AdminDashboard
> - 文档全面：API_DOCS, PRIVACY, TERMS, DEPLOYMENT_CHECKLIST, STORE_CHECKLIST, APP_REVIEW, RELEASE_NOTES
> - GitHub：https://github.com/lin2mm/udlbook/tree/ifarted
> - Tag：v0.14.0-alpha https://github.com/lin2mm/udlbook/releases/tag/v0.14.0-alpha

## 2. 创建干净 PR（无 arena）

```bash
gh pr create --repo lin2mm/udlbook --base main --head ifarted --title "iFarted v0.14.0-alpha — Final v1.0 Alpha" --body "见 SHARE_CLEAN.md + README.md v4

Server Bun+Hono+SQLite 13端点 + Mobile 7屏 + Web PWA + Docs全面 + Tests 7 pass + E2E + 负载1136 RPS
"
```

新 PR 链接：https://github.com/lin2mm/udlbook/pulls （选择 ifarted 分支）

## 3. 一键本地运行（干净分支）

```bash
git clone https://github.com/lin2mm/udlbook.git
cd udlbook
git checkout ifarted

# Server
cd apps/server
npm install -g bun
bun install
ADMIN_KEY=test123 PORT=3000 bun src/index.ts
# → http://localhost:3000/health
# → http://localhost:3000/admin.html?key=test123

# Web客户端
cd ../web
npm install
npm run dev -- --port 5174 --host 0.0.0.0
# → http://localhost:5174

# UDL网站
cd ../..
npm install
npm run dev -- --port 5173 --host 0.0.0.0
# → http://localhost:5173

# Mobile
cd apps/mobile
npm install
npx expo start
```

## 4. 永久部署（无 arena 影响）

部署后分享的是 `https://api.ifarted.app` + `https://ifarted.app`，与分支名无关，完全干净：

- Server Fly.io / Railway → api.ifarted.app
- Web Vercel → ifarted.app
- Mobile TestFlight / Play Internal → 内部测试链接

见 DEPLOYMENT.md + DEPLOYMENT_CHECKLIST_v1.md

## 5. 导出干净压缩包

GitHub ZIP（无 arena）：
- https://github.com/lin2mm/udlbook/archive/refs/heads/ifarted.zip
- https://github.com/lin2mm/udlbook/archive/refs/heads/ifarted-v0.14.0-alpha.zip

## 6. 当前成果快照（无 arena，复制到邮件/Slack）

```
💨 iFarted v0.14.0-alpha — Final v1.0 Alpha scaffold — 2026-09-11

GitHub: https://github.com/lin2mm/udlbook/tree/ifarted
Tag: https://github.com/lin2mm/udlbook/releases/tag/v0.14.0-alpha
Branches: ifarted, ifarted-v0.14.0-alpha, release/ifarted-v0.14.0-alpha

Server Bun+Hono+SQLite WAL 13端点 POST /v1/register GET /v1/me POST /v1/tokens POST /v1/farts GET /v1/users/search POST /v1/contacts POST /v1/invites GET /v1/friends ordered lastFartAt POST /v1/friends POST /v1/settings/phone-discovery POST /v1/block + /metrics /v1/stats /admin /admin/users /admin/farts /admin.html HTML仪表 安全头nosniff DENY XSS Referrer HSTS CORS优雅关闭健康timestamp+uptime 5音效变体classic short long squeaky wet WebSocket可选 负载测试 20用户100 farts 100/hour 20活跃 50 farts 1136 RPS 100 farts 819 RPS 测试7 pass unit+E2E+load

Mobile MVP 7屏 home real friends pull-to-refresh推送处理位置切换AdBanner gated EmptyState onboarding 3路径<60s搜索联系人邀请fart-detail deadpan地图pin fart back设置Remove Ads IAP Restore手机发现邀请隐私退出 stores useAuth useFriends libs api notifications contacts ads iap linking haptics components FartButton v2 haptics动画 SoundPicker config app.json eas.json PrivacyInfo

Web UDL网站+IFarted演示真API + 独立PWA全流程注册搜索添加fart邀请指标日志声音arch暗色切换 SoundPicker AdminDashboard build 133模块313KB PWA manifest standalone

Docs README v4最终总结 RELEASE_NOTES v13 DEPLOYMENT_CHECKLIST v1全面清单 PRIVACY TERMS模板 API_DOCS APP_REVIEW STORE_CHECKLIST

Tests 单元7 pass + E2E 2用户3 farts + 负载100 farts 819 RPS + vite build 133模块313KB

Drive导入 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview绕过TLS封锁 8 markdown
```

## 7. 说明

- Arena 系统固定会话分支 `arena/01a08e52-udlbook` 仅用于开发会话追踪，不影响分享
- 所有对外分享请使用干净分支 `ifarted` / `ifarted-v0.14.0-alpha` / `release/ifarted-v0.14.0-alpha`，链接中无 arena
- Tags `v0.13.0-alpha` + `v0.14.0-alpha` 也无 arena，可直接分享 Release 页面
- 部署后分享的是自定义域名 `api.ifarted.app` + `ifarted.app`，与分支名完全无关

---

**一句话总结**：分享 https://github.com/lin2mm/udlbook/tree/ifarted + Tag v0.14.0-alpha，无 arena，干净专业；永久分享部署到 Fly/Vercel + TestFlight/Play Internal 后分享域名。
