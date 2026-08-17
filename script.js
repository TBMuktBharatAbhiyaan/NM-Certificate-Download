document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const elements = {
        nameInput: document.getElementById('nameInput'),
        idInput: document.getElementById('idInput'),
        previewBtn: document.getElementById('previewBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        validationMessage: document.getElementById('validationMessage'),
        canvas: document.getElementById('certificateCanvas'),
        previewPlaceholder: document.getElementById('previewPlaceholder')
    };
    
    const canvas = elements.canvas;
    const ctx = canvas.getContext('2d');
    
    // State variables
    let isNameValid = false;
    let isIdValid = false;
    let certificateImage = null;
    let isImageLoaded = false;
    
    // >>>>>> ADJUST THESE VALUES FOR TEXT POSITION <<<<<<
    // Canvas size: 800px × 500px
    // x: 0 = left, 800 = right
    // y: 0 = top, 500 = bottom
    const positions = {
        name: {
            x: 530,  // 530 = center horizontally
            y: 208   // 236 pixels from TOP
        },
        id: {
            x: 180,  // 272 = center horizontally
            y: 238   // 272 pixels from TOP
        }
    };
    
    // >>>>>> ADJUST THESE VALUES FOR FONT SIZE <<<<<<
    const fontSizes = {
        preview: {
            name: 20,
            id: 10
        },
        pdf: {
            name: 30,   // ×2 for high resolution
            id: 18      // ×2 for high resolution
        }
    };
    
    // Load certificate template
    function loadCertificateTemplate() {
        const img = new Image();
        img.onload = function() {
            certificateImage = img;
            isImageLoaded = true;
            updateValidation();
        };
        img.onerror = function() {
            console.warn('Certificate image not found');
            createFallbackTemplate();
            isImageLoaded = true;
            updateValidation();
        };
        img.src = 'certificate-template.jpg';
    }
    
    // Create fallback template
    function createFallbackTemplate() {
        canvas.width = 800;
        canvas.height = 500;
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Title
        ctx.fillStyle = '#b71c1c';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NIKSHAY MITRA', canvas.width / 2, 100);
        ctx.fillText('Certificate of Recognition', canvas.width / 2, 150);
        
        // WHERE TEXT WILL APPEAR
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.fillRect(positions.name.x - 200, positions.name.y - 20, 400, 40);
        ctx.fillRect(positions.id.x - 150, positions.id.y - 15, 300, 30);
        
        // Position markers
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(positions.name.x, positions.name.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(positions.id.x, positions.id.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Labels
        ctx.fillStyle = 'red';
        ctx.font = '12px Arial';
        ctx.fillText('Name goes here', positions.name.x, positions.name.y + 20);
        ctx.fillText('ID goes here', positions.id.x, positions.id.y + 20);
    }
    
   function validateNikshayMitraId(id) {
    // Must be M + exactly 11 digits
    if (!/^M\d{11}$/.test(id)) return false;
// Second character (after M) must be 2
    if (id[1] !== '2') return false;
    // No same digit repeated 4 or more times in a row
    if (/(\d)\1{3,}/.test(id)) return false;

    // No ascending sequence of 5 or more consecutive digits
    if (/01234|12345|23456|34567|45678|56789/.test(id)) return false;
 // No descending sequence of 5 or more consecutive digits
    if (/98765|87654|76543|65432|54321|43210/.test(id)) return false;
       // Among the 11 digits after M, there must be at least 4 different digits
const digitsPart = id.substring(1); // remove M
const uniqueDigits = new Set(digitsPart);
if (uniqueDigits.size < 4) return false;
    return true;
}
function validateName(name) {
    return /^[A-Z].{6,}$/.test(name.trim());
}

    
    // Update validation
    function updateValidation() {
        const name = elements.nameInput.value.trim();
        const id = elements.idInput.value.trim().toUpperCase();
        
        // Name validation
        isNameValid = validateName(name);
        elements.nameInput.classList.toggle('valid', isNameValid && name.length > 0);
        elements.nameInput.classList.toggle('invalid', !isNameValid && name.length > 0);
        // Name validation message
if (name.length > 0 && !isNameValid) {
    elements.nameInput.placeholder = 'Not found';
} else {
    elements.nameInput.placeholder = 'Enter name';
}

        // ID validation
        isIdValid = validateNikshayMitraId(id);
        elements.idInput.classList.toggle('valid', isIdValid && id.length > 0);
        elements.idInput.classList.toggle('invalid', !isIdValid && id.length > 0);
        
        // Validation message
        // Validation message
if (id.length > 0 && !isIdValid) {
    elements.validationMessage.textContent = 'X Invalid/Inactive NM ID';
    elements.validationMessage.className = 'error';
    elements.validationMessage.style.display = 'block';
} else {
    elements.validationMessage.style.display = 'none';
}

        
        // Update buttons
        const allValid = isNameValid && isIdValid && isImageLoaded;
        elements.downloadBtn.disabled = !allValid;
        elements.previewBtn.disabled = !allValid;
        
        // Auto-enable preview if all valid
        if (allValid) {
            drawPreview(name, id);
            canvas.style.display = 'block';
            elements.previewPlaceholder.style.display = 'none';
        } else {
            canvas.style.display = 'none';
            elements.previewPlaceholder.style.display = 'block';
        }
    }
    
    // Draw preview
    function drawPreview(name, id) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (certificateImage) {
            ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);
        } else {
            createFallbackTemplate();
        }
        
        // Draw name
        ctx.fillStyle = '#000000';
        ctx.font = `${fontSizes.preview.name}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(name.toUpperCase(), positions.name.x, positions.name.y);

        
        // Draw ID
        ctx.fillStyle = '#000000';
        ctx.font = `${fontSizes.preview.id}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(id, positions.id.x, positions.id.y);
    }
    
    // Generate PDF
    function generatePDF(name, id) {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            // High-res canvas for PDF
            const pdfCanvas = document.createElement('canvas');
            const pdfCtx = pdfCanvas.getContext('2d');
            pdfCanvas.width = 1584;  // Double resolution
            pdfCanvas.height = 990; // Double resolution
            
            // Draw background
            if (certificateImage) {
                pdfCtx.drawImage(certificateImage, 0, 0, pdfCanvas.width, pdfCanvas.height);
            } else {
                pdfCtx.fillStyle = '#f9f9f9';
                pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
            }
            
            // Draw name on PDF (positions doubled)
            pdfCtx.fillStyle = '#000000';
            pdfCtx.font = `italic ${fontSizes.pdf.name}px  Arial`;
            pdfCtx.textAlign = 'center';
            pdfCtx.fillText(name.toUpperCase(), positions.name.x * 2, positions.name.y * 2);

            
            // Draw ID on PDF
            pdfCtx.fillStyle = '#000000';
            pdfCtx.font = `${fontSizes.pdf.id}px Arial`;
            pdfCtx.fillText(id, positions.id.x * 2, positions.id.y * 2);
            
            // Add image to PDF
            const imgData = pdfCanvas.toDataURL('image/jpeg', 1.0);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'JPEG', 5, 5, pdfWidth - 10, pdfHeight - 10);
            
            // Save
            const fileName = `NikshayMitra_${name.replace(/\s+/g, '_')}_${id}.pdf`;
            pdf.save(fileName);
            
            return true;
        } catch (error) {
            console.error('PDF Error:', error);
            return false;
        }
    }
    
    // Event listeners
   elements.idInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
    updateValidation();
});

    
    elements.nameInput.addEventListener('input', updateValidation);
    
    elements.previewBtn.addEventListener('click', function() {
        if (!isNameValid || !isIdValid || !isImageLoaded) {
            alert('Please enter valid details first');
            return;
        }
        const name = elements.nameInput.value.trim();
        const id = elements.idInput.value.trim().toUpperCase();
        drawPreview(name, id);
        canvas.style.display = 'block';
        elements.previewPlaceholder.style.display = 'none';
    });
    
    elements.downloadBtn.addEventListener('click', function() {
        if (!isNameValid || !isIdValid || !isImageLoaded) {
            alert('Please enter valid details first');
            return;
        }
        
        const name = elements.nameInput.value.trim();
        const id = elements.idInput.value.trim().toUpperCase();
        
        // Show loading
        elements.downloadBtn.innerHTML = '<span>⏳</span> Generating...';
        elements.downloadBtn.disabled = true;
        
        setTimeout(() => {
            const success = generatePDF(name, id);
            if (success) {
                alert(`✅ Certificate downloaded!\nSaved as: ${name.replace(/\s+/g, '_')}_${id}.pdf`);
            } else {
                alert('❌ Error generating PDF');
            }
            
            elements.downloadBtn.innerHTML = '<span>⬇️</span> Download Certificate';
            elements.downloadBtn.disabled = !(isNameValid && isIdValid && isImageLoaded);
        }, 600);
    });
    
    // Initialize
    loadCertificateTemplate();
});
