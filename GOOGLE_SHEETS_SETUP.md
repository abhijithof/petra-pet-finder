# 📊 Google Sheets Integration Guide

## Overview
Send all Pet Finder requests and Waitlist signups directly to Google Sheets for easy tracking and management!

---

## 🚀 Quick Setup (15 minutes)

### **Step 1: Create Your Google Sheets**

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create 2 new sheets:**
   - Sheet 1: "Pet.Ra - Pet Finder Requests"
   - Sheet 2: "Pet.Ra - Waitlist Signups"

#### **Pet Finder Sheet Setup:**

Create these columns (Row 1):
```
A1: Timestamp
B1: Name
C1: P
D1: Phone
E1: City
F1: Pet Type
G1: Breed
H1: Age Range
I1: Budget
J1: Temperament
K1: Additional Notes
L1: Status
```

#### **Waitlist Sheet Setup:**

Create these columns (Row 1):
```
A1: Timestamp
B1: Name
C1: Email
D1: Phone
E1: Plan
F1: Status
```

---

### **Step 2: Create Google Apps Script**

#### **For Pet Finder Sheet:**

1. Open your "Pet Finder Requests" sheet
2. Click **Extensions** → **Apps Script**
3. Delete any existing code
4. Paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Get current timestamp in IST
    var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    // Append the data as a new row
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
      'New' // Status
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Click **Deploy** → **New deployment**
6. Click the gear icon ⚙️ → Select **Web app**
7. Settings:
   - Description: "Pet Finder API"
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy**
9. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...../exec`)
10. Click **Authorize access** and allow permissions

---

#### **For Waitlist Sheet:**

1. Open your "Waitlist Signups" sheet
2. Click **Extensions** → **Apps Script**
3. Delete any existing code
4. Paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Get current timestamp in IST
    var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    // Append the data as a new row
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.plan || '',
      'Pending' // Status
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Follow the same deployment steps as above
6. **Copy the Web App URL** for waitlist

---

### **Step 3: Add URLs to Environment Variables**

Create or update `.env.local` file:

```bash
# Existing Gmail settings
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# New Google Sheets URLs
GOOGLE_SHEET_PET_FINDER_URL=https://script.google.com/macros/s/YOUR_PET_FINDER_ID/exec
GOOGLE_SHEET_WAITLIST_URL=https://script.google.com/macros/s/YOUR_WAITLIST_ID/exec
```

**Important:** Replace the URLs with the ones you copied!

---

### **Step 4: Restart Your Dev Server**

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Testing

### **Test Pet Finder:**
1. Go to your website
2. Fill out the Pet Finder form
3. Submit
4. Check your "Pet Finder Requests" Google Sheet
5. You should see a new row with all the data!

### **Test Waitlist:**
1. Click any "Join Waitlist" button
2. Fill out the form
3. Submit
4. Check your "Waitlist Signups" Google Sheet
5. You should see a new row!

---

## 📊 Benefits

✅ **Real-time data**: See submissions instantly in Google Sheets
✅ **No database needed**: Google Sheets is your database
✅ **Easy to manage**: View, filter, sort, export as CSV/Excel
✅ **Team access**: Share sheets with team members
✅ **Free**: No costs for Google Apps Script
✅ **Automatic backups**: Google handles everything
✅ **Mobile access**: Check from anywhere via Google Sheets app

---

## 🎨 Sheet Organization Tips

### **Color Coding:**

**Status Column (Pet Finder):**
- 🟢 Green: "Contacted"
- 🟡 Yellow: "In Progress"
- 🔵 Blue: "Matched"
- ⚪ White: "New"

**Status Column (Waitlist):**
- 🟡 Yellow: "Pending"
- 🟢 Green: "Notified"
- 🔵 Blue: "Subscribed"

### **Filters:**
Add filters to Row 1 to sort by:
- Date (newest first)
- Pet Type
- Plan
- Status

### **Formulas:**
Add a summary row at the top:
```
Total Requests: =COUNTA(B:B)-1
This Week: =COUNTIF(A:A,">=TODAY()-7")
```

---

## 🔒 Security

✅ **Your data is safe:**
- Only you can see the Google Sheet
- Web App URL is secret (don't share publicly)
- All data transmitted over HTTPS
- No authentication required (public form endpoint)

---

## 🐛 Troubleshooting

### **"Permission denied" error:**
- Re-deploy the script
- Make sure "Who has access" is set to **Anyone**

### **Data not appearing:**
- Check the Web App URL in `.env.local` is correct
- Check browser console for errors
- Make sure the script is deployed (not just saved)

### **Wrong timestamp:**
- Scripts use your Google account timezone
- Update timezone in Google Sheets: File → Settings → Timezone

---

## 📱 Mobile Access

Download **Google Sheets app** to view submissions on the go:
- iOS: https://apps.apple.com/app/google-sheets/id842849113
- Android: https://play.google.com/store/apps/details?id=com.google.android.apps.docs.editors.sheets

---

## 🎯 Next Steps

### **Optional: Product Notifications**

Want to track product notification requests too?

1. Create a 3rd sheet: "Product Notifications"
2. Columns: `Timestamp | Email | Product Category | Status`
3. Create another Apps Script
4. Add `GOOGLE_SHEET_PRODUCT_URL` to `.env.local`
5. Update `/api/send-product-notify.ts` similarly

---

## 📧 Keep Email + Sheets

**Both work together!**
- ✅ Google Sheets = Your CRM/Database
- ✅ Emails = Instant notifications
- ✅ Best of both worlds!

Your current email notifications will continue working alongside Google Sheets integration.

---

## 🎉 You're All Set!

Now every form submission will:
1. ✅ Send email to you (existing feature)
2. ✅ Send confirmation email to customer (existing feature)  
3. ✅ Save to Google Sheet (new feature!)
4. ✅ Organized and ready to act on

Happy tracking! 📊🐾

