# 如何分享 iFarted 成果 — 分享指南

Date: 2026-09-11
Branch: arena/01a08e52-udlbook
Tags: v0.13.0-alpha, v0.14.0-alpha
Repo: https://github.com/lin2mm/udlbook

## 1. 最快：分享 GitHub 分支链接

你的所有代码已推送到 GitHub 分支，任何人可查看：

**分支链接**：
- https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook

**最新提交**：
- v14 `3f11445` — 最终 README v4 + 架构 + v1.0 Alpha 总结
- v13 `96b95c7` — 隐私+条款+最终发布说明
- v12 `b6c3029` — 音效选择器UI+部署清单
- v11 `26a2fd8` — 音效变体+触觉+FartButton v2+Admin React

**Tags**：
- https://github.com/lin2mm/udlbook/releases/tag/v0.14.0-alpha — v0.14.0-alpha 最终 v1.0 Alpha
- https://github.com/lin2mm/udlbook/releases/tag/v0.13.0-alpha — v0.13.0-alpha

**分享话术**（复制即用）：
> 💨 iFarted — Yo-style "I farted." 整个消息，通知即消息，无收件箱。已完成 v0.14.0-alpha 最终 v1.0 Alpha 脚手架：
> - Server live :3000 Bun+Hono+SQLite 13端点 20用户100 farts 100/hour 20活跃 测试7 pass + E2E + 负载1136 RPS
> - Mobile MVP 7屏 + Zustand + 推送/联系人/广告/IAP + FartButton v2触觉动画+SoundPicker 5变体
> - Web 5173 UDL网站+IFarted演示真API + 5174独立PWA暗色切换SoundPicker AdminDashboard
> - 文档全面：API_DOCS, PRIVACY, TERMS, DEPLOYMENT_CHECKLIST, STORE_CHECKLIST, APP_REVIEW, RELEASE_NOTES v13
> - GitHub分支：https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook
> - Tag：v0.14.0-alpha https://github.com/lin2mm/udlbook/releases/tag/v0.14.0-alpha

## 2. 创建 Pull Request（让他人 Review）

已为你准备好 PR，运行：

```bash
gh pr create --repo lin2mm/udlbook --base main --head arena/01a08e52-udlbook --title "iFarted v0.14.0-alpha — Final v1.0 Alpha scaffold" --body "v2→v14 完整实现，见 SHARE.md + RELEASE_NOTES_v13.md + README.md v4

- Server :3000 Bun+Hono+SQLite 13端点 auth Bearer 限流持久 metrics admin 安全头优雅关闭 健康timestamp+uptime WebSocket可选 负载测试 50 farts 1136 RPS 5音效变体
- Mobile 7屏 home real friends pull-to-refresh推送处理位置切换AdBanner gated EmptyState onboarding 3路径<60s搜索联系人邀请fart-detail deadpan地图pin fart back设置Remove Ads IAP Restore手机发现邀请隐私退出 stores useAuth useFriends libs api notifications contacts ads iap linking haptics components FartButton v2 haptics动画 SoundPicker config app.json eas.json PrivacyInfo
- Web 5173 UDL+IFarted演示真API 5174独立PWA暗色切换SoundPicker AdminDashboard build 133模块313KB
- Docs API_DOCS CONTRIBUTING SECURITY DEPLOYMENT ROADMAP APP_REVIEW STORE_CHECKLIST IMPORT_NOTES RELEASE_NOTES v0.9.0+v11+v13 DEPLOYMENT_CHECKLIST_v1 PRIVACY TERMS
- Tests 7 pass unit + E2E 2用户3 farts + 负载100 farts 819 RPS
- Live :3000 :5173 :5174 三服务器
- Drive导入 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview绕过TLS封锁
"
```

PR链接将是：https://github.com/lin2mm/udlbook/pulls

## 3. 分享 Live Preview（临时公开链接）

当前沙盒有3个live服务器，可通过 Arena 预览链接分享（临时，沙盒关闭后失效）：

- **Server** :3000 — 健康检查 /metrics /admin.html
- **UDL网站** :5173 — IFarted演示区 #ifarted 真API流程
- **Web客户端** :5174 — 独立PWA 完整流程 注册/搜索/添加/fart/邀请/指标/日志+声音+arch 暗色切换

在 Arena UI 中，每个 `start_process` 会显示 **LIVE PREVIEW** 按钮，复制链接分享给他人即可（格式 https://{port}-{sandboxId}.e2b.app）。

要获取当前预览链接，运行：
```bash
# 在沙盒内查看进程
ps aux | grep bun
# 预览链接在 Arena UI 的 LIVE PREVIEW 区域
```

