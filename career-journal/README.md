# Career Journal - AI-Powered Career Growth Platform

A minimal, black-and-white career journaling web application that helps professionals track daily achievements and transform them into compelling career stories using AI.

![Career Journal](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?style=flat-square&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)

## ✨ Features

### 🔐 **Authentication & User Management**
- Google OAuth and Magic Link email authentication via NextAuth
- Secure user profiles with career goals and role tracking
- Protected routes and session management

### 📝 **Daily Journaling**
- Intuitive journal entry form with auto-save functionality
- Tag-based categorization (Research, Design, Leadership, etc.)
- Rich text support with search and filtering capabilities
- Mobile-first responsive design

### 🤖 **AI-Powered Analysis**
- OpenAI GPT-4o integration for achievement extraction
- Automatic STAR-format story generation
- Skills identification and impact quantification
- Smart career insights and growth recommendations

### 🏆 **Achievement Management**
- Visual achievement cards with detailed breakdowns
- Bulk selection tools for resume building
- Skills-based filtering and search
- Achievement timeline and progress tracking

### 📊 **Dashboard & Analytics**
- Real-time career progress overview
- Weekly activity tracking
- Achievement statistics and insights
- Quick action buttons for seamless navigation

### 📄 **Resume Generation**
- ATS-friendly bullet point generation
- Selective achievement export
- PDF download functionality
- Industry best practices integration

### 🎨 **Design & UX**
- Minimalist Apple/OpenAI-inspired dark theme
- Smooth Framer Motion animations
- Siri-like AI processing visualization
- Mobile-optimized responsive layout

## 🛠 Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### **Backend & Database**
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Reliable relational database
- **Prisma ORM** - Type-safe database access
- **NextAuth.js** - Complete authentication solution

### **AI & Integrations**
- **OpenAI API** - GPT-4o for content analysis
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- OpenAI API key
- Google OAuth credentials (optional)

### 1. Clone & Install

```bash
git clone <repository-url>
cd career-journal
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/career_journal_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI Integration
OPENAI_API_KEY="your-openai-api-key"

# Email Provider (Optional)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@yourdomain.com"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed with sample data
npx prisma db seed
```

### 4. Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📋 Detailed Setup Guide

### Database Configuration

1. **Install PostgreSQL**
   ```bash
   # macOS (Homebrew)
   brew install postgresql@15
   brew services start postgresql@15
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE career_journal_db;
   CREATE USER career_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE career_journal_db TO career_user;
   ```

3. **Update Connection String**
   ```env
   DATABASE_URL="postgresql://career_user:secure_password@localhost:5432/career_journal_db"
   ```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### OpenAI API Configuration

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate API key
3. Add billing information for API usage
4. Set usage limits and monitoring

## 🏗 Project Structure

```
career-journal/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── auth/          # NextAuth routes
│   │   │   ├── journal/       # Journal CRUD operations
│   │   │   └── achievements/  # Achievement management
│   │   ├── dashboard/         # Dashboard page
│   │   ├── journal/           # Journal interface
│   │   ├── achievements/      # Achievement management
│   │   ├── resume/            # Resume builder
│   │   └── auth/              # Authentication pages
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   ├── forms/             # Form components
│   │   └── dashboard/         # Dashboard-specific components
│   └── lib/                   # Utility functions
│       ├── auth.ts            # NextAuth configuration
│       ├── prisma.ts          # Database client
│       └── openai.ts          # OpenAI integration
├── prisma/
│   └── schema.prisma          # Database schema
├── tailwind.config.js         # Tailwind configuration
└── package.json
```

## 🎯 Usage Guide

### Daily Workflow

1. **Write Journal Entries**
   - Navigate to Journal page
   - Click "New Entry"
   - Write about your daily accomplishments
   - Add relevant tags (Research, Leadership, etc.)
   - Save entry (auto-saves every 5 seconds)

2. **AI Analysis**
   - Click "AI Analyze" on any entry
   - Wait for Siri-like animation to complete
   - Review extracted achievements
   - Edit or approve AI-generated content

3. **Manage Achievements**
   - Visit Achievements page
   - Filter by skills, selection status
   - Select achievements for resume
   - Use bulk actions for efficiency

4. **Build Resume**
   - Go to Resume Builder
   - Review selected achievements
   - Generate ATS-friendly bullets
   - Download formatted content

### Advanced Features

#### Custom Tags
- Add industry-specific tags
- Create personal categorization system
- Filter entries by custom criteria

#### STAR Format Analysis
- AI automatically structures achievements using Situation, Task, Action, Result format
- Perfect for behavioral interview preparation
- Quantifies impact where possible

#### Skills Tracking
- Automatic skill extraction from entries
- Skills-based filtering and search
- Career development insights

## 🚀 Deployment

### Vercel (Recommended)

1. **Prepare for Deployment**
   ```bash
   npm run build
   npm run start # Test production build locally
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Update `NEXTAUTH_URL` to production domain
   - Ensure database is accessible from Vercel

### Alternative Platforms

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set run command: `npm start`

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Database Operations

```bash
# Reset database
npx prisma migrate reset

# View data in Prisma Studio
npx prisma studio

# Generate new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy
```

### Troubleshooting

#### Common Issues

1. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check connection string format
   - Ensure database exists and user has permissions

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check Google OAuth redirect URIs
   - Ensure `NEXTAUTH_URL` matches current domain

3. **OpenAI API Errors**
   - Check API key validity and billing
   - Monitor usage limits
   - Verify network connectivity

#### Development Tips

- Use `console.log` in API routes for debugging
- Check browser Network tab for API call details
- Use Prisma Studio for database inspection
- Test authentication flows in incognito mode

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write descriptive commit messages
- Test authentication flows thoroughly
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for utility-first styling
- **OpenAI** for powerful AI capabilities
- **Prisma** for excellent ORM experience
- **Vercel** for seamless deployment

## 📞 Support

For questions, issues, or contributions:

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/career-journal/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/career-journal/discussions)
- 📧 **Email**: support@careerjournal.com

---

**Built with ❤️ for career growth and professional development.**