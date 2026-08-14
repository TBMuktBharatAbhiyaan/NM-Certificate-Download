document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const idInput = document.getElementById('idInput');
    const previewBtn = document.getElementById('previewBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const validationMessage = document.getElementById('validationMessage');
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const previewPlaceholder = document.getElementById('previewPlaceholder');

    let isNameValid = false;
    let isIdValid = false;
    let certificateImage = null;
    let isImageLoaded = false;

    // CORRECTED POSITIONS:
    // Name: Shifted upward and slightly right
    const namePosition = {
        x: 430,    // Previously 400 → Increased 30px RIGHT
        y: 285     // Previously 300 → Decreased 15px UPWARD
    };

    // ID: Shifted upward and slightly left
    const idPosition = {
        x: 370,    // Previously 400 → Decreased 30px LEFT
        y: 345     // Previously 360 → Decreased 15px UPWARD
    };

    // Load certificate template
    function loadCertificateTemplate() {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            certificateImage = img;
            isImageLoaded = true;
            console.log('✓ Certificate template loaded successfully');
            updateValidation();
        };
        img.onerror = function() {
            console.warn('⚠️ Certificate image not found, using simple template');
            createFallbackTemplate();
            isImageLoaded = true;
            updateValidation();
        };
        img.src = 'certificate-template.jpg';
    }

    // Fallback certificate template (when image is missing)
    function createFallbackTemplate() {
        canvas.width = 800;
        canvas.height = 500;
        ctx.fillStyle = '#fff8f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Title
        ctx.fillStyle = '#b71c1c';
        ctx.font = 'bold 36px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('NIKSHAY MITRA', canvas.width / 2, 80);
        
        // Subtitle
        ctx.fillStyle = '#333';
        ctx.font = '24px "Times New Roman", serif';
        ctx.fillText('Certificate of Recognition', canvas.width / 2, 130);
        
        // Horizontal line
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 180);
        ctx.lineTo(canvas.width - 100, 180);
        ctx.stroke();
        
        // Position markers for debugging (REMOVABLE)
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(namePosition.x, namePosition.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(idPosition.x, idPosition.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Footer
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.fillText('Template: certificate-template.jpg required for accurate placement', canvas.width / 2, canvas.height - 60);
    }

    // Validate NM ID (M + 11 digits)
    function validateNikshayMitraId(id) {
        const pattern = /^M\d{11}$/;
        return pattern.test(id);
    }

    // Update validation state and button status
    function updateValidation() {
        const name = nameInput.value.trim();
        const id = idInput.value.trim().toUpperCase();

        // Name validation
        isNameValid = name.length > 0 && name.length <= 50;
        if (name.length === 0) {
            nameInput.classList.remove('valid', 'invalid');
        } else {
            nameInput.classList.toggle('valid', isNameValid);
            nameInput.classList.toggle('invalid', !isNameValid);
        }

        // ID validation
        isIdValid = validateNikshayMitraId(id);
        if (id.length === 0) {
            idInput.classList.remove('valid', 'invalid');
            validationMessage.style.display = 'none';
        } else {
            idInput.classList.toggle('valid', isIdValid);
            idInput.classList.toggle('invalid', !isIdValid);
            
            if (isIdValid) {
                validationMessage.textContent = '✓ Valid NM ID format';
                validationMessage.className = 'success';
            } else {
                validationMessage.textContent = '✗ Must be M + 11 digits (e.g., M12345678901)';
                validationMessage.className = 'error';
            }
            validationMessage.style.display = 'block';
        }

        // Enable/disable buttons
        downloadBtn.disabled = !(isNameValid && isIdValid && isImageLoaded);
        previewBtn.disabled = !(isNameValid && isIdValid && isImageLoaded);
    }

    // Auto-format ID input
    idInput.addEventListener('input', function() {
        let value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (value.length > 0 && value[0] !== 'M') {
            value = 'M' + value.substring(1);
        }
        
        this.value = value.substring(0, 12);
        updateValidation();
    });

    // Real-time name validation
    nameInput.addEventListener('input', updateValidation);

    // Preview certificate
    previewBtn.addEventListener('click', function() {
        if (!isNameValid || !isIdValid || !isImageLoaded) {
            alert('Please enter valid details first');
            return;
        }

        const name = nameInput.value.trim();
        const id = idInput.value.trim().toUpperCase();

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        if (certificateImage) {
            ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);
        } else {
            createFallbackTemplate();
        }

        // Draw NAME: Shifted upward and right
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 32px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(name, namePosition.x, namePosition.y);

        // Draw ID: Shifted upward and left (NO "NM ID:" prefix)
        ctx.fillStyle = '#000000';
        ctx.font = '24px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(id, idPosition.x, idPosition.y);

        // Show canvas and hide placeholder
        canvas.style.display = 'block';
        previewPlaceholder.style.display = 'none';
    });

    // Download certificate as PDF (with doubled coordinates)
    downloadBtn.addEventListener('click', function() {
        if (!isNameValid || !isIdValid || !isImageLoaded) {
            alert('Please enter valid details first');
            return;
        }

        const name = nameInput.value.trim();
        const id = idInput.value.trim().toUpperCase();

        // Show loading effect
        downloadBtn.innerHTML = '<span>⏳</span> Generating...';
        downloadBtn.disabled = true;

        setTimeout(() => {
            try {
                // Create high-resolution canvas for PDF
                const pdfCanvas = document.createElement('canvas');
                const pdfCtx = pdfCanvas.getContext('2d');
                pdfCanvas.width = 1600;  // Double resolution for quality
                pdfCanvas.height = 1000;

                // Draw background
                if (certificateImage) {
                    pdfCtx.drawImage(certificateImage, 0, 0, pdfCanvas.width, pdfCanvas.height);
                } else {
                    pdfCtx.fillStyle = '#fff8f8';
                    pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
                    pdfCtx.strokeStyle = '#b71c1c';
                    pdfCtx.lineWidth = 8;
                    pdfCtx.strokeRect(40, 40, pdfCanvas.width - 80, pdfCanvas.height - 80);
                }

                // CORRECTED PDF coordinates (doubled for high resolution)
                // Name: 430x285 doubled = 860x570
                // ID: 370x345 doubled = 740x690
                const pdfNameX = 860;  // namePosition.x * 2
                const pdfNameY = 570;  // namePosition.y * 2
                const pdfIdX = 740;    // idPosition.x * 2
                const pdfIdY = 690;    // idPosition.y * 2

                // Draw name on PDF
                pdfCtx.fillStyle = '#000000';
                pdfCtx.font = 'bold 64px "Times New Roman", serif';
                pdfCtx.textAlign = 'center';
                pdfCtx.fillText(name, pdfNameX, pdfNameY);

                // Draw ID on PDF
                pdfCtx.fillStyle = '#000000';
                pdfCtx.font = '48px "Times New Roman", serif';
                pdfCtx.fillText(id, pdfIdX, pdfIdY);

                // Generate PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                });

                const imgData = pdfCanvas.toDataURL('image/jpeg', 1.0);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pdfWidth - 10;
                const imgHeight = (pdfCanvas.height / pdfCanvas.width) * imgWidth;

                pdf.addImage(imgData, 'JPEG', 5, (pdfHeight - imgHeight) / 2, imgWidth, imgHeight);

                // Create filename
                const fileName = `NikshayMitra_${name.replace(/\s+/g, '_')}_${id}.pdf`;
                pdf.save(fileName);

                alert(`✅ Certificate downloaded!\nSaved as: ${fileName}`);

            } catch (error) {
                console.error('PDF Error:', error);
                alert('❌ Error generating PDF. Please try again.');
            } finally {
                // Restore button
                downloadBtn.innerHTML = '<span>⬇️</span> Download Certificate';
                downloadBtn.disabled = false;
            }
        }, 800);
    });

    // Initialize the application
    loadCertificateTemplate();
});
