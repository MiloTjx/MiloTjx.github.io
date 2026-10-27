# 我的个人网站（GitHub Pages）

一个**免费、免服务器、不用写代码**的个人网站：记录减脂、投资与产品思考。
技术栈：纯静态 HTML/CSS/JS + Decap CMS 后台 + 自动生成文章索引。

## 目录结构
```
index.html              首页（前端路由，无需后端）
assets/css/style.css   样式
assets/js/app.js       前端逻辑（文章列表 / 文章页 / 关于页）
assets/js/marked.min.js 本地 markdown 渲染
posts/*.md             你的文章（每篇一个 markdown 文件）
about.md               关于我页面
posts.json             文章索引（自动生成，勿手改）
admin/                 Decap CMS 后台（/admin 访问）
scripts/gen_posts.py   扫描 posts 生成 posts.json
.github/workflows/     推送后自动刷新 posts.json
```

## 一、上线（只需做一次）
1. 注册 / 登录 GitHub（https://github.com）。
2. 新建仓库，名称必须叫：`MiloTjx.github.io`（例如用户名 milo，则仓库名 `milo.github.io`）。
3. 把本目录所有文件推送到该仓库（用 GitHub Desktop 拖进去，或按下方命令）。
4. 仓库 **Settings → Pages → Source** 选 `main` 分支、根目录 `/`，保存。
5. 等 1~2 分钟，访问 `https://MiloTjx.github.io` 即可。

### 用命令行推送（推荐，一次配置后最省事）
> 在 WorkBuddy 的终端里 `gh` 已装好；自己电脑上可用 `brew install gh`（Mac）或从 https://cli.github.com 下载。
```bash
# 登录（只需第一次）
gh auth login          # 按提示用浏览器授权

# 进入本目录后初始化并推送
cd personal-site
git init
git add -A
git commit -m "init personal site"
gh repo create MiloTjx.github.io --public --source=. --push
```
> 不想用命令行？装个 **GitHub Desktop**，登录后把 personal-site 文件夹拖进去，点 Publish 即可。

## 二、改成你自己的信息
- 站点标题 / 名字 / 标语：编辑 `assets/js/app.js` 顶部的 `SITE` 对象。
- 关于我：编辑 `about.md`。
- 文章示例：删除 `posts/welcome.md` 等示例，换成你自己的。

## 三、发文章（两种方式）

### 方式 A：后台（最省心，推荐）
1. 首次需配置一次 GitHub 授权（见下方「后台授权」）。
2. 浏览器打开 `https://MiloTjx.github.io/admin`。
3. 登录 GitHub → 点「文章 → 新建」→ 填标题、分类、摘要、正文 → 发布。
4. 文章自动存成 markdown，GitHub 自动刷新列表，网站即时更新。

### 方式 B：直接改文件（零配置）
在 GitHub 网页里进 `posts/` 目录 → Add file → 新建一个 `年-月-日-标题.md`，
顶部照抄示例的 `---` 头信息，下面写正文，提交即可。

## 四、后台授权（仅首次，约 5 分钟）
Decap CMS 需要用你的 GitHub 账号登录，需要建一个 OAuth App：
1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**
   - Application name: 个人网站后台
   - Homepage URL: `https://MiloTjx.github.io`
   - Authorization callback URL: 填下方 Netlify 提供的地址
2. 打开一键部署授权服务：
   https://app.netlify.com/start/deploy?repository=https://github.com/decaporg/decap-cms-oauth-provider
   部署完成后会得到 `https://xxxx.netlify.app`，把它填到上一步的 callback URL。
3. 回到 OAuth App 页面，复制 **Client ID**，填入 `admin/config.yml` 对应位置，
   本仓库的 `admin/config.yml` 已预填为 MiloTjx，若你换了用户名请同步修改。

> 嫌麻烦可先只用「方式 B」。等你想用后台了，再回来做这一步。

## 五、绑定自己的域名（可选）
买一个域名（约 ¥几十/年），在域名解析处加一条 CNAME 指向 `MiloTjx.github.io`，
并在仓库根目录放一个 `CNAME` 文件写入你的域名即可。