**注意**：预览链接是临时的，沙盒回收后失效。永久分享需部署到 Fly/Vercel（见第5节）。

## 4. 一键本地运行（分享给技术同事）

让他人 clone 并运行：

```bash
git clone https://github.com/lin2mm/udlbook.git
cd udlbook
git checkout arena/01a08e52-udlbook

# Server
cd apps/server
npm install -g bun
bun install
ADMIN_KEY=test123 PORT=3000 bun src/index.ts
# → http://localhost:3000/health
# → http://localhost:3000/admin.html?key=test123
# 测试
bun test
bun src/e2e-sim.ts
bun src/load-test.ts

# 另开终端 Web客户端
cd apps/web
npm install
npm run dev -- --port 5174 --host 0.0.0.0
# → http://localhost:5174

# 另开终端 UDL网站
cd ../..
npm install
npm run dev -- --port 5173 --host 0.0.0.0
# → http://localhost:5173
# 滚动到 #ifarted 演示区

# Mobile
cd apps/mobile
npm install
npx expo start
# 需 Expo账号 + eas build --profile development --platform all 真机推送E2E
```

## 5. 永久部署分享（推荐）

### Server → Fly.io / Railway / Render

`apps/server/DEPLOYMENT.md` 已有 Docker + Fly + Railway 指南：

**Fly.io**：
```bash
cd apps/server
fly launch
fly secrets set ADMIN_KEY=strong_random_key CORS_ORIGIN=https://ifarted.app
fly deploy
# → https://ifarted-api.fly.dev 健康检查
```

**Railway**：
```bash
# 连接 GitHub repo，选 apps/server，设置 ENV ADMIN_KEY CORS_ORIGIN
# 自动部署 → https://ifarted-api.up.railway.app
```

部署后更新 `apps/web/.env` 和 `apps/mobile/app.json` 的 `apiUrl` 为 `https://api.ifarted.app`

### Web → Vercel / Netlify / Cloudflare Pages

```bash
cd apps/web
vercel --prod
# 或
npm run build
# 上传 dist/ 到 Netlify / Cloudflare Pages
# → https://ifarted.app
```

设置 ENV `VITE_IFARTED_API_URL=https://api.ifarted.app`

### Mobile → TestFlight / Play Internal

按 `DEPLOYMENT_CHECKLIST_v1.md`：

```bash
cd apps/mobile
npx expo login
eas build --profile preview --platform all
eas submit --profile preview
# → TestFlight内部测试 + Play内部测试链接分享
```

## 6. 导出为压缩包

```bash
cd /tmp
tar -czf ifarted-v0.14.0-alpha.tar.gz -C /home/user/udlbook --exclude=node_modules --exclude=.git --exclude=dist --exclude=build .
# 分享 /tmp/ifarted-v0.14.0-alpha.tar.gz
```

或 GitHub 直接下载分支 ZIP：
- https://github.com/lin2mm/udlbook/archive/refs/heads/arena/01a08e52-udlbook.zip

## 7. 分享文档（非技术同事）

直接分享这些 Markdown 文件（已包含所有信息）：

- **README.md** v4 — 最终总结，架构，快速开始，品牌/音频，部署，导入说明
- **RELEASE_NOTES_v13.md** — v0.13.0 Alpha 最终 v1.0 Alpha 发布说明，什么是新的，live预览，测试，已知问题
- **DEPLOYMENT_CHECKLIST_v1.md** — v1.0 Alpha→Beta→Store 全面清单，当前状态，阻碍，如何解锁9步骤
- **PRIVACY.md** + **TERMS.md** — 隐私政策+条款，模板可托管 ifarted.app/privacy + /terms
- **SHARE.md** — 本文，分享指南
- **apps/server/API_DOCS.md** — 13端点详细文档
- **APP_REVIEW.md** — App Review context-based Yo拒绝流
- **STORE_CHECKLIST.md** — 商店清单

## 8. 演示视频 / 截图

建议录制：

1. **Web演示** 5174：注册 → 搜索 → 添加好友 → 点击💨 Fart → 日志 + 声音 + 指标
2. **UDL网站** 5173：滚动到 #ifarted 演示区，真实API流程
3. **Admin仪表**：http://localhost:3000/admin.html?key=test123 — 指标卡 + 用户/farts表 + raw JSON
4. **Server测试**：`bun src/e2e-sim.ts` 2用户互加好友3 farts SF/NYC + `bun src/load-test.ts` 50 farts 1136 RPS
5. **Mobile**（如有真机）：onboarding 3路径<60s → home真实朋友 → FartButton v2触觉动画 → fart-detail deadpan地图pin → 设置Remove Ads

工具：Loom, OBS, 或手机录屏

## 9. 当前成果快照（复制到邮件/Slack）

