# Nikshay Mitra Certificate Generator

A simple, professional web application for generating and downloading Nikshay Mitra certificates with automatic ID validation.

## 📋 Key Features

- **✅ NM ID Validation** - Automatically validates format: **M** + **11 digits**
- **🎯 Correct Text Placement** - Name and ID positioned exactly where you want them
- **👁️ Live Preview** - See exactly how certificate will look before downloading
- **📄 PDF Download** - High-quality PDF generation with crisp text
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Fast & Lightweight** - No bloat, just essential functionality

## 🛠️ Setup Instructions

### Step 1: Required Files
You need **4 files** in the same folder:

1. `index.html` - Main webpage (included)
2. `script.js` - JavaScript logic (included)
3. `certificate-template.jpg` - **Your certificate image** (you provide)
4. `README.md` - This documentation (included)

### Step 2: Add Your Certificate Template
1. Save your certificate image as **`certificate-template.jpg`**
2. Place it in the **same folder** as `index.html`
3. Recommended image size: **800×500 pixels** (or larger for better quality)

### Step 3: Deploy to GitHub Pages
1. Create a GitHub repository
2. Upload all 4 files to the main branch
3. Go to Repository Settings → Pages
4. Select "main" branch, click Save
5. Wait 1-2 minutes for deployment
6. Your site will be live at: `https://yourusername.github.io/repository-name/`

## 🚀 How to Use

### 1️⃣ Enter Participant Details
- **Full Name**: Enter the exact name as it should appear on the certificate
- **Nikshay Mitra ID**: Must follow format: **M12345678901**

### 2️⃣ Preview Certificate
- Click **"Preview Certificate"** button
- See exactly how the certificate will look
- Check positioning of name and ID

### 3️⃣ Download Certificate
- Click **"Download Certificate"** button
- PDF will download automatically
- Filename format: `NikshayMitra_Name_NMID.pdf`

## 🎯 Text Positioning

### Current Placement:
- **Name**: X=430px (shifted RIGHT), Y=285px (shifted UPWARD)
- **ID**: X=370px (shifted LEFT), Y=345px (shifted UPWARD)

### Position Adjustment:
If you need to adjust further, edit these values in `script.js`:

```javascript
// Name position adjustment
const namePosition = {
    x: 430,    // Horizontal position: Increase = Right, Decrease = Left
    y: 285     // Vertical position: Increase = Down, Decrease = Up
};

// ID position adjustment
const idPosition = {
    x: 370,    // Horizontal position: Increase = Right, Decrease = Left
    y: 345     // Vertical position: Increase = Down, Decrease = Up
};
