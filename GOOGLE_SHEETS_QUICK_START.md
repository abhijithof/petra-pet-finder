# 🚀 Google Sheets Integration - Quick Start

## ✅ Code is Ready!

Your API routes are now updated to send data to Google Sheets automatically!

---

## 📋 What You Need to Do (3 Steps)

### **Step 1: Create Google Sheets (5 minutes)**

#### **Pet Finder Sheet:**
1. Create a new Google Sheet: "Pet.Ra - Pet Finder Requests"
2. Add these column headers in Row 1:
   ```
   Timestamp | Name | Email | Phone | City | Pet Type | Breed | Age Range | Budget | Temperament | Notes | Status
   ```

#### **Waitlist Sheet:**
1. Create another Google Sheet: "Pet.Ra - Waitlist Signups"
2. Add these column headers in Row 1:
   ```
   Timestamp | Name | Email | Phone | Plan | Status
   ```

---

### **Step 2: Set Up Google Apps Scripts (5 minutes each)**

#### **For Pet Finder Sheet:**

1. Open your Pet Finder sheet
2. **Extensions** → **Apps Script**
3. Delete any existing code
4. **Copy-paste this code:**

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.city || '',
      data.petType || '',
      data.breed || '',
      data.ageRange || '',
      data.budget || '',
      data.temperament ? data.temperament.join(', ') : '',
      data.notes || '',
      'New'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Click **Deploy** → **New deployment**
6. Click gear icon ⚙️ → Select **Web app**
7. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy**
9. **📋 COPY THE WEB APP URL** (it's long, starts with `https://script.google.com/...`)
10. Click **Authorize** when prompted

---

#### **For Waitlist Sheet:**

1. Open your Waitlist sheet
2. **Extensions** → **Apps Script**
3. Delete any existing code
4. **Copy-paste this code:**

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.plan || '',
      'Pending'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Follow the same deployment steps as above
6. **📋 COPY THIS WEB APP URL TOO**

---

### **Step 3: Add URLs to Your Environment File (2 minutes)**

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add these lines:

```bash
# Existing Gmail settings (keep these)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# New: Add these Google Sheets URLs
GOOGLE_SHEET_PET_FINDER_URL=PASTE_YOUR_PET_FINDER_URL_HERE
GOOGLE_SHEET_WAITLIST_URL=PASTE_YOUR_WAITLIST_URL_HERE
```

3. Replace `PASTE_YOUR_...` with the actual URLs you copied
4. Save the file
5. **Restart your dev server:**
   ```bash
   # Stop it (Ctrl+C) then:
   npm run dev
   ```

---

## ✅ That's It!

Now whenever someone:
- ✅ **Submits Pet Finder form** → Goes to both email AND Google Sheets
- ✅ **Joins waitlist** → Goes to both email AND Google Sheets

---

## 🧪 Test It Now!

1. Go to your website
2. Fill out the Pet Finder form
3. Submit
4. **Check 3 places:**
   - Your Gmail (admin email)
   - Customer's email (confirmation)
   - **Your Google Sheet** (new row should appear!)

---

## 📊 Benefits

✅ **Real-time tracking** - See submissions instantly  
✅ **Easy management** - Filter, sort, export  
✅ **Team access** - Share sheet with your team  
✅ **No database needed** - Google Sheets IS your database  
✅ **Free forever** - No costs  
✅ **Mobile access** - Check from anywhere  

---

## 🎨 Pro Tips

### **Color Code Your Statuses:**

**Pet Finder:**
- 🟢 Green = "Contacted"
- 🟡 Yellow = "In Progress"  
- 🔵 Blue = "Matched"
- ⚪ White = "New"

**Waitlist:**
- 🟡 Yellow = "Pending"
- 🟢 Green = "Notified"
- 🔵 Blue = "Subscribed"

### **Add Filters:**
Click the filter icon on Row 1 to sort by date, pet type, plan, etc.

### **Download Data:**
File → Download → CSV or Excel whenever you need backups

---

## ❌ If It's Not Working

### **Check 1: Environment Variables**
```bash
# Visit this URL while your dev server is running:
http://localhost:3000/api/test-env
```
Should show `GOOGLE_SHEET_PET_FINDER_URL: true`

### **Check 2: Script Deployment**
- Make sure you clicked **Deploy** (not just Save)
- "Who has access" must be **Anyone**
- Try re-deploying if needed

### **Check 3: Browser Console**
- Open browser DevTools (F12)
- Submit a form
- Look for any error messages in Console tab

---

## 📱 Access on Mobile

Download **Google Sheets app**:
- **iOS**: https://apps.apple.com/app/google-sheets/id842849113  
- **Android**: https://play.google.com/store/apps/details?id=com.google.android.apps.docs.editors.sheets

View your submissions anywhere! 📊

---

## 🎉 You're Done!

Your forms now auto-populate Google Sheets while still sending emails. Best of both worlds! 🚀

**Questions?** Check the full guide: `GOOGLE_SHEETS_SETUP.md`

