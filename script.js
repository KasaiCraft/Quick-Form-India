// Global state
let userData = {};
let selectedFormType = '';

// Form templates
const formTemplates = {
    'pan-application': {
        title: 'PAN Card Application Form (Form 49A)',
        fields: ['fullName', 'fatherName', 'dob', 'gender', 'address', 'city', 'state', 'pincode', 'mobile', 'email']
    },
    'pan-correction': {
        title: 'PAN Card Correction Form (Form 49A)',
        fields: ['fullName', 'fatherName', 'dob', 'gender', 'address', 'city', 'state', 'pincode', 'mobile', 'email', 'panNumber']
    },
    'aadhaar-update': {
        title: 'Aadhaar Demographic Update Form',
        fields: ['fullName', 'fatherName', 'dob', 'gender', 'address', 'city', 'state', 'pincode', 'mobile', 'email', 'aadhaarNumber']
    },
    'passport-application': {
        title: 'Passport Application Form',
        fields: ['fullName', 'fatherName', 'dob', 'gender', 'address', 'city', 'state', 'pincode', 'mobile', 'email']
    },
    'gst-registration': {
        title: 'GST Registration Form',
        fields: ['fullName', 'fatherName', 'address', 'city', 'state', 'pincode', 'mobile', 'email', 'panNumber']
    },
    'driving-license': {
        title: 'Driving License Application Form',
        fields: ['fullName', 'fatherName', 'dob', 'gender', 'address', 'city', 'state', 'pincode', 'mobile', 'email']
    }
};

// Navigation functionality
function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Special handling for data-entry page
    if (pageName === 'data-entry') {
        updateDataEntryPage();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Navigation click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Footer link handlers
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Form selection handler
    const formTypeSelect = document.getElementById('form-type');
    const proceedBtn = document.getElementById('proceed-btn');
    
    if (formTypeSelect && proceedBtn) {
        formTypeSelect.addEventListener('change', function() {
            selectedFormType = this.value;
            proceedBtn.disabled = !selectedFormType;
        });
        
        proceedBtn.addEventListener('click', function() {
            if (selectedFormType) {
                navigateToPage('data-entry');
            }
        });
    }
    
    // User data form handler
    const userForm = document.getElementById('user-data-form');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            userData = {};
            
            for (let [key, value] of formData.entries()) {
                userData[key] = value;
            }
            
            // Navigate to preview
            generatePreview();
            navigateToPage('preview');
        });
    }
    
    // Contact form handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// Update data entry page based on selected form
function updateDataEntryPage() {
    if (!selectedFormType) return;
    
    const template = formTemplates[selectedFormType];
    if (!template) return;
    
    // Update page title or form header if needed
    const pageHeader = document.querySelector('#data-entry-page .page-header h1');
    if (pageHeader) {
        pageHeader.textContent = `Fill Details for ${template.title}`;
    }
    
    // Show/hide fields based on form type
    const allGroups = document.querySelectorAll('.form-group');
    allGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            const fieldName = input.name;
            if (template.fields.includes(fieldName)) {
                group.style.display = 'block';
                // Set required attribute
                input.required = true;
            } else {
                group.style.display = 'none';
                input.required = false;
            }
        }
    });
}

// Generate form preview
function generatePreview() {
    const previewContainer = document.getElementById('form-preview');
    if (!previewContainer) return;
    
    const template = formTemplates[selectedFormType];
    if (!template) return;
    
    let previewHTML = `
        <div class="pdf-content">
            <h1>${template.title}</h1>
    `;
    
    // Personal Details Section
    previewHTML += '<div class="section-header">Personal Details</div>';
    
    if (userData.fullName) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">Full Name:</div>
                <div class="form-value">${userData.fullName}</div>
            </div>
        `;
    }
    
    if (userData.fatherName) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">Father's Name:</div>
                <div class="form-value">${userData.fatherName}</div>
            </div>
        `;
    }
    
    if (userData.dob) {
        const formattedDate = new Date(userData.dob).toLocaleDateString('en-IN');
        previewHTML += `
            <div class="form-row">
                <div class="form-label">Date of Birth:</div>
                <div class="form-value">${formattedDate}</div>
            </div>
        `;
    }
    
    if (userData.gender) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">Gender:</div>
                <div class="form-value">${userData.gender}</div>
            </div>
        `;
    }
    
    // Address Details Section
    previewHTML += '<div class="section-header">Address Details</div>';
    
    if (userData.address) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">Address:</div>
                <div class="form-value">${userData.address}</div>
            </div>
        `;
    }
    
    if (userData.city) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">City:</div>
                <div class="form-value">${userData.city}</div>
            </div>
        `;
    }
    
    if (userData.state) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">State:</div>
                <div class="form-value">${userData.state}</div>
            </div>
        `;
    }
    
    if (userData.pincode) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">PIN Code:</div>
                <div class="form-value">${userData.pincode}</div>
            </div>
        `;
    }
    
    // Contact Details Section
    previewHTML += '<div class="section-header">Contact Details</div>';
    
    if (userData.mobile) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">Mobile:</div>
                <div class="form-value">${userData.mobile}</div>
            </div>
        `;
    }
    
    if (userData.email) {
        previewHTML += `
            <div class="form-row">
                <div class="form-label">Email:</div>
                <div class="form-value">${userData.email}</div>
            </div>
        `;
    }
    
    // Document Details Section (if applicable)
    if (userData.panNumber || userData.aadhaarNumber) {
        previewHTML += '<div class="section-header">Document Details</div>';
        
        if (userData.panNumber) {
            previewHTML += `
                <div class="form-row">
                    <div class="form-label">PAN Number:</div>
                    <div class="form-value">${userData.panNumber}</div>
                </div>
            `;
        }
        
        if (userData.aadhaarNumber) {
            previewHTML += `
                <div class="form-row">
                    <div class="form-label">Aadhaar Number:</div>
                    <div class="form-value">${userData.aadhaarNumber}</div>
                </div>
            `;
        }
    }
    
    previewHTML += '</div>';
    previewContainer.innerHTML = previewHTML;
}

