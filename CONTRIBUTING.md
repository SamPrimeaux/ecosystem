# Contributing to MeauxOS Ecosystem

Thank you for your interest in contributing! This document provides guidelines for contributing to the ecosystem.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone git@github.com:YOUR_USERNAME/ecosystem.git
   cd ecosystem
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📁 Project Structure

```
ecosystem/
├── apps/           # Applications (workers, pages)
├── packages/       # Shared packages
├── infra/          # Infrastructure configurations
├── docs/           # Documentation
└── scripts/        # Utility scripts
```

## 🔒 Security Guidelines

### NEVER Commit:
- API keys or tokens
- `.env` files (except `.env.example`)
- Database credentials
- Private keys
- Any sensitive configuration

### Always:
- Use environment variables for secrets
- Add sensitive files to `.gitignore`
- Use `wrangler secret put` for Worker secrets
- Store secrets in GitHub Secrets for CI/CD

## 🔄 Development Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### Commit Messages
Follow conventional commits:
```
feat: add new authentication flow
fix: resolve database connection issue
docs: update API documentation
refactor: simplify worker logic
```

### Pull Request Process

1. Ensure all CI checks pass
2. Update documentation if needed
3. Add tests for new features
4. Request review from maintainers
5. Squash and merge when approved

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@meauxos/package-name
```

## 📝 Code Style

- Use TypeScript where possible
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Keep functions small and focused

## 🚀 Deployment

Deployments are automated:
- **Push to `develop`** → Staging environment
- **Push to `main`** → Production environment

Never push directly to `main` - always use PRs.

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be respectful and constructive

---

*Thank you for contributing to MeauxOS! 🎉*
