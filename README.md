# RYTM 🎵

<div align="center">
  <img src="public/assets/vinyl.png" alt="RYTM Logo" width="200" height="200" style="border-radius: 50%;">
  
  ### *FEEL THE BEAT*
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.11.1-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  **A modern, collaborative music streaming platform built with cutting-edge web technologies**
  
  [🚀 Demo](#demo) • [📦 Installation](#installation) • [🛠️ Features](#features) • [📖 Documentation](#documentation)
</div>

---

## ✨ Features

### 🎼 **Core Music Features**
- **Multi-Platform Streaming** - Support for YouTube, YouTube Music, and Spotify
- **Real-Time Audio Control** - Advanced playback controls with queue management
- **Community Voting** - Upvote/downvote system for collaborative playlists
- **Stream Management** - Create, manage, and share music streams

### 🎨 **User Experience**
- **Modern UI/UX** - Beautiful, responsive design with dark/light theme support
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Mobile Responsive** - Optimized for all device sizes
- **Intuitive Navigation** - Clean and accessible interface

### 🔐 **Authentication & Security**
- **Google OAuth Integration** - Secure sign-in with NextAuth.js
- **User Profiles** - Personalized user accounts and preferences
- **Protected Routes** - Role-based access control

### ⚡ **Performance & Architecture**
- **Server-Side Rendering** - Built with Next.js 15 for optimal performance
- **Database Integration** - PostgreSQL with Prisma ORM
- **Type Safety** - Full TypeScript implementation
- **Modern Bundling** - Optimized build with Next.js

---

## 🏗️ Tech Stack

<table>
<tr>
<td>

**Frontend**
- ⚛️ React 19
- 🚀 Next.js 15.2.2
- 📘 TypeScript 5
- 🎨 TailwindCSS 4.1.11
- ✨ Framer Motion
- 🧩 Radix UI Components

</td>
<td>

**Backend**
- 🌐 Next.js API Routes
- 🗃️ Prisma ORM 6.11.1
- 🐘 PostgreSQL
- 🔒 NextAuth.js 4.24.11
- 📊 Zod Validation

</td>
</tr>
<tr>
<td>

**Media Integration**
- 🎵 YouTube Search API
- 🎶 YouTube SR
- 🎼 YTMusic API
- 🎧 Audio Controls

</td>
<td>

**Development**
- 📦 Bun Package Manager
- 🔧 ESLint Configuration
- 🚀 Hot Reload Development
- 📱 Responsive Design

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **PostgreSQL** database
- **Google OAuth** credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanay-277/rytm.git
   cd rytm
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rytm"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   ```bash
   bunx prisma migrate dev
   bunx prisma generate
   ```

5. **Start Development Server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 📊 Database Schema

```mermaid
erDiagram
    User {
        String id PK
        String email UK
        Provider provider
        String username UK
        String cover
        DateTime createdAt
        DateTime updatedAt
    }
    
    Stream {
        String id PK
        String title
        String thumbnail
        String cover
        StreamType type
        String url
        String extractedId
        Boolean active
        DateTime createdAt
        DateTime updatedAt
        String userId FK
    }
    
    UpVotes {
        String id PK
        String userId FK
        String streamId FK
    }
    
    User ||--o{ Stream : creates
    User ||--o{ UpVotes : votes
    Stream ||--o{ UpVotes : receives
```

---

## 🛠️ API Endpoints

### Streams
- `POST /api/streams` - Create a new stream
- `GET /api/streams` - Get all streams
- `POST /api/streams/upvotes` - Upvote a stream
- `POST /api/streams/downvotes` - Downvote a stream

### Authentication
- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/session` - Get current session

---

## 🎨 UI Components

RYTM uses a custom component library built on top of Radix UI:

- **Navigation**: Responsive appbar with mobile menu
- **Theme**: Dark/light mode toggle with smooth transitions
- **Media**: Audio controls and queue management
- **Forms**: Input validation with Zod schemas
- **Feedback**: Toast notifications and loading states

---

## 🚦 Project Structure

```
rytm/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API endpoints
│   ├── home/              # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── blocks/            # Feature components
│   └── ui/                # Base UI components
├── lib/                   # Utility libraries
├── prisma/                # Database schema & migrations
├── public/                # Static assets
└── types/                 # TypeScript definitions
```

---

## 🔧 Development

### Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

### Database Commands

```bash
bunx prisma studio        # Open Prisma Studio
bunx prisma migrate dev   # Run migrations
bunx prisma generate      # Generate Prisma client
bunx prisma db push       # Push schema changes
```

---

## 🌟 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support

- 📧 **Email**: support@rytm.app
- 💬 **Discord**: [Join our community](https://discord.gg/rytm)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Tanay-277/rytm/issues)

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework for production
- [Prisma](https://prisma.io/) - Next-generation ORM for Node.js
- [Radix UI](https://radix-ui.com/) - Low-level UI primitives
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://framer.com/motion/) - Production-ready motion library

---

<div align="center">
  <strong>Built with ❤️ by the RYTM Team</strong>
  
  ⭐ **Star us on GitHub if you like the project!** ⭐
</div>