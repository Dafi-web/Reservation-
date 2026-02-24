# Ristorante Africa - Digital Menu & Reservation System

A full-featured digital menu and reservation system for Ristorante Africa, built with Next.js, TypeScript, and Tailwind CSS. This application supports multiple languages and provides a simple, intuitive interface for both customers and administrators.

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
   - Add your MongoDB connection string and other variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ADMIN_PASSWORD=your_secure_password_here
   
   # Twilio SMS Configuration (Optional - for SMS confirmations)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   # WhatsApp (Optional - admin gets new-reservation alerts on WhatsApp)
   TWILIO_WHATSAPP_NUMBER=+14155238886
   ADMIN_PHONE=+31686371240

   # Resend (Optional - admin email when a reservation is submitted)
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```
   - **Important**: 
     - Replace `MONGODB_URI` with your actual MongoDB connection string
     - Set `ADMIN_PASSWORD` to a secure password for admin access (default is `admin123` if not set)
     - **SMS Notifications**: To enable SMS confirmations when admin accepts reservations, add your Twilio credentials. SMS is optional - the app works without it.
- **Admin email**: When a customer submits a reservation, the admin can receive an email. Set `RESEND_API_KEY` in `.env.local`. Optional.
- **Admin WhatsApp**: The admin can receive new-reservation alerts on WhatsApp. Use the same Twilio account: enable [Twilio WhatsApp Sandbox](https://www.twilio.com/docs/whatsapp/sandbox), set `TWILIO_WHATSAPP_NUMBER` (e.g. sandbox number +14155238886) and `ADMIN_PHONE` (e.g. +31686371240). Optional.

   **Not getting admin notifications?** When a user makes a reservation, the server tries SMS, email, and WhatsApp. Check your **server logs** (terminal or hosting logs): you’ll see either `Admin SMS sent` / `Admin email sent` / `Admin WhatsApp sent` or a warning listing which env var is missing. Required for each:
   - **SMS**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (your Twilio phone number), and optionally `ADMIN_PHONE` (default +31686371240).
   - **Email**: `RESEND_API_KEY` (get one at [resend.com](https://resend.com)). Admin receives at ristoranteafrica88@gmail.com.
   - **WhatsApp**: Same Twilio SID/Token, plus `TWILIO_WHATSAPP_NUMBER` (e.g. +14155238886). Admin number is `ADMIN_PHONE`. On a Twilio trial, the admin number must join the WhatsApp sandbox first.

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

## SMS Notifications

The application supports SMS confirmations when reservations are accepted or rejected:

- **When Admin Accepts**: Customer receives a confirmation SMS with reservation details
- **When Admin Rejects**: Customer receives a notification SMS with rejection reason
- **Setup**: Configure Twilio credentials in `.env.local`:
  - Get your credentials from [Twilio Console](https://console.twilio.com/)
  - Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`
  - SMS is optional - the app works without Twilio configured

**Note**: Phone numbers should include country code (e.g., +1234567890)

## Security

- **Admin Authentication**: The admin panel is protected with password authentication
- Admin password is configured via `ADMIN_PASSWORD` environment variable
- Admin sessions are stored in browser sessionStorage (cleared when browser closes)
- Admin link only appears in navigation for authenticated users

## Future Enhancements

- Enhanced authentication system
- Email notifications (in addition to SMS)
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
