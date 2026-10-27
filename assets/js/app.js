// ===== 站点基础信息：你以后主要改这里就行 =====
const SITE = {
  name: "Milo",                       // 站点品牌名（显示在左上角）
  title: "Milo 的角落",                 // 浏览器标签 / 页脚名称
  tagline: "产品经理 · 记录生活、投资与职业成长",
  intro: "这里是我给自己留的一方小角落——记减脂、聊投资、写产品，也放一些还没想好的东西。慢慢来，长期主义。",
  // 社交链接：把 href 换成你自己的即可；不需要就删掉整行
  socials: [
    { label: "GitHub", href: "https://github.com/MiloTjx" },
    { label: "邮箱", href: "mailto:you@example.com" }
  ]
};

// ===== 四大板块：顺序即首页卡片顺序，每个板块有自己的专属色 =====
const SECTIONS = [
  { slug: "life",   name: "生活",   icon: "🌿", color: "#e07a5f",
    desc: "减脂塑形、日常记录，和一切让生活更有意思的小事。",
    categories: ["减脂日记"] },
  { slug: "invest", name: "投资",   icon: "📈", color: "#2a9d8f",
    desc: "复盘、仓位与我对市场的思考，不荐股，只记录。",
    categories: ["投资复盘"] },
  { slug: "career", name: "职业",   icon: "🧭", color: "#4361ee",
    desc: "产品经理的方法论、需求评审与成长里踩过的坑。",
    categories: ["产品思考"] },
  { slug: "tbd",    name: "待定中", icon: "✨", color: "#9aa0a6",
    desc: "这个板块还空着，先占个位，等想好了再填。",
    categories: [] }
];

const SECTION_MAP = Object.fromEntries(SECTIONS.map(s => [s.slug, s]));

let POSTS = [];

async function loadPosts() {
  try {
    const res = await fetch("posts.json", { cache: "no-store" });
    POSTS = await res.json();
  } catch (e) { POSTS = []; }
}

function fmtDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function postsOf(section) {
  if (!section || section.categories.length === 0) return [];
  return POSTS.filter(p => section.categories.includes(p.category));
}

function postCard(p) {
  return `
  <article class="card">
    <div class="card-top">
      <span class="tag">${p.category || ""}</span>
      <time>${fmtDate(p.date)}</time>
    </div>
    <h3><a href="#/post/${p.slug}">${p.title}</a></h3>
    <p class="card-excerpt">${p.excerpt || ""}</p>
    <a class="read-more" href="#/post/${p.slug}">阅读全文 →</a>
  </article>`;
}

function sectionTile(sec) {
  const list = postsOf(sec).slice(0, 3);
  const body = list.length
    ? `<ul class="t-posts">${list.map(p =>
        `<li><a href="#/post/${p.slug}">${p.title}<span class="date">${fmtDate(p.date)}</span></a></li>`
      ).join("")}</ul>
       <a class="t-more" href="#/section/${sec.slug}">查看全部 →</a>`
    : `<ul class="t-posts"><li>敬请期待，先占个位 ✦</li></ul>`;
  return `
  <a class="tile ${list.length ? "" : "empty"}" style="--tile-color:${sec.color}" href="#/section/${sec.slug}">
    <div class="t-head">
      <span class="t-icon">${sec.icon}</span>
      <span class="t-name">${sec.name}</span>
    </div>
    <p class="t-desc">${sec.desc}</p>
    ${body}
  </a>`;
}

function renderHome() {
  const app = document.getElementById("app");
  const socials = (SITE.socials && SITE.socials.length)
    ? `<div class="socials">${SITE.socials.map(s =>
        `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join("")}</div>`
    : "";
  app.innerHTML = `
  <section class="hero">
    <div class="avatar">${SITE.name.charAt(0).toUpperCase()}</div>
    <h1>${SITE.title}</h1>
    <p class="tagline">${SITE.tagline}</p>
    <p class="intro">${SITE.intro}</p>
    ${socials}
  </section>

  <div class="section-label"><h2>板块</h2><span class="hint">挑一个感兴趣的方向</span></div>
  <div class="bento">${SECTIONS.map(sectionTile).join("")}</div>

  <div class="section-label"><h2>最新文章</h2><span class="hint">${POSTS.length} 篇</span></div>
  <div class="feed">${POSTS.length ? POSTS.map(postCard).join("") : `<p class="empty-state">还没有文章，去后台或仓库写第一篇吧。</p>`}</div>
  `;
}

function renderSection(slug) {
  const app = document.getElementById("app");
  const sec = SECTION_MAP[slug];
  if (!sec) return renderHome();
  const list = postsOf(sec);
  app.innerHTML = `
  <div class="page-head" style="--accent:${sec.color}">
    <h1>${sec.icon} ${sec.name}</h1>
    <p class="sub">${sec.desc}</p>
  </div>
  <div class="feed">
    ${list.length
      ? list.map(postCard).join("")
      : `<div class="empty-state"><div class="big">✨</div><p>这个板块还在筹建中，敬请期待。</p></div>`}
  </div>`;
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
  app.innerHTML = `<div class="about-wrap"><div class="post-body">${marked.parse(md)}</div></div>`;
  window.scrollTo(0, 0);
}

// 导航高亮
function renderNav() {
  const hash = location.hash || "#/";
  const items = [
    { label: "首页", href: "#/" },
    ...SECTIONS.map(s => ({ label: s.name, href: `#/section/${s.slug}` })),
    { label: "关于", href: "#/about" }
  ];
  const nav = document.getElementById("nav");
  nav.innerHTML = items.map(n => {
    const active = (n.href === "#/" && hash === "#/") || (n.href !== "#/" && hash.startsWith(n.href));
    return `<a href="${n.href}" class="${active ? "active" : ""}">${n.label}</a>`;
  }).join("");
}

function router() {
  renderNav();
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\//, "").split("/");
  if (hash === "#/" || hash === "") return renderHome();
  if (parts[0] === "section") return renderSection(decodeURIComponent(parts[1]));
  if (parts[0] === "post") return renderPost(decodeURIComponent(parts[1]));
  if (parts[0] === "about") return renderAbout();
  return renderHome();
}

async function init() {
  if (window.marked) marked.setOptions({ breaks: true, gfm: true });
  document.title = SITE.title;
  document.getElementById("site-title").textContent = SITE.name;
  document.getElementById("foot-name").textContent = SITE.title;
  document.getElementById("year").textContent = new Date().getFullYear();
  await loadPosts();
  window.addEventListener("hashchange", router);
  router();
}

init();
