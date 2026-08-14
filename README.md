# Nikshay Mitra Certificate Generator

A web application for downloading Nikshay Mitra certificates with automatic ID validation.

## Features

✅ **NM ID Validation** - Validates format: M + 11 digits  
✅ **Real-time Feedback** - Instant validation messages  
✅ **Certificate Preview** - See how certificate will look  
✅ **PDF Download** - High-quality PDF generation  
✅ **Responsive Design** - Works on all devices  

## Setup Instructions

### 1. Files Required
- `index.html` - Main webpage
- `script.js` - JavaScript logic
- `certificate-template.jpg` - Your certificate image
- `README.md` - This file

### 2. Add Certificate Template
1. Save your certificate image as `certificate-template.jpg`
2. Place it in the **same folder** as `index.html`
3. Recommended size: 800x500 pixels or larger

### 3. Deploy to GitHub Pages
1. Create a GitHub repository
2. Upload all 4 files
3. Go to Settings → Pages
4. Select "main" branch, click Save
5. Wait 2-3 minutes for deployment
6. Your site will be live at: `https://username.github.io/repo-name/`

## How to Use

1. **Enter Name**: Type participant's full name
2. **Enter NM ID**: Format must be M followed by 11 digits (e.g., M12345678901)
3. **Preview**: Click "Preview Certificate" button
4. **Download**: Click "Download Certificate" to get PDF

## NM ID Format

- **Length**: Exactly 12 characters
- **First Character**: Must be 'M'
- **Remaining 11**: Must be digits 0-9
- **Pattern**: M12345678901 ✓

## Troubleshooting

### Download button not active?
- Confirm name is entered
- Confirm NM ID follows the format
- Check that certificate-template.jpg exists

### Certificate image not showing?
- Ensure file is named exactly: `certificate-template.jpg`
- Place it in the same folder as index.html
- Check browser console (F12) for errors

### Text position wrong on certificate?
- Edit positioning in `script.js`
- Change these values:
  ```javascript
  ctx.fillText(name, canvas.width / 2, canvas.height * 0.55);
  ctx.fillText(`NM ID: ${id}`, canvas.width / 2, canvas.height * 0.72);
