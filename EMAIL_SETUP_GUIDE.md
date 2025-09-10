# 📧 FREE EMAIL SETUP GUIDE

## 🥇 **OPTION 1: Gmail (EASIEST & FREE)**

### **Step 1: Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Click **Security** → **2-Step Verification**
3. Follow the setup process

### **Step 2: Generate App Password**
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter name: "Study Platform"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **Step 3: Update Your .env File**
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Your app password (remove spaces)
```

---

## 🥈 **OPTION 2: Outlook/Hotmail (FREE)**

### **Step 1: Enable 2-Factor Authentication**
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Enable **Two-step verification**

### **Step 2: Generate App Password**
1. Go to **App passwords** section
2. Create new password for "Mail"
3. Copy the generated password

### **Step 3: Update Your .env File**
```bash
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
```

---

## 🥉 **OPTION 3: Custom SMTP (Any Email Provider)**

```bash
EMAIL_SERVICE=custom
EMAIL_USER=your-email@anydomain.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

---

## ⚠️ **IMPORTANT NOTES:**

1. **Never use your regular email password** - Always use App Passwords
2. **Keep your credentials secure** - Don't commit .env files to Git
3. **Test with your own email first** - Send emails to yourself initially
4. **Gmail has daily limits** - 500 emails/day for free accounts

---

## 🧪 **Testing Your Setup:**

1. Add your email credentials to `.env`
2. Restart your backend server
3. Try delivering materials to your own email
4. Check both inbox and spam folders

---

## 🆘 **Troubleshooting:**

**Error: "Invalid login"**
- Make sure 2FA is enabled
- Use App Password, not regular password
- Remove spaces from App Password

**Error: "Connection refused"**
- Check your internet connection
- Verify EMAIL_SERVICE is correct (gmail/outlook)
- Try restarting the server

**Emails going to spam**
- This is normal for development
- In production, use a custom domain
- Add SPF/DKIM records for better delivery
