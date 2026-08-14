// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const nameInput = document.getElementById('nameInput');
    const idInput = document.getElementById('idInput');
    const previewBtn = document.getElementById('previewBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const messageDiv = document.getElementById('message');
    const loadingDiv = document.getElementById('loading');
    const loadingText = document.getElementById('loadingText');
    const certificatePreview = document.getElementById('certificatePreview');
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

    // State variables
    let isNameValid = false;
    let isIdValid = false;
    let certificateImage = null;
    let isImageLoaded = false;

    // Initialize canvas size
    canvas.width = 400;
    canvas.height = 250;

    // Certificate template image URL
    // IMPORTANT: Replace this with your actual certificate template URL
    const certificateImageUrl = 'certificate-template.jpg';

    // Load certificate template image
    loadCertificateTemplate();

    /**
     * Validates Nikshay Mitra ID
     * Rules: 12 characters, starts with M, next 11 are digits
     */
    function validateNikshayMitraId(id) {
        // Check length
        if (id.length !== 12) {
            return false;
        }
        
        // Check first character is 'M'
        if (id.charAt(0).toUpperCase() !== 'M') {
            return false;
        }
        
        // Check next 11 characters are digits
        const digits = id.substring(1);
        return /^\d{11}$/.test(digits);
    }

    /**
     * Updates validation UI and state
     */
    function updateValidation() {
        const name = nameInput.value.trim();
        const id = idInput.value.trim();
        
        // Name validation
        isNameValid = name.length > 0 && name.length <= 50;
        
        if (name.length === 0) {
            nameInput.classList.remove('valid', 'invalid');
        } else if (isNameValid) {
            nameInput.classList.add('valid');
            nameInput.classList.remove('invalid');
        } else {
            nameInput.classList.add('invalid');
            nameInput.classList.remove('valid');
        }
        
        // ID validation
        isIdValid = validateNikshayMitraId(id);
        
        if (id.length === 0) {
            idInput.classList.remove('valid', 'invalid');
            messageDiv.textContent = '';
            messageDiv.className = '';
        } else if (isIdValid) {
            idInput.classList.add('valid');
            idInput.classList.remove('invalid');
            messageDiv.textContent = '✓ Valid NM ID';
            messageDiv.className = 'success';
        } else {
            idInput.classList.add('invalid');
            idInput.classList.remove('valid');
            messageDiv.textContent = 'Check the NM ID !';
            messageDiv.className = 'error';
        }
        
        // Enable/disable buttons
        downloadBtn.disabled = !(isNameValid && isIdValid && isImageLoaded);
        previewBtn.disabled = !(isNameValid && isIdValid && isImageLoaded);
    }

    /**
     * Loads certificate template image
     */
    function loadCertificateTemplate() {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            certificateImage = img;
            isImageLoaded = true;
            updateValidation();
            console.log('Certificate template loaded successfully');
        };
        img.onerror = function() {
            console.error('Failed to load certificate template');
            // If image fails, use a fallback template
            createFallbackTemplate();
            isImageLoaded = true;
            updateValidation();
        };
        img.src = certificateImageUrl;
    }

    /**
     * Creates a fallback certificate template
     */
    function createFallbackTemplate() {
        // Create a simple fallback template
        canvas.width = 400;
        canvas.height = 250;
        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = '#1a73e8';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Title
        ctx.fillStyle = '#1a73e8';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NIKSHAY MITRA', canvas.width / 2, 60);
        
        // Subtitle
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText('Certificate of Participation', canvas.width / 2, 90);
        
        certificateImage = canvas; // Use canvas as image for preview
    }

    /**
     * Generates certificate preview
     */
    function generatePreview() {
        if (!certificateImage || !isImageLoaded) {
            alert('Loading certificate template... Please wait.');
            return;
        }

        const name = nameInput.value.trim();
        const id = idInput.value.trim();
        
        // Clear placeholder
        certificatePreview.querySelector('.placeholder-text').style.display = 'none';
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw certificate template
        if (certificateImage instanceof Image) {
            // If it's an image, draw it
            ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);
        } else {
            // If fallback canvas, copy it
            ctx.drawImage(certificateImage, 0, 0);
        }
        
        // IMPORTANT: POSITIONING ADJUSTMENTS
        // These coordinates need to be adjusted based on your actual certificate template
        
        // Name position - adjust coordinates for your template
        ctx.fillStyle = '#000000'; // Black text
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        
        // Position name approximately at coordinates (center, 40% from top)
        const nameY = canvas.height * 0.45; // Adjust this value
        ctx.fillText(name, canvas.width / 2, nameY);
        
        // ID position - adjust coordinates for your template
        ctx.fillStyle = '#000000'; // Black text
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        
        // Position ID approximately at coordinates (center, 60% from top)
        const idY = canvas.height * 0.60; // Adjust this value
        ctx.fillText(`NM ID: ${id}`, canvas.width / 2, idY);
        
        // Make canvas visible
        canvas.style.display = 'block';
    }

    /**
     * Downloads certificate as PDF
     */
    function downloadCertificate() {
        if (!isNameValid || !isIdValid || !isImageLoaded) {
            alert('Please enter valid details first');
            return;
        }

        loadingText.textContent = 'Generating PDF Certificate...';
        loadingDiv.classList.add('show');

        // Create a temporary canvas for high-quality PDF generation
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Set higher resolution for PDF
        tempCanvas.width = 800; // Double resolution for better print quality
        tempCanvas.height = 500;
        
        // Draw certificate template on high-res canvas
        if (certificateImage instanceof Image) {
            tempCtx.drawImage(certificateImage, 0, 0, tempCanvas.width, tempCanvas.height);
        } else {
            // Scale fallback template
            tempCtx.fillStyle = '#f0f8ff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.strokeStyle = '#1a73e8';
            tempCtx.lineWidth = 6;
            tempCtx.strokeRect(20, 20, tempCanvas.width - 40, tempCanvas.height - 40);
            
            tempCtx.fillStyle = '#1a73e8';
            tempCtx.font = 'bold 44px Arial';
            tempCtx.textAlign = 'center';
            tempCtx.fillText('NIKSHAY MITRA', tempCanvas.width / 2, 120);
            
            tempCtx.fillStyle = '#333';
            tempCtx.font = '32px Arial';
            tempCtx.fillText('Certificate of Participation', tempCanvas.width / 2, 180);
        }
        
        const name = nameInput.value.trim();
        const id = idInput.value.trim();
        
        // Add name and ID with adjusted positions
        tempCtx.fillStyle = '#000000';
        tempCtx.font = 'bold 36px Arial';
        tempCtx.textAlign = 'center';
        
        // Position name - adjust for high-res canvas
        const nameY = tempCanvas.height * 0.45;
        tempCtx.fillText(name, tempCanvas.width / 2, nameY);
        
        tempCtx.fillStyle = '#000000';
        tempCtx.font = '32px Arial';
        
        // Position ID - adjust for high-res canvas
        const idY = tempCanvas.height * 0.60;
        tempCtx.fillText(`NM ID: ${id}`, tempCanvas.width / 2, idY);
        
        // Generate PDF after a short delay to ensure canvas is ready
        setTimeout(() => {
            // Convert canvas to image data
            const imgData = tempCanvas.toDataURL('image/jpeg', \(-1.0));
            
            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            // Calculate dimensions for A4 landscape
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Add certificate image to PDF with proper margins
            const margin = 10;
            const imgWidth = pdfWidth - (margin * 2);
            const imgHeight = tempCanvas.height * (imgWidth / tempCanvas.width);
            
            pdf.addImage(imgData, 'JPEG', margin, (pdfHeight - imgHeight) / 2, imgWidth, imgHeight);
            
            // Generate filename
            const fileName = `NikshayMitra_Certificate_${name.replace(/\s+/g, '_')}_${id}.pdf`;
            
            // Download PDF
            pdf.save(fileName);
            
            // Hide loading
            loadingDiv.classList.remove('show');
            
            // Show success message
            alert(`Certificate downloaded successfully!\nFilename: ${fileName}`);
        }, 500);
    }

    /**
     * Real-time ID formatting
     */
    function formatIdInput() {
        let value = idInput.value.trim().toUpperCase();
        
        // Remove any non-alphanumeric characters
        value = value.replace(/[^A-Z0-9]/g, '');
        
        // Ensure first character is M
        if (value.length > 0 && value.charAt(0) !== 'M') {
            value = 'M' + value.substring(1);
        }
        
        // Limit to 12 characters
        if (value.length > 12) {
            value = value.substring(0, 12);
        }
        
        idInput.value = value;
        updateValidation();
    }

    // Event Listeners
    nameInput.addEventListener('input', updateValidation);
    idInput.addEventListener('input', formatIdInput);
    
    previewBtn.addEventListener('click', function() {
        generatePreview();
    });
    
    downloadBtn.addEventListener('click', function() {
        downloadCertificate();
    });

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        // Enter key to preview
        if (e.key === 'Enter' && !downloadBtn.disabled && document.activeElement !== idInput) {
            previewBtn.click();
        }
    });

    // Initial validation check
    updateValidation();

    // Test with valid ID
    console.log('Test validation results:');
    console.log('M12345678901 =>', validateNikshayMitraId('M12345678901'));
    console.log('M98765432109 =>', validateNikshayMitraId('M98765432109'));
    console.log('A12345678901 =>', validateNikshayMitraId('A12345678901'));
    console.log('M12345 =>', validateNikshayMitraId('M12345'));
    console.log('M12AB3456789 =>', validateNikshayMitraId('M12AB3456789'));
});
