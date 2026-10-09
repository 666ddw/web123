# NOVA · 探索未知

一个纯前端的 WebGL 星海落地页：片元着色器实时生成星空，鼠标划过产生斥力扰动。

## 技术栈

- **React 18**（UMD，浏览器端直接用）
- **ogl** — 轻量 WebGL 封装（本地打包为 `js/ogl.js`）
- **Babel Standalone** — 浏览器端实时编译 JSX
- **WebGL / GLSL** — 星空由 `js/shaders.js` 中的片元着色器实时计算，无贴图资源

## 目录结构

```
index.html          页面入口
启动网站.bat         一键启动本地预览服务器（Windows）
css/style.css       全部样式
js/ogl.js           ogl 打包产物（IIFE，暴露全局 OGL）
js/shaders.js       GLSL 着色器字符串
js/galaxy.jsx       星海 WebGL 组件
js/useReveal.jsx    滚动进场钩子
js/ui.jsx           Counter / CursorGlow / TiltCard
js/data.jsx         页面文案与数据
js/app.jsx          主应用与挂载
```

## 本地运行

因为 JSX 由 Babel 在运行时通过 XHR 加载，**直接双击 `index.html` 会因为 `file://` 的 CORS 限制而白屏**，必须通过 HTTP 打开。

Windows 下双击 `启动网站.bat` 即可，或手动执行：

```bash
python -m http.server 8000
# 然后访问 http://127.0.0.1:8000
```

## 说明

- React / ReactDOM / Babel / Google Fonts 仍走 CDN，首次打开需要联网。
- `js/ogl.js` 是 `ogl@1.0.11` 的 esbuild 打包产物（`--format=iife --global-name=OGL`），请勿手工修改。
