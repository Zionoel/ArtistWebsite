# BlancWeb — Project Summary

Portfolio + commission + store site for freelance illustrator **MontBlanc**.  
Repo: github.com/Zionoel/ArtistWebsite  
Stack: Next.js 16 · Cloudflare Pages/R2/Turnstile · Google Sheets · DeepL · Resend

---

## Pages
| Route | Description |
|-------|-------------|
| `/` | Redirects to `/[locale]/about` |
| `/[locale]/about` | Landing — image carousel, bio, social links, timeline |
| `/[locale]/portfolio` | Full-screen image gallery |
| `/[locale]/commission` | Schedule grid (O/△/✕) + offerings + process |
| `/[locale]/store` | Store items + platform links |
| `/[locale]/contact` | Contact form → email via Resend |

## i18n
- Locales: `en` `ko` `ja` `zh`
- KO is source language — DeepL auto-translates and writes back to sheet
- Translation files: `messages/*.json`
- Middleware: `proxy.ts` (renamed from middleware.ts for Next.js 16)

## Google Sheets tabs
| Tab | Columns |
|-----|---------|
| Portfolio | A=filename · B=ko · C=en · D=ja · E=zh |
| Schedule | A=year1 · B=month1 · C=status1 · D=year2 · E=month2 · F=status2 |
| Store | A=filename · B=link · C=ko · D=en · E=ja · F=zh |
| About | A=field · B=ko · C=en · D=ja · E=zh |
| Social | A=platform · B=url |
| Timeline | A=year · B=ko · C=en · D=ja · E=zh |
| Offerings | A=ko_name · B=en · C=ja · D=zh · E=price |
| Process | A=ko · B=en · C=ja · D=zh |

## Key env vars (.env.local)
```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEETS_ID
R2_PUBLIC_URL
DEEPL_API_KEY
RESEND_API_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_SITE_URL          ← add when domain is live
```

## TODO (when domain is purchased)
- [ ] Cloudflare Email Routing: `contact@domain.com → wchanhe@gmail.com`
- [ ] Resend: verify domain, update `from` address in `app/api/contact/route.ts`
- [ ] Set `NEXT_PUBLIC_SITE_URL` in Cloudflare Pages env vars
- [ ] Add domain to Turnstile hostname list in Cloudflare dashboard
- [ ] Gmail filter: subject contains `[Commission` → label "Commission"
- [ ] Update Social sheet with real URLs
- [ ] Update About/Timeline sheets with real bio and history
