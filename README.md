# Smart Study Material Access Platform

A full-stack web application that allows students to access their study materials by entering their Student ID. Materials can be delivered via email or WhatsApp for convenient access.

## 🎯 Features

- **Student ID Lookup**: Enter Student ID to fetch assigned course materials
- **QR Code Support**: Scan QR codes for quick access
- **Material Search & Filter**: Fuzzy search and filter by course/type
- **Multiple Delivery Methods**: Email and WhatsApp delivery
- **Secure Downloads**: Temporary signed URLs with expiration
- **Admin Dashboard**: Upload and manage materials (coming soon)
- **Responsive Design**: Works on desktop and mobile

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Fuse.js** - Fuzzy search functionality
- **Lucide React** - Icon library

### Backend
- **Node.js + Express** - Server and API
- **Firebase Admin SDK** - Server-side Firebase integration
- **Firebase Storage** - File storage with signed URLs
- **Firestore** - NoSQL database
- **SendGrid** - Email delivery service
- **Twilio** - WhatsApp messaging
- **Rate Limiting** - API protection

### Database & Storage
- **Firestore** - Student and material metadata
- **Firebase Storage** - File storage
- **Seed Data** - Development fallback data

## 📁 Project Structure

```
santosa_bhai_proj/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utility functions
│   ├── .env.local           # Frontend environment variables
│   └── package.json
├── backend/                 # Express.js backend
│   ├── routes/              # API routes
│   ├── lib/                 # Utility modules
│   ├── seed/                # Sample data
│   ├── .env                 # Backend environment variables
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project (optional for development)
- SendGrid account (optional for email)
- Twilio account (optional for WhatsApp)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd santosa_bhai_proj
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3001
DEVELOPMENT_MODE=true

# Firebase Configuration (optional for development)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# SendGrid (optional)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Twilio (optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001

# Firebase Client Configuration (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Start the frontend server:
```bash
npm run dev
```

## 🎮 Usage

### Development Mode
The application works in development mode with seed data and mock services:

1. **Access the application**: http://localhost:3000
2. **Try sample Student IDs**: S101, S102, S103, S104
3. **Test features**: Search, filter, and delivery (mocked)

### Sample Student IDs for Testing
- **S101** - Aisha Khan (CS101, MA102)
- **S102** - Ravi Patel (CS101)
- **S103** - Priya Singh (MA102, PH101)
- **S104** - Arjun Sharma (CS101, PH101)

### API Endpoints

#### POST /api/lookup
Lookup student and their materials
```json
{
  "id": "S101"
}
```

#### POST /api/deliver
Deliver materials to student
```json
{
  "studentId": "S101",
  "materialIds": ["M1", "M2"],
  "method": "email",
  "contact": "student@example.com"
}
```

#### GET /health
Health check endpoint

## 🔧 Configuration

### Firebase Setup (Production)
1. Create a Firebase project
2. Enable Firestore and Storage
3. Create a service account and download the key
4. Set up Firestore security rules
5. Update environment variables

### SendGrid Setup (Email)
1. Create a SendGrid account
2. Get an API key
3. Verify sender identity
4. Update `SENDGRID_API_KEY` in backend `.env`

### Twilio Setup (WhatsApp)
1. Create a Twilio account
2. Set up WhatsApp sandbox
3. Get Account SID and Auth Token
4. Update Twilio variables in backend `.env`

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
# Deploy to your preferred platform
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:3001/health

# Student lookup
curl -X POST http://localhost:3001/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"id":"S101"}'

# Material delivery
curl -X POST http://localhost:3001/api/deliver \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":"S101",
    "materialIds":["M1"],
    "method":"email",
    "contact":"test@example.com"
  }'
```

## 📝 Features in Development

- [ ] Admin dashboard for material management
- [ ] Bulk material upload
- [ ] Analytics and download tracking
- [ ] Scheduled delivery system
- [ ] Mobile app (React Native)
- [ ] Integration with learning management systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 🔒 Security

- All file downloads use temporary signed URLs
- API endpoints have rate limiting
- Input validation on all forms
- Environment variables for sensitive data
- CORS configuration for API security