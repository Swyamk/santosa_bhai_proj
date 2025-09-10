# 🎓 Smart Study Material Access Platform

A modern, full-stack web application that revolutionizes how students access their study materials. Students can simply enter their Student ID or scan a QR code to instantly access their course materials, which can be delivered via email or WhatsApp for maximum convenience.

![Platform Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange) ![Email](https://img.shields.io/badge/Email-Resend%20%7C%20Gmail-blue) ![WhatsApp](https://img.shields.io/badge/WhatsApp-Multiple%20APIs-green)

## ✨ Key Features

### 🔍 **Smart Student Lookup**
- **ID-based Authentication**: Secure student verification via Student ID
- **QR Code Support**: Quick access with built-in QR scanner
- **Real-time Validation**: Instant feedback on ID verification
- **Auto-complete**: Smart suggestions for student lookup

### 📚 **Material Management**
- **Fuzzy Search**: Find materials with partial matches
- **Advanced Filtering**: Filter by course, type, and date
- **Secure Downloads**: Time-limited signed URLs (10-minute expiry)
- **Multiple Formats**: Support for PDFs, documents, videos, and more

### 📧 **Multi-Channel Delivery**
- **Email Options**: Resend, Gmail (Nodemailer), SendGrid
- **WhatsApp APIs**: Green API, Wati.io, Twilio
- **Beautiful Templates**: Professional HTML email designs
- **Smart Fallbacks**: Automatic service switching for reliability

### 🛡️ **Security & Performance**
- **Rate Limiting**: API protection against abuse
- **Firebase Security**: Enterprise-grade authentication
- **CORS Protection**: Cross-origin request security
- **Error Handling**: Graceful degradation with fallbacks

## 🚀 Technology Stack

### **Frontend** ![Next.js](https://img.shields.io/badge/-Next.js-black?logo=next.js)
- **Next.js 15** with TypeScript - Modern React framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form + Zod** - Type-safe form validation
- **Fuse.js** - Advanced fuzzy search capabilities
- **Lucide React** - Beautiful icon library

### **Backend** ![Node.js](https://img.shields.io/badge/-Node.js-green?logo=node.js)
- **Node.js + Express** - Robust server architecture
- **Firebase Admin SDK** - Server-side Firebase integration
- **Multiple Email Services** - Resend, Nodemailer, SendGrid
- **WhatsApp Integration** - Green API, Wati.io, Twilio
- **Rate Limiting** - Express-rate-limit for API protection

### **Database & Storage** ![Firebase](https://img.shields.io/badge/-Firebase-orange?logo=firebase)
- **Firestore** - NoSQL database for metadata
- **Firebase Storage** - Secure file storage with CDN
- **Seed Data** - Development mode fallback
- **Signed URLs** - Secure, time-limited file access

### **Email & Messaging Services**
| Service | Type | Cost | Monthly Limit | Best For |
|---------|------|------|---------------|-----------|
| **Resend** | Email | FREE | 3,000 emails | Modern apps |
| **Gmail + Nodemailer** | Email | FREE | 500 emails | Development |
| **SendGrid** | Email | PAID | 100 free | Enterprise |
| **Green API** | WhatsApp | $10/month | Unlimited | Small business |
| **Wati.io** | WhatsApp | $20/month | + Features | Business |
| **Twilio** | WhatsApp | Pay-per-msg | Enterprise | Large scale |

## 📁 Project Architecture

```
santosa_bhai_proj/
├── 📁 frontend/              # Next.js Application
│   ├── 📁 src/
│   │   ├── 📁 app/          # App Router (Next.js 15)
│   │   │   ├── page.tsx     # Landing page with ID input
│   │   │   ├── layout.tsx   # Global layout
│   │   │   └── results/     # Material search results
│   │   ├── 📁 components/   # Reusable React Components
│   │   │   ├── IDInput.tsx  # Student ID input with QR
│   │   │   ├── MaterialCard.tsx # Material display cards
│   │   │   └── DeliverModal.tsx # Email/WhatsApp delivery
│   │   └── 📁 lib/         # Utilities
│   │       ├── firebaseClient.js # Firebase client config
│   │       └── fuse.js     # Search configuration
│   ├── 📄 .env.local       # Frontend environment variables
│   └── 📄 package.json
│
├── 📁 backend/              # Express.js API Server
│   ├── 📄 server.js        # Main server file
│   ├── 📁 routes/          # API Routes
│   │   ├── lookup.js       # Student/material lookup
│   │   └── deliver.js      # Email/WhatsApp delivery
│   ├── 📁 lib/             # Service Libraries
│   │   ├── firebaseAdmin.js # Firebase Admin SDK
│   │   ├── nodemailerService.js # Gmail email service
│   │   ├── resendService.js # Resend email service
│   │   ├── whatsappService.js # WhatsApp APIs
│   │   └── signedUrl.js    # Secure file URLs
│   ├── 📁 seed/            # Development Data
│   │   └── seed.json       # Sample students & materials
│   ├── 📄 .env             # Backend environment variables
│   └── 📄 package.json
│
├── 📄 EMAIL_SETUP_GUIDE.md  # Step-by-step email setup
├── 📄 MESSAGING_ALTERNATIVES.md # Service comparison guide
├── 📄 firebase.json        # Firebase configuration
├── 📄 firestore.rules      # Database security rules
└── 📄 README.md            # This file
```
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
## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ ![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
- npm or yarn
- Git

### **⚡ Fast Setup (Development Mode)**

```bash
# 1. Clone the repository
git clone https://github.com/Swyamk/santosa_bhai_proj.git
cd santosa_bhai_proj

# 2. Setup Backend
cd backend
npm install
npm start  # Runs on http://localhost:3001

# 3. Setup Frontend (in new terminal)
cd ../frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

**🎉 That's it!** Your platform is now running with sample data and mock services.

### **🧪 Test Drive Your Platform**

1. **Open:** [http://localhost:3000](http://localhost:3000)
2. **Try Student IDs:** `S101`, `S102`, `S103`, `S104`
3. **Test Email:** Click "Send via Email" (development mode logs to console)
4. **Test WhatsApp:** Click "Send via WhatsApp" (development mode logs to console)

## 🔧 Production Configuration

### **📧 Email Service Setup (Choose One)**

#### **Option 1: Resend (Recommended)** 🥇
```bash
# 1. Sign up at https://resend.com
# 2. Get your API key
# 3. Update backend/.env:
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

#### **Option 2: Gmail (Free)** 🥈
```bash
# 1. Follow EMAIL_SETUP_GUIDE.md for Gmail App Password
# 2. Update backend/.env:
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

#### **Option 3: SendGrid** 🥉
```bash
# 1. Get SendGrid API key
# 2. Update backend/.env:
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### **📱 WhatsApp Service Setup (Choose One)**

#### **Option 1: Green API ($10/month)** 🥇
```bash
# Update backend/.env:
GREEN_API_ID_INSTANCE=your-instance-id
GREEN_API_TOKEN=your-api-token
```

#### **Option 2: Wati.io ($20/month)** 🥈
```bash
# Update backend/.env:
WATI_API_KEY=your-wati-api-key
WATI_BASE_URL=https://live-server-xxxxx.wati.io
```

#### **Option 3: Twilio** 🥉
```bash
# Update backend/.env:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### **🔥 Firebase Setup (Production)**

1. **Create Firebase Project:** [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Enable Firestore & Storage**
3. **Generate Service Account Key**
4. **Update backend/.env:**

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## 🎮 Usage Guide

### **👨‍🎓 For Students**

1. **Visit the Platform:** Your institution's URL
2. **Enter Student ID:** Type or scan QR code
3. **Browse Materials:** Search, filter by course/type
4. **Get Materials:** Choose email or WhatsApp delivery
5. **Download:** Use secure, time-limited links

### **👨‍💼 For Administrators**

1. **Upload to Firebase Storage:** Course materials
2. **Update Firestore:** Student and material metadata
3. **Monitor Usage:** Check backend logs
4. **Manage Services:** Configure email/WhatsApp providers

### **📊 Sample Data Structure**

#### **Students Collection (`/students/{studentId}`)**
```json
{
  "id": "S101",
  "name": "John Doe", 
  "email": "john.doe@university.edu",
  "course": "Computer Science",
  "year": 2024,
  "materials": ["M001", "M002", "M003"]
}
```

#### **Materials Collection (`/materials/{materialId}`)**
```json
{
  "id": "M001",
  "title": "Introduction to Programming",
  "type": "pdf",
  "course": "CS101",
  "size": "2.5 MB",
  "filePath": "materials/cs101/intro-programming.pdf",
  "uploadDate": "2024-01-15"
}
```

## 🧪 Testing & Development

### **🔍 Available Test Student IDs**
- **S101** - John Doe (Computer Science) - 3 materials
- **S102** - Jane Smith (Mathematics) - 2 materials  
- **S103** - Bob Johnson (Physics) - 4 materials
- **S104** - Alice Brown (Chemistry) - 2 materials

### **🛠️ Development Scripts**

```bash
# Backend testing
cd backend
npm test                    # Run tests
node test-messaging.js      # Test all messaging services
node test-resend.js        # Test Resend email specifically
node test-real-email.js    # Send real email to your address

# Frontend development
cd frontend
npm run dev                 # Development server
npm run build              # Production build
npm run lint               # Lint code
```

### **📡 API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/lookup` | Student/material lookup |
| `POST` | `/api/deliver` | Email/WhatsApp delivery |

#### **API Usage Examples**

```javascript
// Student lookup
POST /api/lookup
{
  "studentId": "S101"
}

// Material delivery
POST /api/deliver  
{
  "studentId": "S101",
  "materialIds": ["M001", "M002"],
  "method": "email",
  "contact": "student@example.com"
}
```

## 🚢 Deployment

### **📦 Build for Production**

```bash
# Backend (stays as Node.js)
cd backend
npm install --production

# Frontend (Next.js build)
cd frontend
npm run build
npm start
```

### **☁️ Deployment Options**

#### **Frontend (Next.js)**
- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Static hosting
- **Firebase Hosting** - Google's hosting service

#### **Backend (Express.js)**
- **Railway** - Simple Node.js hosting
- **Heroku** - Traditional PaaS
- **DigitalOcean** - VPS hosting
- **Google Cloud Run** - Serverless containers

### **🔧 Environment Variables for Production**

Make sure to set all required environment variables in your deployment platform.

## 🛡️ Security Features

### **🔐 Implemented Security**
- ✅ **Rate Limiting** - Prevents API abuse
- ✅ **CORS Protection** - Cross-origin request security
- ✅ **Input Validation** - Zod schema validation
- ✅ **Signed URLs** - Time-limited file access (10 minutes)
- ✅ **Firebase Security Rules** - Database access control
- ✅ **Environment Variables** - Sensitive data protection

### **🔒 Additional Recommendations**
- Use HTTPS in production
- Implement JWT authentication for admin features
- Add request logging and monitoring
- Regular security audits

## 📈 Performance & Monitoring

### **⚡ Performance Features**
- **Next.js 15 with Turbopack** - Faster builds and hot reload
- **Firebase CDN** - Global file distribution
- **Rate Limiting** - API protection and performance
- **Signed URLs** - Direct file access (bypasses server)

### **📊 Monitoring**
```bash
# Backend logs
npm start  # Check console for service status

# Health check endpoint
curl http://localhost:3001/health
```

## 🤝 Contributing

### **🔄 Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

### **📝 Coding Standards**
- TypeScript for frontend
- ESLint + Prettier for code formatting
- Conventional commits
- Component-based architecture

## 🆘 Troubleshooting

### **❌ Common Issues**

#### **Email not sending:**
- Check spam/junk folder
- Verify API keys in `.env`
- Check `EMAIL_SETUP_GUIDE.md`
- Test with `node test-resend.js`

#### **WhatsApp not working:**
- Verify API credentials
- Check phone number format (+1234567890)
- Review service documentation

#### **Firebase errors:**
- Verify service account key
- Check Firestore rules
- Ensure Storage permissions

#### **Frontend build errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors

### **🔧 Debug Commands**
```bash
# Check environment variables
cd backend && node -e "console.log(process.env)"

# Test services individually  
node test-messaging.js
node test-resend.js
node test-real-email.js

# Check API health
curl http://localhost:3001/health
```

## 📚 Documentation

- **[EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)** - Complete email service setup
- **[MESSAGING_ALTERNATIVES.md](./MESSAGING_ALTERNATIVES.md)** - WhatsApp and email alternatives
- **[Firebase Documentation](https://firebase.google.com/docs)** - Official Firebase docs
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js framework docs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

### **📞 Getting Help**
- 📧 **Email:** swyamk.facts@gmail.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/Swyamk/santosa_bhai_proj/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Swyamk/santosa_bhai_proj/discussions)

### **🌟 Credits**
- Built with ❤️ by [Swyamk](https://github.com/Swyamk)
- Powered by Next.js, Firebase, and Resend
- Icons by Lucide React

---

## 🎯 **Ready to Deploy?**

Your Smart Study Material Access Platform is production-ready! 🚀

**Quick deployment checklist:**
- ✅ Email service configured (Resend recommended)
- ✅ Firebase project setup (optional for development)
- ✅ Environment variables configured
- ✅ Both servers running successfully
- ✅ Tested with sample student IDs

**Start building the future of educational technology!** 🎓✨
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