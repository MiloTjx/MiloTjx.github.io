#!/usr/bin/env python3
# 扫描 posts/ 下的 markdown，解析 front matter，生成 posts.json（供前端读取文章列表）。
# 仅使用 Python 标准库，可在 GitHub Actions (ubuntu-latest, python 3.11) 直接运行。
import os
import re
import json
import glob

POSTS_DIR = "posts"


def parse_front_matter(text):
    fm = {}
    body = text
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", text, re.DOTALL)
    if m:
        fm_text, body = m.group(1), m.group(2)
        for line in fm_text.splitlines():
            if ":" not in line:
                continue
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            if val.startswith("[") and val.endswith("]"):
                inner = val[1:-1].strip()
                val = [x.strip().strip('"').strip("'") for x in inner.split(",")] if inner else []
            elif (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                val = val[1:-1]
            fm[key] = val
    return fm, body


def main():
    posts = []
    for path in glob.glob(os.path.join(POSTS_DIR, "*.md")):
        slug = os.path.splitext(os.path.basename(path))[0]
        if slug == "about":
            continue
        with open(path, encoding="utf-8") as f:
            text = f.read()
        fm, _ = parse_front_matter(text)
        posts.append({
            "slug": slug,
            "title": fm.get("title", slug),
            "date": fm.get("date", ""),
            "category": fm.get("category", ""),
            "tags": fm.get("tags", []),
            "excerpt": fm.get("excerpt", ""),
        })
    # 按日期倒序（ISO 日期字符串可直接比较）
    posts.sort(key=lambda p: str(p["date"]), reverse=True)
    with open("posts.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"generated {len(posts)} posts -> posts.json")


if __name__ == "__main__":
    main()
