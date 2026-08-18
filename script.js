document.addEventListener('DOMContentLoaded', function () {

    // ─── DOM Elements ────────────────────────────────────────────────
    const nameInput         = document.getElementById('nameInput');
    const idInput           = document.getElementById('idInput');
    const generateBtn       = document.getElementById('generateBtn');
    const previewBtn        = document.getElementById('previewBtn');
    const downloadBtn       = document.getElementById('downloadBtn');
    const validationMsg     = document.getElementById('validationMessage');
    const canvas            = document.getElementById('certificateCanvas');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const ctx               = canvas.getContext('2d');

    // ─── State ───────────────────────────────────────────────────────
    let certificateImage = null;
    let isImageLoaded    = false;
    let isNameValid      = false;
    let isIdValid        = false;

    // ─── Text Position on Canvas (800×500) ───────────────────────────
    // Adjust x/y to match your certificate-template.jpg
    const positions = {
        name: { x: 530, y: 207 },
        id:   { x: 161, y: 235 }
    };

    // ─── Font Sizes ───────────────────────────────────────────────────
    const fontSizes = {
        preview: { name: 20, id: 11 },
        pdf:     { name: 32, id: 21 }   // ×2 for high-res PDF canvas
    };

    // ─── On Page Load: disable Preview & Download ────────────────────
    previewBtn.disabled  = true;
    downloadBtn.disabled = true;

    // ─── Load Certificate Template Image ─────────────────────────────
    function loadCertificateTemplate() {
        const img = new Image();

        img.onload = function () {
            certificateImage = img;
            isImageLoaded    = true;
            console.log('✅ Certificate template loaded successfully');
        };

        img.onerror = function () {
            console.warn('⚠️ certificate-template.jpg not found — using fallback template');
            isImageLoaded = true;
            drawFallbackTemplate();
        };

        // Must match the filename exactly in the same folder
        img.src = 'certificate-template.jpg';
    }

    // ─── Fallback Template (when image is missing) ────────────────────
    function drawFallbackTemplate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fffdf5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Outer border
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth   = 6;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

        // Inner border
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth   = 2;
        ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

        // Title
        ctx.fillStyle  = '#b71c1c';
        ctx.font       = 'bold 34px Arial';
        ctx.textAlign  = 'center';
        ctx.fillText('NIKSHAY MITRA', canvas.width / 2, 90);

        ctx.fillStyle = '#333';
        ctx.font      = '22px Arial';
        ctx.fillText('Certificate of Recognition', canvas.width / 2, 135);

        ctx.font      = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText('(certificate-template.jpg not found — using fallback)', canvas.width / 2, 470);
    }

    // ─── Validate Name ────────────────────────────────────────────────
    function validateName(name) {
        // At least 7 chars, starts with a letter, allows letters/spaces/dots/hyphens/apostrophes
        return /^[A-Za-z][A-Za-z\s.''-]{6,59}$/.test(name.trim());
    }

    // ─── Validate NM ID ───────────────────────────────────────────────
    function validateNikshayMitraId(id) {
        id = id.trim().toUpperCase();

        // Must be M + exactly 11 digits (total 12 chars)
        if (!/^M\d{11}$/.test(id))             return false;
        // Second character must be 2
        if (id[1] !== '2')                      return false;
        // No same digit repeated 4+ times in a row
        if (/(\d)\1{3,}/.test(id))              return false;
        // No ascending run of 5+ digits
        if (/01234|12345|23456|34567|45678|56789/.test(id)) return false;
        // No descending run of 5+ digits
        if (/98765|87654|76543|65432|54321|43210/.test(id)) return false;
        // Must have at least 4 unique digits
        const uniqueDigits = new Set(id.substring(1));
        if (uniqueDigits.size < 4)              return false;

        return true;
    }

    // ─── Show Validation Message ──────────────────────────────────────
    function showMessage(text, type) {
        validationMsg.textContent  = text;
        validationMsg.className    = type;   // 'error' or 'success'
        validationMsg.style.display = 'block';
    }

    function hideMessage() {
        validationMsg.style.display = 'none';
        validationMsg.textContent   = '';
        validationMsg.className     = '';
    }

    // ─── Draw Preview on Canvas ───────────────────────────────────────
    function drawPreview(name, id) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (certificateImage) {
            ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);
        } else {
            drawFallbackTemplate();
        }

        // Name text
        ctx.fillStyle = '#000000';
        ctx.font      = `italic ${fontSizes.preview.name}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(name.toUpperCase(), positions.name.x, positions.name.y);

        // ID text
        ctx.fillStyle = '#000000';
        ctx.font      = `italic ${fontSizes.preview.id}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(id, positions.id.x, positions.id.y);
    }

    // ─── Generate PDF ─────────────────────────────────────────────────
    function generatePDF(name, id) {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit:        'mm',
                format:      'a4'
            });

            // High-res canvas (2× for crisp PDF)
            const pdfCanvas  = document.createElement('canvas');
            pdfCanvas.width  = 1584;
            pdfCanvas.height = 990;
            const pdfCtx     = pdfCanvas.getContext('2d');

            if (certificateImage) {
                pdfCtx.drawImage(certificateImage, 0, 0, pdfCanvas.width, pdfCanvas.height);
            } else {
                pdfCtx.fillStyle = '#fffdf5';
                pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
            }

            // Name on PDF
            pdfCtx.fillStyle = '#000000';
            pdfCtx.font      = `italic ${fontSizes.pdf.name}px Arial`;
            pdfCtx.textAlign = 'center';
            pdfCtx.fillText(name.toUpperCase(), positions.name.x * 2, positions.name.y * 2);

            // ID on PDF
            pdfCtx.fillStyle = '#000000';
            pdfCtx.font      = `italic ${fontSizes.pdf.id}px Arial`;
            pdfCtx.textAlign = 'center';
            pdfCtx.fillText(id, positions.id.x * 2, positions.id.y * 2);

            // Embed into PDF
            const imgData  = pdfCanvas.toDataURL('image/jpeg', 1.0);
            const pdfW     = pdf.internal.pageSize.getWidth();
            const pdfH     = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'JPEG', 5, 5, pdfW - 10, pdfH - 10);

            const fileName = `NikshayMitra_${name.trim().replace(/\s+/g, '_')}_${id}.pdf`;
            pdf.save(fileName);
            return true;

        } catch (err) {
            console.error('PDF generation error:', err);
            return false;
        }
    }

    // ─── Generate Certificate Button ──────────────────────────────────
    generateBtn.addEventListener('click', function () {
        const name = nameInput.value.trim();
        const id   = idInput.value.trim().toUpperCase();

        isNameValid = validateName(name);
        isIdValid   = validateNikshayMitraId(id);

        // Reset button states
        previewBtn.disabled  = true;
        downloadBtn.disabled = true;

        // Hide canvas, show placeholder
        canvas.style.display            = 'none';
        previewPlaceholder.style.display = 'block';

        // Reset input border colours
        nameInput.className = '';
        idInput.className   = '';

        hideMessage();

               if (isNameValid && isIdValid) {
            // ✅ Both valid
            if (!isImageLoaded) {
                showMessage('⏳ Template still loading, please try again in a moment.', 'error');
                return;
            }
            nameInput.classList.add('valid');
            idInput.classList.add('valid');
            previewBtn.disabled  = false;
            downloadBtn.disabled = false;
            hideMessage();
            // DO NOT show preview yet — only when Preview button is clicked
        }


        } else if (!isNameValid && isIdValid) {
            // ❌ Name wrong only
            nameInput.classList.add('invalid');
            idInput.classList.add('valid');
            showMessage('⚠️ Enter the name as registered', 'error');

        } else if (isNameValid && !isIdValid) {
            // ❌ ID wrong only
            nameInput.classList.add('valid');
            idInput.classList.add('invalid');
            showMessage('❌ Invalid/Inactive NM ID', 'error');

        } else {
            // ❌ Both wrong
            nameInput.classList.add('invalid');
            idInput.classList.add('invalid');
            showMessage('🚫 Error ! Check the NM details', 'error');
        }
    });

    // ─── idInput: auto-uppercase, no live validation ──────────────────
    idInput.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
        // Reset border if user starts editing after a failed attempt
        this.className = '';
        nameInput.className = '';
        hideMessage();
        previewBtn.disabled  = true;
        downloadBtn.disabled = true;
        canvas.style.display             = 'none';
        previewPlaceholder.style.display = 'block';
    });

    // ─── nameInput: reset on edit ─────────────────────────────────────
    nameInput.addEventListener('input', function () {
        this.className = '';
        idInput.className = '';
        hideMessage();
        previewBtn.disabled  = true;
        downloadBtn.disabled = true;
        canvas.style.display             = 'none';
        previewPlaceholder.style.display = 'block';
    });

    // ─── Preview Button ───────────────────────────────────────────────
    previewBtn.addEventListener('click', function () {
        const name = nameInput.value.trim();
        const id   = idInput.value.trim().toUpperCase();
        drawPreview(name, id);
        canvas.style.display             = 'block';
        previewPlaceholder.style.display = 'none';
    });

    // ─── Download Button ──────────────────────────────────────────────
    downloadBtn.addEventListener('click', function () {
        const name = nameInput.value.trim();
        const id   = idInput.value.trim().toUpperCase();

        downloadBtn.textContent = '⏳ Generating...';
        downloadBtn.disabled    = true;

        setTimeout(function () {
            const success = generatePDF(name, id);

            if (success) {
                alert(`✅ Certificate downloaded!\nFile: NikshayMitra_${name.replace(/\s+/g, '_')}_${id}.pdf`);
            } else {
                alert('❌ Error generating PDF. Please try again.');
            }

            downloadBtn.textContent = '⬇️ Download PDF';
            downloadBtn.disabled    = !(isNameValid && isIdValid && isImageLoaded);
        }, 600);
    });

    // ─── Initialize ───────────────────────────────────────────────────
    loadCertificateTemplate();
});
