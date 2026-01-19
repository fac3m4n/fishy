# Fishy - Phishing Simulation & Security Awareness Platform

<div align="center">

![Fishy Security Operations Center](https://img.shields.io/badge/Platform-Security_Operations-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4)
![License](https://img.shields.io/badge/License-MIT-green)

**A modern, open-source platform for running phishing simulation campaigns to improve organizational security awareness**

</div>

<img width="1656" height="963" alt="Screenshot 2026-01-19 at 22 45 18" src="https://github.com/user-attachments/assets/a2e74d6c-3dec-48a3-9f33-ac3f0f8d87fe" />


## 🎯 Overview

Fishy is a comprehensive Security Operations Center (SOC) platform designed to help organizations test and improve their security posture through controlled phishing simulations. The platform enables security teams to create, manage, and analyze phishing campaigns while providing detailed analytics on employee awareness and vulnerability.

### Key Features

- **Campaign Management**: Create, schedule, and manage phishing simulation campaigns
- **Email Template Designer**: Build realistic phishing emails with a visual editor
- **Landing Page Builder**: Create credential capture pages for simulations
- **Target Management**: Import and organize recipient lists with role-based grouping
- **SMTP Configuration**: Flexible email delivery with custom sending profiles
- **Real-time Analytics**: Track opens, clicks, submissions, and reporting rates
- **Security Metrics Dashboard**: Monitor platform security and performance indicators
- **Role-based Access Control**: Secure multi-user environment with proper permissions

## 🚀 Quick Start

### Prerequisites

- **Bun** (v1.0.0 or higher) - Package manager and runtime
- **PostgreSQL** (v14 or higher) - Database
- **Node.js** (v18.17 or higher) - JavaScript runtime

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fishy.git
   cd fishy
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fishy"
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate database schema
   bun run db:generate

   # Apply migrations
   bun run db:migrate
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

Fishy is built with a modern, type-safe stack:

### Frontend
- **Next.js 16** (App Router) - React framework with server components
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Recharts** - Data visualization

### Backend
- **Drizzle ORM** - Type-safe database queries
- **Better Auth** - Authentication and session management
- **TanStack Query** - Server state management
- **Zod** - Schema validation
- **Nodemailer** - Email delivery

### Database
- **PostgreSQL** - Primary database
- **Drizzle Kit** - Database migrations and studio

### Development Tools
- **Biome** (via Ultracite) - Linting and formatting
- **TypeScript** - Type checking
- **Bun** - Package manager and runtime

## 📁 Project Structure

```
fishy/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (auth, webhooks)
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── campaigns/     # Campaign management
│   │   ├── groups/        # Target group management
│   │   ├── landing-pages/ # Landing page builder
│   │   ├── sending-profiles/ # Email configuration
│   │   └── templates/     # Email template designer
│   ├── login/            # Authentication pages
│   ├── p/                # Public phishing pages
│   ├── t/                # Tracking endpoints
│   └── layout.tsx        # Root layout with auth
├── actions/              # Server actions
│   ├── campaign.actions.ts
│   ├── email.actions.ts
│   ├── group.actions.ts
│   ├── landing-page.actions.ts
│   ├── sending-profile.actions.ts
│   └── template.actions.ts
├── components/           # React components
│   ├── forms/           # Reusable form components
│   ├── ui/              # shadcn/ui components
│   ├── app-sidebar.tsx  # Navigation sidebar
│   └── providers.tsx    # Context providers
├── db/                  # Database configuration
│   ├── index.ts        # Database connection
│   └── schema.ts       # Drizzle schema definitions
├── drizzle/            # Database migrations
├── hooks/              # Custom React hooks
│   ├── use-campaigns.ts
│   ├── use-groups.ts
│   ├── use-landing-pages.ts
│   ├── use-sending-profiles.ts
│   ├── use-templates.ts
│   └── use-email.ts
├── lib/                # Utilities and libraries
│   ├── auth.ts         # Authentication configuration
│   ├── fonts.ts        # Font definitions
│   └── utils.ts        # Utility functions
├── services/           # Business logic services
│   ├── campaign.service.ts
│   ├── email.service.ts
│   ├── group.service.ts
│   ├── landing-page.service.ts
│   ├── sending-profile.service.ts
│   └── template.service.ts
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

## 🗄️ Database Schema

The database is designed to track comprehensive phishing simulation data:

### Core Tables
- **users** & **sessions** - Authentication and user management
- **campaigns** - Phishing campaigns with status tracking
- **templates** - Email template designs
- **landing_pages** - Credential capture pages
- **groups** - Target recipient lists
- **sending_profiles** - SMTP configuration
- **events** - Campaign tracking (sent, opened, clicked, submitted, reported)

### Status Tracking
Campaigns support multiple statuses:
- `draft` - Campaign being prepared
- `scheduled` - Campaign scheduled for future
- `in_progress` - Campaign actively sending emails
- `completed` - Campaign finished
- `cancelled` - Campaign cancelled

## 🔧 Development

### Code Quality Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

#### Quick Commands
```bash
# Format code and fix linting issues
bun run fix

# Check for issues without fixing
bun run check

# Type checking
bun run type-check
```

#### Key Principles
- **Type Safety**: Use explicit types and avoid `any`
- **Accessibility**: Semantic HTML and ARIA attributes
- **Performance**: Optimized rendering and data fetching
- **Security**: Input validation and secure defaults
- **Maintainability**: Clear naming and focused functions

See [AGENTS.md](AGENTS.md) for detailed coding standards.

### Common Tasks

#### Database Operations
```bash
# Generate new migration
bun run db:generate

# Apply migrations
bun run db:migrate

# Open database studio
bun run db:studio
```

#### Running Tests
```bash
# Coming soon - test suite will be added
```

#### Building for Production
```bash
# Build the application
bun run build

# Start production server
bun run start
```

## 📊 Analytics & Reporting

Fishy provides comprehensive analytics for security teams:

### Campaign Metrics
- **Email Delivery Rates**: Track successful email delivery
- **Open Rates**: Monitor who opens phishing emails
- **Click Rates**: Measure link engagement
- **Submission Rates**: Track credential submissions
- **Reporting Rates**: Identify security-aware users who report phishing attempts

### Security Metrics Dashboard
- **Phishing Detection**: Platform detection capabilities
- **User Awareness**: Overall organizational awareness levels
- **System Security**: Platform security status
- **Data Protection**: Data handling and protection measures

## 🔒 Security Considerations

### Ethical Use
Fishy is designed for **authorized security awareness training only**. Always:
1. Obtain proper authorization before running simulations
2. Clearly communicate the educational purpose to participants
3. Provide immediate feedback and training after simulations
4. Never use for malicious purposes or unauthorized testing

### Platform Security
- Authentication with secure session management
- Role-based access control
- Input validation and sanitization
- Secure email sending with configurable SMTP
- Data encryption at rest and in transit

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run fix` to ensure code quality
5. Submit a pull request

### Code Standards
- Follow the Ultracite coding standards in [AGENTS.md](AGENTS.md)
- Write clear, documented code
- Include TypeScript types for all new code
- Add tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Database ORM with [Drizzle](https://orm.drizzle.team)
- Authentication with [Better Auth](https://better-auth.com)

## 📞 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check the documentation for common questions
- Join our community discussions

---

<div align="center">

**Fishy** - Making security awareness training effective and measurable

</div>
