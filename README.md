<div align="center">

# 🏪 SocialSwap

**A modern marketplace for buying and selling social media accounts**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## ✨ Features

- **🔐 Secure Authentication** - Email/password auth with session management
- **📱 Multi-Platform Support** - Instagram, YouTube, TikTok, Twitter, Twitch
- **💬 Real-Time Messaging** - Chat between buyers and sellers
- **🖼️ Image Uploads** - Cloudinary integration for screenshots
- **🎨 Modern UI** - Neumorphic design with smooth animations
- **📊 Admin Dashboard** - Manage listings, users, and transactions
- **📱 Responsive** - Works on desktop and mobile

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Storage | Cloudinary |
| Animations | Framer Motion, Lenis |
| Icons | Lucide React |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/socialswap.git
   cd socialswap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Set up the database**
   
   Run the SQL files in your Supabase SQL Editor in this order:
   ```
   supabase/schema.sql
   supabase/messaging.sql
   supabase/orders.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel components
│   ├── layout/         # Navbar, MobileNav
│   ├── listings/       # ListingCard
│   ├── marketplace/    # FilterSidebar
│   └── ui/             # Reusable UI components
├── context/
│   ├── AuthContext.jsx # Authentication state
│   └── NotificationContext.jsx
├── pages/
│   ├── admin/          # Admin dashboard pages
│   ├── HomePage.jsx    # Landing page
│   ├── BrowseListingsPage.jsx
│   ├── ListingDetailPage.jsx
│   ├── CreateListingPage.jsx
│   ├── DashboardPage.jsx
│   ├── MessagesPage.jsx
│   └── AuthPage.jsx
├── services/
│   ├── listingsService.js
│   ├── messagesService.js
│   ├── profileService.js
│   ├── uploadService.js
│   └── paymentsService.js
└── lib/
    └── supabase.js     # Supabase client
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Email auth in Authentication settings
3. Run the schema SQL files
4. Enable Realtime for the `messages` table

### Cloudinary Setup

1. Create a Cloudinary account
2. Create an unsigned upload preset
3. Add preset name to environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Lucide](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for animations

---

<div align="center">

Made with ❤️ by [Harshit](https://github.com/harshit0x)

</div>