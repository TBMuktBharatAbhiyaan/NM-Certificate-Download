document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const idInput = document.getElementById('idInput');
    const previewBtn = document.getElementById('previewBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const validationMessage = document.getElementById('validationMessage');
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const previewHint = document.getElementById('previewHint');

    let isNameValid = false;
    let isIdValid = false;
    let certificateImage = null;
    let isImageLoaded = false;

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
            console.warn('⚠️ Certificate template not found, using fallback');
            createFallbackTemplate();
            isImageLoaded = true;
            updateValidation();
        };
        img.src = 'certificate-template.jpg';
    }

    // Fallback certificate template
    function createFallbackTemplate() {
        canvas.width = 800;
        canvas.height = 500;
        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        ctx.fillStyle = '#b71c1c';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NIKSHAY MITRA', canvas.width / 2, 80);
        ctx.fillText('Certificate of Recognition', canvas.width / 2, 120);
    }

    // Validate NM ID (M + 11 digits)
    function validateNikshayMitraId(id) {
        const pattern = /^M\d{11}$/;
        return pattern.test(id);
    }

    // Update validation state
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
                validationMessage.textContent = '✓ Valid NM ID';
                validationMessage.className = 'success';
                validationMessage.style.display = 'block';
            } else {
                validationMessage.textContent = '✗ Check the NM ID !';
                validationMessage.className = 'error';
                validationMessage.style.display = 'block';
            }
        }

        // Enable/disable download button
        downloadBtn.disabled = !(isNameValid && isIdValid && isImageLoaded);
        previewBtn.disabled = !(isNameValid && isIdValid && isImageLoaded);
    }

    // Format ID input
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

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (certificateImage) {
            ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);
        } else {
            createFallbackTemplate();
        }

        // Add name
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, canvas.width / 2, canvas.height * 0.55);

        // Add ID
        ctx.fillStyle = '#000000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`NM ID: ${id}`, canvas.width / 2, canvas.height * 0.72);

        canvas.style.display = 'block';
        previewHint.style.display = 'none';
    });

    // Download certificate as PDF
    downloadBtn.addEventListener('click', function() {
        if (!isNameValid || !isIdValid || !isImageLoaded) {
            alert('Please enter valid details first');
            return;
        }

        const name = nameInput.value.trim();
        const id = idInput.value.trim().toUpperCase();

        // Show loading
        document.body.style.opacity = '0.7';
        downloadBtn.disabled = true;

        setTimeout(() => {
            try {
                // Create high-resolution canvas for PDF
                const pdfCanvas = document.createElement('canvas');
                const pdfCtx = pdfCanvas.getContext('2d');
                pdfCanvas.width = 1600;
                pdfCanvas.height = 1000;

                if (certificateImage) {
                    pdfCtx.drawImage(certificateImage, 0, 0, pdfCanvas.width, pdfCanvas.height);
                } else {
                    pdfCtx.fillStyle = '#f0f8ff';
                    pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
                    pdfCtx.strokeStyle = '#667eea';
                    pdfCtx.lineWidth = 8;
                    pdfCtx.strokeRect(40, 40, pdfCanvas.width - 80, pdfCanvas.height - 80);
                }

                // Add name
                pdfCtx.fillStyle = '#000000';
                pdfCtx.font = 'bold 64px Arial';
                pdfCtx.textAlign = 'center';
                pdfCtx.fillText(name, pdfCanvas.width / 2, pdfCanvas.height * 0.55);

                // Add ID
                pdfCtx.fillStyle = '#000000';
                pdfCtx.font = '48px Arial';
                pdfCtx.fillText(`NM ID: ${id}`, pdfCanvas.width / 2, pdfCanvas.height * 0.72);

                // Generate PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                });

                const imgData = pdfCanvas.toDataURL('image/jpeg', 0.95);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pdfWidth - 20;
                const imgHeight = (pdfCanvas.height / pdfCanvas.width) * imgWidth;

                pdf.addImage(imgData, 'JPEG', 10, (pdfHeight - imgHeight) / 2, imgWidth, imgHeight);

                const fileName = `NikshayMitra_${name.replace(/\s+/g, '_')}_${id}.pdf`;
                pdf.save(fileName);

                alert(`✓ Certificate downloaded successfully!\nFilename: ${fileName}`);

            } catch (error) {
                console.error('Error:', error);
                alert('❌ Error generating certificate. Please try again.');
            } finally {
                document.body.style.opacity = '1';
                downloadBtn.disabled = false;
            }
        }, 500);
    });

    // Initialize
    loadCertificateTemplate();
});
