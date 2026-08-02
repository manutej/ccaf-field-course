# CCAF Field Course — Deploy

## Target custom domain
**https://claude-architect.cetiai.co**

This is a **subdomain of your real domain** `cetiai.co` — not a fake platform host.

## Live now

| Surface | URL | Notes |
|--------|-----|--------|
| **GitHub Pages (course HTML)** | https://manutej.github.io/ccaf-field-course/ | Public, CNAME file set |
| **Vercel (public, no SSO)** | https://claude-architect-cetiai.vercel.app | Landing + deploy project ready |
| **Source** | https://github.com/manutej/ccaf-field-course | main + gh-pages |

GitHub Pages already has `cname: claude-architect.cetiai.co` on the site settings (from the `CNAME` file on `gh-pages`).

## DNS you must add (required for the custom host)

In the DNS panel that owns **cetiai.co** (looks like Vercel for the apex):

| Type | Name | Value |
|------|------|--------|
| **CNAME** | `claude-architect` | `manutej.github.io` |

(If you prefer the Vercel project instead of GitHub Pages, use value `cname.vercel-dns.com` **and** add `claude-architect.cetiai.co` under the Vercel project **Domains** tab.)

After DNS propagates (often 1–30 min):
1. Open https://claude-architect.cetiai.co  
2. In GitHub repo → Settings → Pages, enforce HTTPS if not already green.

## Recommended path
**GitHub Pages + CNAME → manutej.github.io** — already wired on the repo side.

## Integrity
Public exam-guide objectives only. Not affiliated with Anthropic.
