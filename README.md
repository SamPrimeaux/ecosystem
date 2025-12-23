# 🌐 MeauxOS Ecosystem

A comprehensive multi-brand infrastructure platform built on Cloudflare's edge network with Supabase as the data backbone.

![Status](https://img.shields.io/badge/status-production-green)
![Platform](https://img.shields.io/badge/platform-Cloudflare-orange)
![Database](https://img.shields.io/badge/database-D1%20%2B%20Supabase-blue)

## 📊 Ecosystem Overview

| Resource | Count | Description |
|----------|-------|-------------|
| **Workers** | 114 | Serverless edge functions |
| **Pages** | 10 | Static site deployments |
| **D1 Databases** | 20 | SQLite databases at the edge |
| **R2 Buckets** | 77 | Object storage |
| **Projects** | 25 | Tracked applications |

---

## 🏢 Brands & Organizations

### Core Platform
| Brand | Slug | Description |
|-------|------|-------------|
| **MeauxOS Platform** | `meauxos` | Central operating system & infrastructure |
| **Meauxbility Foundation** | `meauxbility` | Non-profit technology enablement |

### Client Brands
| Brand | Slug | Type |
|-------|------|------|
| **Inner Animal Media** | `inneranimal` | Media & content production |
| **Southern Pets Animal Rescue** | `southernpets` | Non-profit animal rescue |
| **Ace Medical** | `ace-medical` | Healthcare services |
| **Blair Mann Enterprise** | `blair-mann` | Business consulting |
| **Evergreen Landscaping** | `evergreen-landscaping` | Landscaping services |
| **Amber Nicole** | `amber-nicole` | Personal brand |
| **AB Films** | `ab-films` | Film production |
| **iAutodidact** | `iautodidact` | Self-learning platform |
| **Fuel n Free Time** | `fuelnfreetime` | Lifestyle brand |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE EDGE                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Workers │  │  Pages  │  │   R2    │  │   D1    │        │
│  │  (114)  │  │  (10)   │  │  (77)   │  │  (20)   │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                         │                                    │
│              ┌──────────┴──────────┐                        │
│              │     meauxos (D1)    │                        │
│              │    191 tables       │                        │
│              │   Central Brain     │                        │
│              └──────────┬──────────┘                        │
└─────────────────────────┼───────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │    SUPABASE (Backup)  │
              │      PostgreSQL       │
              │    209 tables         │
              └───────────────────────┘
```

---

## 📁 Repository Structure

```
ecosystem/
├── .github/
│   └── workflows/         # CI/CD pipelines
├── apps/                  # Application source code
│   ├── workers/           # Cloudflare Workers
│   ├── pages/             # Cloudflare Pages projects
│   └── shared/            # Shared utilities
├── packages/              # Shared packages
│   ├── db/                # Database schemas & migrations
│   ├── ui/                # Shared UI components
│   └── config/            # Shared configurations
├── infra/                 # Infrastructure as code
│   ├── wrangler/          # Wrangler configurations
│   └── terraform/         # Terraform (if needed)
├── docs/                  # Documentation
└── scripts/               # Utility scripts
```

---

## 🚀 Key Projects

### Platform Infrastructure
- **MeauxOS Core** - Central platform orchestration
- **Dashboard Platform** - Unified admin interface
- **Knowledge Base** - AI-powered documentation

### Client Applications
- **Southern Pets** - Animal rescue management system
- **Inner Animal Media** - Media asset management
- **iAutodidact** - Self-learning platform with courses

---

## 🔧 Development

### Prerequisites
- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- GitHub CLI (`gh`)

### Environment Setup

```bash
# Clone the repository
git clone git@github.com:SamPrimeaux/ecosystem.git
cd ecosystem

# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Set up environment variables
cp .env.example .env.local
```

### Deploying a Worker

```bash
# Deploy to development
wrangler deploy --env dev

# Deploy to production
wrangler deploy --env production
```

---

## 🔐 Security

### Secrets Management
- All secrets are stored in **Cloudflare Worker Secrets** or **GitHub Secrets**
- Never commit `.env` files or API keys
- Use `wrangler secret put` for Worker secrets

### Environment Variables
Required environment variables are documented in `.env.example` (without values).

---

## 📊 Database

### Primary: D1 (meauxos)
- **191 tables** - Central source of truth
- Edge-replicated globally
- SQLite-compatible

### Backup: Supabase
- PostgreSQL with real-time capabilities
- Schema synchronized with D1
- Used for complex queries and real-time features

### Key Tables
| Table | Description |
|-------|-------------|
| `organizations` | Brand/org registry |
| `projects` | Project tracking |
| `cloudflare_projects` | Workers/Pages catalog |
| `r2_buckets` | Storage bucket registry |
| `r2_objects` | Object metadata |
| `agent_configs` | AI agent configurations |
| `kanban_tasks` | Task management |

---

## 🔄 CI/CD

### GitHub Actions Workflows
- **Deploy Workers** - Automatic deployment on push
- **Deploy Pages** - Static site deployment
- **Database Migrations** - Schema synchronization
- **Backup** - Scheduled D1 backups to R2

### Branch Strategy
| Branch | Environment | Auto-deploy |
|--------|-------------|-------------|
| `main` | Production | ✅ |
| `develop` | Staging | ✅ |
| `feature/*` | Preview | ✅ |

---

## 📈 Monitoring

- **Cloudflare Analytics** - Traffic & performance
- **Workers Analytics** - Function invocations
- **D1 Metrics** - Database performance
- **Supabase Dashboard** - PostgreSQL monitoring

---

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests: `npm test`
4. Create a Pull Request
5. Wait for CI checks to pass
6. Merge after review

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| Cloudflare Dashboard | [dash.cloudflare.com](https://dash.cloudflare.com) |
| Supabase Dashboard | [supabase.com/dashboard](https://supabase.com/dashboard) |
| GitHub Repo | [github.com/SamPrimeaux/ecosystem](https://github.com/SamPrimeaux/ecosystem) |

---

*Built with ❤️ by the MeauxOS team*
