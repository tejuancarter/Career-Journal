# Career Journal - Complete Setup Guide

This guide provides detailed instructions for setting up the Career Journal application from scratch.

## 🎯 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/)
- **Google Cloud Account** (optional) - [Sign up](https://cloud.google.com/)

## 📋 Step-by-Step Setup

### 1. Project Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd career-journal

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 2. Database Configuration

#### Option A: Local PostgreSQL

**Install PostgreSQL:**

```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows (using installer from postgresql.org)
# Follow the installer wizard
```

**Create Database and User:**

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE career_journal_db;
CREATE USER career_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE career_journal_db TO career_user;

# Exit PostgreSQL
\q
```

**Test Connection:**

```bash
psql -U career_user -d career_journal_db -h localhost
```

#### Option B: Cloud Database (Recommended for Production)

**Railway (Free Tier Available):**
1. Go to [Railway](https://railway.app/)
2. Sign up and create new project
3. Add PostgreSQL service
4. Copy connection string from dashboard

**Supabase (Free Tier Available):**
1. Go to [Supabase](https://supabase.com/)
2. Create new project
3. Go to Settings > Database
4. Copy connection string

**PlanetScale (Free Tier Available):**
1. Go to [PlanetScale](https://planetscale.com/)
2. Create new database
3. Create connection string

### 3. Environment Configuration

**Copy Environment Template:**
```bash
cp .env.example .env.local
```

**Configure Environment Variables:**

```env
# Database Configuration
DATABASE_URL="postgresql://career_user:your_secure_password@localhost:5432/career_journal_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret-key-32-chars-min"

# OpenAI Configuration (Required)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Google OAuth (Optional but Recommended)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret"

# Email Configuration (Optional)
EMAIL_SERVER="smtp://username:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4. OpenAI API Setup

1. **Create OpenAI Account:**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in
   - Verify your phone number

2. **Generate API Key:**
   - Go to [API Keys](https://platform.openai.com/account/api-keys)
   - Click "Create new secret key"
   - Copy and save the key securely
   - Add to `.env.local` as `OPENAI_API_KEY`

3. **Add Billing Information:**
   - Go to [Billing](https://platform.openai.com/account/billing)
   - Add payment method
   - Set usage limits (recommended: $10-20/month for development)

4. **Test API Access:**
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

### 5. Google OAuth Setup (Recommended)

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project"
   - Enter project name: "Career Journal"
   - Click "Create"

2. **Enable APIs:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" for user type
   - Fill in required fields:
     - App name: "Career Journal"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in development

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Career Journal"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Click "Create"
   - Copy Client ID and Client Secret to `.env.local`

### 6. Database Migration

**Initialize Prisma:**
```bash
# Generate Prisma client
npx prisma generate

# Run initial migration
npx prisma migrate dev --name init

# Verify migration
npx prisma studio
```

**Troubleshooting Migrations:**
```bash
# Reset database (careful - deletes all data!)
npx prisma migrate reset

# Force push schema changes
npx prisma db push

# Resolve migration conflicts
npx prisma migrate resolve --applied "migration-name"
```

### 7. NextAuth Secret Generation

**Generate Secure Secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using online generator (not recommended for production)
# Visit: https://generate-secret.vercel.app/32
```

### 8. Start Development Server

```bash
# Start the development server
npm run dev

# Open browser
open http://localhost:3000
```

## 🔧 Configuration Options

### Email Provider Setup

**Gmail SMTP:**
```env
EMAIL_SERVER="smtp://youremail@gmail.com:yourapppassword@smtp.gmail.com:587"
EMAIL_FROM="youremail@gmail.com"
```

**SendGrid:**
```env
EMAIL_SERVER="smtp://apikey:your-sendgrid-api-key@smtp.sendgrid.net:587"
EMAIL_FROM="noreply@yourdomain.com"
```

**Mailgun:**
```env
EMAIL_SERVER="smtp://postmaster@mg.yourdomain.com:your-mailgun-password@smtp.mailgun.org:587"
EMAIL_FROM="noreply@yourdomain.com"
```

### Advanced Database Configuration

**Connection Pooling:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=20&pool_timeout=20"
```

**SSL Configuration:**
```env
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"
```

## 🚀 Production Deployment

### Vercel Deployment

1. **Prepare for Deployment:**
   ```bash
   # Test production build
   npm run build
   npm run start
   ```

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and deploy
   vercel login
   vercel --prod
   ```

3. **Configure Production Environment:**
   - Add all environment variables in Vercel dashboard
   - Update `NEXTAUTH_URL` to production domain
   - Update Google OAuth redirect URIs

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Deploy
railway up
```

### Docker Deployment

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/career_journal
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=career_journal
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🛠 Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

### Git Hooks Setup

```bash
# Install husky
npm install --save-dev husky

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

## 🔍 Verification Checklist

After setup, verify everything works:

- [ ] Application starts without errors (`npm run dev`)
- [ ] Database connection is successful (check Prisma Studio)
- [ ] Authentication works (sign in with Google/email)
- [ ] Journal entries can be created and saved
- [ ] AI analysis works (requires OpenAI API key)
- [ ] Achievements are extracted and displayed
- [ ] Resume generation functions properly

## 🐛 Common Issues & Solutions

### Database Issues

**Connection Error:**
```bash
Error: P1001: Can't reach database server
```
**Solution:** Check if PostgreSQL is running and connection string is correct.

**Migration Failed:**
```bash
Error: P3009: migrate found failed migration
```
**Solution:** Reset migrations or resolve conflicts manually.

### Authentication Issues

**Invalid Redirect URI:**
```bash
Error: redirect_uri_mismatch
```
**Solution:** Add correct redirect URI in Google Cloud Console.

**Session Not Persisting:**
```bash
Error: Session callback error
```
**Solution:** Check `NEXTAUTH_SECRET` and database connection.

### OpenAI API Issues

**Invalid API Key:**
```bash
Error: Incorrect API key provided
```
**Solution:** Verify API key is correct and has sufficient credits.

**Rate Limit Exceeded:**
```bash
Error: Rate limit reached
```
**Solution:** Implement request throttling or upgrade OpenAI plan.

## 📞 Getting Help

If you encounter issues:

1. Check the [Troubleshooting Section](#-common-issues--solutions)
2. Search [GitHub Issues](https://github.com/yourusername/career-journal/issues)
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - System information (OS, Node version, etc.)
   - Relevant log output

## 🎉 Next Steps

Once setup is complete:

1. Customize the application for your needs
2. Add your own branding and styling
3. Deploy to production
4. Set up monitoring and analytics
5. Contribute back to the project!

---

**Happy journaling! 🚀**