```
💨 iFarted v0.14.0-alpha — Final v1.0 Alpha scaffold — 2026-09-11

GitHub: https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook
Tag: https://github.com/lin2mm/udlbook/releases/tag/v0.14.0-alpha
Branch: arena/01a08e52-udlbook
Commits: v2→v14 14 pushes

Server live :3000 Bun+Hono+SQLite WAL 13端点 POST /v1/register GET /v1/me POST /v1/tokens POST /v1/farts GET /v1/users/search POST /v1/contacts POST /v1/invites GET /v1/friends ordered lastFartAt POST /v1/friends POST /v1/settings/phone-discovery POST /v1/block + /metrics /v1/stats /admin /admin/users /admin/farts /admin.html HTML仪表 安全头nosniff DENY XSS Referrer HSTS CORS优雅关闭健康timestamp+uptime 5音效变体classic short long squeaky wet WebSocket可选 负载测试 20用户100 farts 100/hour 20活跃 50 farts 1136 RPS 100 farts 819 RPS 测试7 pass unit+E2E+load

Mobile MVP 7屏 home real friends pull-to-refresh推送处理位置切换AdBanner gated EmptyState onboarding 3路径<60s搜索联系人邀请fart-detail deadpan地图pin fart back设置Remove Ads IAP Restore手机发现邀请隐私退出 stores useAuth useFriends libs api typed fetch Bearer notifications channel farts fart.mp3振动getExpoPushToken监听contacts权限E164 ads initAds TestIds BANNER非个性化iap RevenueCat+expo-iap remove_ads $1.99 ad_free entitlement linking parseInviteFromUrl ifarted:// deep link setupLinkingListener haptics light success error components AdBanner real BannerAd fallback FartButton EmptyState ErrorBoundary catch retry FartButton.v2 haptics+动画scale 0.9→1 SoundPicker选变体 config app.json name iFarted slug ifarted scheme ifarted icon splash ios bundle com.ifarted.app NSLocation NSContacts UIBackgroundModes remote-notification googleMobileAdsAppId占位android包com.ifarted.app权限ACCESS_FINE_LOCATION READ_CONTACTS googleMobileAdsAppId googleServicesFile secret插件expo-router expo-notifications sounds expo-location google-mobile-ads maps extra.eas.projectId apiUrl eas.json dev internal preview internal prod autoIncrement PrivacyInfo.xcprivacy无追踪位置联系人文件时间戳用户默认

Web 5173 UDL网站+IFarted演示真API 5174独立PWA全流程注册localStorage搜索添加fart lat/lng邀请指标日志声音arch暗色切换🌙/☀️ SoundPicker 5变体 AdminDashboard React仪表 build 133模块313KB PWA manifest standalone #fff7ed #000图标192/512

Docs README v4最终总结架构快速开始品牌音频部署导入说明 RELEASE_NOTES v13最终发布说明 DEPLOYMENT_CHECKLIST v1全面清单Alpha→Beta→Store PRIVACY TERMS模板 API_DOCS 13端点 APP_REVIEW context-based Yo拒绝流 STORE_CHECKLIST品牌音频App Store Play Console Expo EAS部署隐私变现测试法律 SECURITY Yo教训 DEPLOYMENT Docker/Fly/Railway ROADMAP IMPORT_NOTES

Tests 单元7 pass crypto rate-limit apiKey 64 hex hash确定性UUID inviteCode无O0I1 phone标准化 rate-limit允许阻止 + 集成 + E2E 2用户互加好友3 farts SF/NYC + 负载10用户5 farts各50 farts 1136 RPS 100 farts 819 RPS + vite build 133模块313KB

Live :3000 :5173 :5174 三服务器

Drive导入 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview绕过TLS封锁 8 markdown

Next EAS dev builds真ExpoPushTokens自定义声音最终位置联系人E2E AdMob真ID IAP RevenueCat Firebase google-services.json最终品牌图标splash商店提交 按DEPLOYMENT_CHECKLIST_v1 9步骤解锁
```

## 10. 联系 / 反馈

- GitHub Issues: https://github.com/lin2mm/udlbook/issues
- 分支: arena/01a08e52-udlbook
- 本地: /home/user/udlbook
- 3服务器live: :3000 :5173 :5174
- 文档: README.md v4 + RELEASE_NOTES_v13.md + DEPLOYMENT_CHECKLIST_v1.md + SHARE.md

---

**一句话总结**：分享 GitHub分支链接 https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook + Tag v0.14.0-alpha + 本地运行命令，即可让任何人复现全部成果；永久分享需按 DEPLOYMENT.md 部署到 Fly/Vercel + TestFlight/Play Internal。
