// ===== 站点基础信息：你以后主要改这里就行 =====
const SITE = {
  title: "我的个人网站",
  author: "（在这里填写你的名字）",
  tagline: "记录减脂、投资与产品思考",
  nav: [
    { label: "首页",     href: "#/" },
    { label: "减脂日记", href: "#/cat/减脂日记" },
    { label: "投资复盘", href: "#/cat/投资复盘" },
    { label: "产品思考", href: "#/cat/产品思考" },
    { label: "关于",     href: "#/about" }
  ]
};

let POSTS = [];

async function loadPosts() {
  try {
    const res = await fetch("posts.json", { cache: "no-store" });
    POSTS = await res.json();
  } catch (e) {
    POSTS = [];
  }
}

function fmtDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function postCard(p) {
  return `
  <article class="card">
    <div class="card-meta">
      <span class="tag">${p.category || ""}</span>
      <time>${fmtDate(p.date)}</time>
    </div>
    <h3 class="card-title"><a href="#/post/${p.slug}">${p.title}</a></h3>
    <p class="card-excerpt">${p.excerpt || ""}</p>
    <a class="read-more" href="#/post/${p.slug}">阅读全文 →</a>
  </article>`;
}

function renderHome() {
  const app = document.getElementById("app");
  let html = `
  <section class="hero">
    <h1>${SITE.title}</h1>
    <p class="tagline">${SITE.tagline}</p>
    <p class="hero-sub">这里是 ${SITE.author} 的个人空间，记录减脂塑形、投资复盘与产品思考。</p>
  </section>
  <h2 class="section-title">最新文章</h2>
  <div class="grid">`;
  if (POSTS.length === 0) {
    html += `<p>还没有文章，去「关于」页或后台写第一篇吧。</p>`;
  } else {
    html += POSTS.map(postCard).join("");
  }
  html += `</div>`;
  app.innerHTML = html;
}

function renderCategory(cat) {
  const app = document.getElementById("app");
  const list = POSTS.filter(p => p.category === cat);
  let html = `<h2 class="section-title">${cat}</h2>`;
  if (list.length === 0) {
    html += `<p>这个分类下还没有文章。</p>`;
  } else {
    html += `<div class="grid">${list.map(postCard).join("")}</div>`;
  }
  app.innerHTML = html;
}

async function renderPost(slug) {
  const app = document.getElementById("app");
  const p = POSTS.find(x => x.slug === slug);
  let md = "_内容加载失败_";
  try {
    const res = await fetch(`posts/${slug}.md`, { cache: "no-store" });
    md = await res.text();
  } catch (e) { /* ignore */ }
  app.innerHTML = `
    <article class="post">
      <div class="post-meta">
        <span class="tag">${p ? p.category : ""}</span>
        <time>${p ? fmtDate(p.date) : ""}</time>
      </div>
      <h1 class="post-title">${p ? p.title : slug}</h1>
      <div class="post-body">${marked.parse(md)}</div>
      <p class="back"><a href="#/">← 返回首页</a></p>
    </article>`;
  window.scrollTo(0, 0);
}

async function renderAbout() {
  const app = document.getElementById("app");
  let md = "# 关于我\n\n（在后台或仓库里编辑 about.md 即可。）";
  try {
    const res = await fetch("about.md", { cache: "no-store" });
    md = await res.text();
  } catch (e) { /* ignore */ }
  app.innerHTML = `<article class="post"><div class="post-body">${marked.parse(md)}</div></article>`;
  window.scrollTo(0, 0);
}

function router() {
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\//, "").split("/");
  if (hash === "#/" || hash === "") return renderHome();
  if (parts[0] === "cat")  return renderCategory(decodeURIComponent(parts[1]));
  if (parts[0] === "post") return renderPost(decodeURIComponent(parts[1]));
  if (parts[0] === "about") return renderAbout();
  return renderHome();
}

async function init() {
  if (window.marked) marked.setOptions({ breaks: true, gfm: true });
  document.getElementById("site-title").textContent = SITE.title;
  document.getElementById("foot-name").textContent = SITE.title;
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("nav").innerHTML =
    SITE.nav.map(n => `<a href="${n.href}">${n.label}</a>`).join("");
  await loadPosts();
  window.addEventListener("hashchange", router);
  router();
}

init();
