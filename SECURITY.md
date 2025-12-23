# Security Policy

## 🔒 Security Overview

The MeauxOS Ecosystem handles sensitive data across multiple brands and services. Security is a top priority.

## 📋 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email security concerns privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## 🔐 Security Best Practices

### Secrets Management

```bash
# ❌ NEVER do this
const apiKey = "sk-abc123..."

# ✅ Always do this
const apiKey = process.env.API_KEY
```

### Environment Variables

| Environment | Where to Store |
|-------------|----------------|
| Local Dev | `.env.local` (gitignored) |
| CI/CD | GitHub Secrets |
| Workers | Wrangler Secrets |
| Production | Cloudflare Dashboard |

### Setting Worker Secrets

```bash
# Set a secret for a Worker
wrangler secret put SECRET_NAME

# List secrets
wrangler secret list
```

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API access |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account |
| `D1_DATABASE_ID` | Main D1 database ID |
| `SUPABASE_SERVICE_KEY` | Supabase admin access |

## 🛡️ Security Features

### Cloudflare Protection
- WAF (Web Application Firewall)
- DDoS protection
- SSL/TLS encryption
- Bot management

### Data Protection
- D1 databases are encrypted at rest
- R2 storage is encrypted
- All API calls use HTTPS
- Supabase Row Level Security (RLS)

## 🔍 Security Scanning

### Automated Checks
- **TruffleHog** - Scans for exposed secrets
- **npm audit** - Checks for vulnerable dependencies
- **Dependabot** - Automated security updates

### Manual Reviews
- Code review for all PRs
- Regular security audits
- Penetration testing (periodic)

## 📝 Incident Response

If a security incident occurs:

1. Immediately rotate affected credentials
2. Assess the scope of the breach
3. Notify affected parties if required
4. Document and learn from the incident

## 🔄 Credential Rotation

Rotate credentials:
- **API Tokens**: Every 90 days
- **After team member leaves**: Immediately
- **After potential exposure**: Immediately

---

*Security is everyone's responsibility. When in doubt, ask!*
