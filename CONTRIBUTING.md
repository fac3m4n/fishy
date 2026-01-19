# Contributing to Fishy

Thank you for your interest in contributing to Fishy! This document provides guidelines and instructions for contributing to this project.

## 🎯 Code of Conduct

Please be respectful and constructive in all interactions. We aim to foster an inclusive and welcoming community.

## 🚀 Getting Started

### Prerequisites
- Familiarity with Git and GitHub
- Basic understanding of TypeScript, React, and Next.js
- Bun installed locally (v1.0.0 or higher)

### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `bun install`
4. Set up environment variables (copy `.env.example` to `.env.local`)
5. Set up the database: `bun run db:generate && bun run db:migrate`
6. Start the development server: `bun run dev`

## 🔧 Development Workflow

### 1. Create a Branch
Create a feature branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
Follow the coding standards outlined in [AGENTS.md](AGENTS.md). Key points:
- Use TypeScript with explicit types
- Follow the existing project structure
- Write clear, documented code
- Ensure accessibility (ARIA attributes, semantic HTML)
- Handle errors gracefully

### 3. Test Your Changes
- Ensure the application builds: `bun run build`
- Run code quality checks: `bun run check`
- Test manually in the browser
- Add tests for new functionality (when test suite is available)

### 4. Format and Lint
Run the automated formatting and linting:
```bash
bun run fix
```

### 5. Commit Your Changes
Write clear, descriptive commit messages:
```
feat: add campaign scheduling feature
fix: resolve email template rendering issue
docs: update installation instructions
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub with:
- Clear description of changes
- Reference to any related issues
- Screenshots for UI changes (if applicable)

## 📝 Code Standards

### TypeScript
- Use explicit types for function parameters and return values
- Prefer `unknown` over `any` when type is genuinely unknown
- Use const assertions (`as const`) for immutable values
- Leverage TypeScript's type narrowing instead of type assertions

### React & Next.js
- Use function components over class components
- Call hooks at the top level only
- Use Server Components for async data fetching
- Follow the App Router conventions
- Use semantic HTML and proper ARIA attributes

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design
- Maintain accessibility standards

### Performance
- Avoid unnecessary re-renders
- Use proper image optimization (Next.js Image component)
- Implement code splitting where appropriate
- Optimize database queries

## 🐛 Reporting Issues

When reporting issues, please include:
1. Clear description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots (if applicable)
5. Environment details (OS, browser, Node.js version)

## 💡 Feature Requests

Feature requests are welcome! Please:
1. Check if the feature already exists or has been requested
2. Explain the problem the feature would solve
3. Describe your proposed solution
4. Include any relevant examples or references

## 🧪 Testing

While a comprehensive test suite is planned, please:
- Test your changes manually
- Ensure existing functionality still works
- Consider edge cases and error states
- Document any testing you've performed

## 📚 Documentation

Good documentation is crucial. When making changes:
- Update relevant documentation
- Add comments for complex logic
- Keep README.md up to date
- Document new environment variables

## 🔄 Review Process

1. Pull Requests will be reviewed by maintainers
2. Address any feedback or requested changes
3. Ensure all checks pass (linting, building, etc.)
4. Maintainers will merge when ready

## 🙏 Acknowledgments

Thank you for contributing to Fishy! Your efforts help make security awareness training more effective for organizations worldwide.

---

*Note: These guidelines are adapted from the project's existing standards in [AGENTS.md](AGENTS.md).*