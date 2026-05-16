# Serene Frontend — Setup Guide

## How to use these files

### 1. Copy files into your frontend folder

Replace / merge the contents of `serene/` into your existing `frontend/` folder.
Your final `frontend/` structure should look like:

```
frontend/
├── index.html                          ← REPLACE
├── vite.config.js                      ← REPLACE
├── package.json                        ← REPLACE
├── .env                                ← REPLACE (set VITE_API_BASE)
├── public/
│   ├── logo.png                        ← KEEP (your existing logo)
│   └── login-bck.png                   ← KEEP (your existing bg image)
└── src/
    ├── main.jsx                        ← REPLACE
    ├── App.jsx                         ← REPLACE
    ├── index.css                       ← REPLACE
    ├── hooks/
    │   └── useAuth.jsx                 ← REPLACE
    ├── services/
    │   └── api.js                      ← REPLACE
    ├── components/
    │   ├── AppLayout.jsx               ← NEW
    │   ├── GlassCard.jsx               ← NEW
    │   └── Sidebar.jsx                 ← NEW (replaces old Navbar/Sidebar)
    └── pages/
        ├── Home.jsx                    ← REPLACE
        ├── Login.jsx                   ← REPLACE
        ├── Dashboard.jsx               ← REPLACE
        ├── Chat.jsx                    ← REPLACE
        ├── Mood.jsx                    ← NEW
        ├── Tests.jsx                   ← NEW
        ├── Profile.jsx                 ← NEW
        ├── Onboarding/
        │   └── OnboardingFlow.jsx      ← NEW (replaces Step1-4)
        └── FindHelp/
            ├── Helplines.jsx           ← REPLACE
            ├── FindTherapist.jsx       ← REPLACE
            └── SelfHelpTechniques.jsx  ← REPLACE
```

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Set your API URL

Edit `.env`:
```
VITE_API_BASE=http://localhost:8000/api/v1
```

### 4. Run

```bash
npm run dev
# → http://localhost:5173
```

---

## Key changes from previous frontend

| What | Change |
|------|--------|
| Sidebar | New collapsible sidebar with mobile drawer toggle (hamburger) |
| Onboarding | Single `OnboardingFlow.jsx` file handles all 4 steps (no separate Step1–4) |
| Color system | Full Serene design system from DESIGN.md (indigo-violet primary, teal secondary) |
| New pages | `Mood.jsx`, `Tests.jsx`, `Profile.jsx` — all with real API calls |
| Find Help | `Helplines`, `FindTherapist`, `SelfHelpTechniques` — all rebuilt with new UI |
| AppLayout | Shared layout wrapper — import in any new page you build |
| GlassCard | Reusable glass card component |
| Fonts | Playfair Display + DM Sans + JetBrains Mono loaded in `index.html` |

---

## Route Map

| Path | Component | Auth |
|------|-----------|------|
| `/` | Home | Public |
| `/login` | Login | Public (redirects if logged in) |
| `/onboarding/:step` | OnboardingFlow | Protected |
| `/dashboard` | Dashboard | Protected |
| `/chat` | Chat | Protected |
| `/mood` | Mood | Protected |
| `/tests` | Tests | Protected |
| `/profile` | Profile | Protected |
| `/find-help/helplines` | Helplines | Public |
| `/find-help/therapist` | FindTherapist | Public |
| `/find-help/self-help` | SelfHelpTechniques | Public |

---

## Notes

- The sidebar auto-highlights the active route via React Router `NavLink`
- Onboarding step is controlled internally by `OnboardingFlow` — the URL param `:step` is kept for back-compat but state is managed in React
- `AppLayout` wraps all authenticated pages — pass `title` and `subtitle` props
- All API calls auto-refresh JWT tokens on 401 responses