// Generate and download PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const template = formTemplates[selectedFormType];
    if (!template) return;
    
    // Set up document
    doc.setFontSize(18);
    doc.text(template.title, 20, 30);
    
    let yPosition = 50;
    
    // Personal Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Personal Details', 20, yPosition);
    yPosition += 15;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    
    if (userData.fullName) {
        doc.text(`Full Name: ${userData.fullName}`, 20, yPosition);
        yPosition += 10;
    }
    
    if (userData.fatherName) {
        doc.text(`Father's Name: ${userData.fatherName}`, 20, yPosition);
        yPosition += 10;
    }
    
    if (userData.dob) {
        const formattedDate = new Date(userData.dob).toLocaleDateString('en-IN');
        doc.text(`Date of Birth: ${formattedDate}`, 20, yPosition);
        yPosition += 10;
    }
    
    if (userData.gender) {
        doc.text(`Gender: ${userData.gender}`, 20, yPosition);
        yPosition += 15;
    }
    
    // Address Details
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('Address Details', 20, yPosition);
    yPosition += 15;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    
    if (userData.address) {
        const addressLines = doc.splitTextToSize(`Address: ${userData.address}`, 170);
        doc.text(addressLines, 20, yPosition);
        yPosition += addressLines.length * 7 + 5;
    }
    
    if (userData.city) {
        doc.text(`City: ${userData.city}`, 20, yPosition);
        yPosition += 10;
    }
    
    if (userData.state) {
        doc.text(`State: ${userData.state}`, 20, yPosition);
        yPosition += 10;
    }
    
    if (userData.pincode) {
        doc.text(`PIN Code: ${userData.pincode}`, 20, yPosition);
        yPosition += 15;
    }
    
    // Contact Details
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('Contact Details', 20, yPosition);
    yPosition += 15;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    
    if (userData.mobile) {
        doc.text(`Mobile: ${userData.mobile}`, 20, yPosition);
        yPosition += 10;
    }
    
    if (userData.email) {
        doc.text(`Email: ${userData.email}`, 20, yPosition);
        yPosition += 15;
    }
    
    // Document Details (if applicable)
    if (userData.panNumber || userData.aadhaarNumber) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.text('Document Details', 20, yPosition);
        yPosition += 15;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(12);
        
        if (userData.panNumber) {
            doc.text(`PAN Number: ${userData.panNumber}`, 20, yPosition);
            yPosition += 10;
        }
        
        if (userData.aadhaarNumber) {
            doc.text(`Aadhaar Number: ${userData.aadhaarNumber}`, 20, yPosition);
            yPosition += 10;
        }
    }
    
    // Add footer
    yPosition += 20;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Generated by QuickForm India - quickformindia.com', 20, yPosition);
    doc.text('Note: Please verify all details before submission', 20, yPosition + 10);
    
    // Save the PDF
    const fileName = `${selectedFormType.replace('-', '_')}_${userData.fullName?.replace(/\s+/g, '_') || 'form'}.pdf`;
    doc.save(fileName);
    
    // Show success message
    setTimeout(() => {
        alert('PDF downloaded successfully! Please check your downloads folder.');
    }, 500);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function validateForm(formData) {
    const required = ['fullName', 'fatherName', 'dob', 'address', 'city', 'state', 'pincode', 'mobile', 'email'];
    
    for (let field of required) {
        if (!formData[field] || formData[field].trim() === '') {
            return { isValid: false, message: `Please fill the ${field} field` };
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    // Validate mobile
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
        return { isValid: false, message: 'Please enter a valid 10-digit mobile number' };
    }
    
    // Validate PIN code
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
        return { isValid: false, message: 'Please enter a valid 6-digit PIN code' };
    }
    
    return { isValid: true };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Mobile menu functionality
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('show');
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Form validation feedback
function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = '#e74c3c';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        
        // Clear error on input
        field.addEventListener('input', function() {
            this.style.borderColor = '#ddd';
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }
}

// Loading state management
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span>Processing...</span>';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

