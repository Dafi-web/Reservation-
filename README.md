# Africa Restorante - Digital Menu & Reservation System

A full-featured digital menu and reservation system for Africa Restorante, built with Next.js, TypeScript, and Tailwind CSS. This application supports multiple languages and provides a simple, intuitive interface for both customers and administrators.

## Features

- 📱 **Digital Menu Display**: Browse food, drinks, and beverages with detailed information
- 📅 **Reservation System**: Easy-to-use booking form for table reservations
- 👨‍💼 **Admin Panel**: View and manage all reservations
- 🌍 **Internationalization**: Support for 6 languages (English, Spanish, French, German, Italian, Arabic)
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast & Simple**: Built with Next.js for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB database (local or cloud like MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ADMIN_PASSWORD=your_secure_password_here
   ```
   - **Important**: 
     - Replace `MONGODB_URI` with your actual MongoDB connection string
     - Set `ADMIN_PASSWORD` to a secure password for admin access (default is `admin123` if not set)

3. Run the development server:
```bash
npm run dev
```

4. Seed the database with initial menu items (first time only):
   - Once the server is running, open a new terminal and run:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
   - Or visit `http://localhost:3000/api/seed` in your browser (though POST is recommended)
   - This will populate the database with sample menu items

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
menu/
├── app/
│   ├── [locale]/          # Localized pages
│   │   ├── page.tsx       # Menu display page
│   │   ├── reservations/  # Reservation form
│   │   └── admin/         # Admin panel
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Data models and utilities
├── messages/              # Translation files
└── i18n/                  # Internationalization config
```

## Usage

### For Customers

1. **View Menu**: Navigate to the home page to see all menu items organized by category
2. **Make Reservation**: Click "Book a Table" to fill out the reservation form
3. **Change Language**: Use the language selector in the navigation bar

### For Administrators

1. **Access Admin Panel**: 
   - Navigate to the Admin page (link appears in navigation after login)
   - Enter the admin password (set in `ADMIN_PASSWORD` environment variable)
   - Default password is `admin123` if not configured
2. **View Reservations**: See all reservations with detailed information
3. **Filter Reservations**: Use the filter buttons to view all, upcoming, or past reservations
4. **Manage Reservations**: 
   - Accept pending reservations
   - Reject reservations with a required reason
   - View rejection reasons for rejected reservations
5. **Logout**: Click the logout button to end your admin session

## Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Arabic (ar)

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **next-intl**: Internationalization library
- **date-fns**: Date formatting utilities
- **MongoDB**: NoSQL database with Mongoose ODM

## Data Storage

The application uses **MongoDB** for persistent data storage:
- Menu items are stored in the `menuitems` collection
- Reservations are stored in the `reservations` collection
- Data persists across server restarts

### Database Setup

1. Create a MongoDB database (local or MongoDB Atlas)
2. Add your connection string to `.env.local`
3. The application will automatically connect when you start the server
4. Run the seed endpoint to populate initial menu items

## Security

- **Admin Authentication**: The admin panel is protected with password authentication
- Admin password is configured via `ADMIN_PASSWORD` environment variable
- Admin sessions are stored in browser sessionStorage (cleared when browser closes)
- Admin link only appears in navigation for authenticated users

## Future Enhancements

- Enhanced authentication system
- Email notifications
- Menu item images
- Online ordering
- Payment integration
- Real-time reservation updates

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `ADMIN_PASSWORD`: Your admin password
4. Deploy!
5. Seed the database: `POST https://your-app.vercel.app/api/seed`

## License

MIT
