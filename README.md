# Gmail Subscription Scanner

A modern web application that scans your Gmail inbox to identify recurring subscriptions and help you manage your digital spending.

## Features

- 🔍 **Smart Detection**: AI-powered scanning of Gmail for subscription services
- 💰 **Cost Analysis**: Clear breakdown of monthly and annual subscription costs
- 🔒 **Privacy First**: Secure OAuth authentication, no data storage
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎯 **Easy Management**: Direct links to unsubscribe from services

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Authentication**: Google OAuth 2.0
- **API**: Gmail API
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/stormsecure/gmail-subscription-scanner.git
   cd gmail-subscription-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Google OAuth credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized domains:
   - `http://localhost:5173` (development)
   - `https://stormsecure.github.io` (production)

## Deployment

### GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`

2. **Update OAuth settings**:
   - Add `https://stormsecure.github.io/gmail-subscription-scanner/auth/callback` to redirect URIs

3. **Deploy**:
   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

## How It Works

1. **Authentication**: Secure OAuth 2.0 flow with Google
2. **Email Scanning**: Uses Gmail API to search for subscription-related emails
3. **Pattern Recognition**: Identifies billing cycles, costs, and unsubscribe links
4. **Cost Calculation**: Normalizes all subscriptions to monthly costs
5. **Management**: Provides direct links to cancel subscriptions

## Privacy & Security

- **No Data Storage**: All processing happens in your browser
- **Read-Only Access**: Only reads emails, never sends or modifies
- **Secure Authentication**: Standard OAuth 2.0 flow
- **Local Processing**: Subscription analysis happens locally

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Create an [Issue](https://github.com/stormsecure/gmail-subscription-scanner/issues)
- Check existing [Discussions](https://github.com/stormsecure/gmail-subscription-scanner/discussions)

---

Built with ❤️ for better financial awareness and subscription management.