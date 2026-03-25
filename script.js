/* --- Global Variables --- */
let currentUserRole = "";
let registeredName = ""; 
let currentUserData = {}; 
let profileImageBase64 = ""; // Stores custom upload or default gender PNG

/* --- Dashboard Data Mapping --- */
const roleContent = {
    'Student': ['Attendance', 'Assignment', 'Time Tables', 'Fees', 'Folders (Docs/Certs)', 'Notes'],
    'Faculty': ['Time Tables', 'Attendance', 'Schedules', 'Classes (CSE/ECE/AI/ML)', 'Announcement', 'Notice', 'Academics', 'Salary'],
    'StaffTransport': ['Bus No (Route) - Students', 'Announcements', 'Schedules', 'Salary'],
    'StaffCleaning': ['Schedules', 'Tasks', 'Salary', 'Announcements'],
    'Admin': ['Announcements', 'Exams Updates', 'Events Update']
};

/* --- 1. Modal Control Functions --- */
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

window.onclick = function(event) {
    if (event.target.className === "modal") {
        event.target.style.display = "none";
    }
}

/* --- 2. Sign Up & Sign In Logic --- */
function showRegForm(userType) {
    currentUserRole = userType;
    document.getElementById("selectionStep").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
    document.getElementById("selectedUserTitle").innerText = "Register as " + userType;

    const staffOptions = document.getElementById("staffSubOptions");
    staffOptions.style.display = (userType === 'Staff') ? "block" : "none";
}

function backToSelection() {
    document.getElementById("selectionStep").style.display = "block";
    document.getElementById("registrationForm").style.display = "none";
}

function handleFinalSignup() {
    const nameInput = document.getElementById("regName").value;
    const emailInput = document.getElementById("regEmail").value;

    if (nameInput && emailInput) {
        registeredName = nameInput.toUpperCase();
        
        // Ensure role is captured correctly
        if (currentUserRole === 'Staff') {
            const dept = document.getElementById("staffDepartment").value;
            currentUserRole = 'Staff' + dept;
        }

        // 1. Hide the signup modal FIRST
        closeModal('signUpModal');
        
        // 2. Small delay to allow the DOM to reset (prevents "stuck" backdrops)
        setTimeout(() => {
            openDetailsModal(); 
        }, 100);
    } else {
        alert("Please fill in all fields.");
    }
}

function handleSignIn() {
    const email = document.getElementById("loginEmail").value;
    if (email) {
        registeredName = email.split('@')[0].toUpperCase();
        currentUserRole = 'Student'; // Default for demo
        closeModal('signInModal');
        openDetailsModal(); 
    }
}

function openDetailsModal() {
    console.log("Opening Details Modal..."); // Debugging line
    const modal = document.getElementById('detailsModal');
    const container = document.getElementById('formFieldsContainer');
    
    if (!modal || !container) {
        console.error("Modal elements not found!");
        return;
    }

    container.innerHTML = ''; 
    
    // Force visibility
    modal.style.display = "block";
    
    let fields = `
        <div style="text-align:center; margin-bottom:15px;">
            <p style="font-size: 14px; color: #fff; margin-bottom: 5px;">Add Profile Picture:</p>
            <input type="file" id="profilePicInput" accept="image/*" class="input-field" onchange="handleFileUpload(this)">
        </div>
        <input type="text" id="detName" value="${registeredName}" class="input-field" readonly>
        <select id="detGender" class="input-field" onchange="updateDefaultAvatar(this.value)" required>
            <option value="">Select Gender</option>
            <option value="Male">Male/Boy</option>
            <option value="Female">Female/Girl</option>
        </select>
        <input type="text" id="detMobile" placeholder="Mobile Number (10 Digits)" class="input-field" maxlength="10">
        <input type="text" id="detBlood" placeholder="Blood Group" class="input-field">
    `;

    if (currentUserRole === 'Student') {
        fields += `
            <input type="text" id="detFather" placeholder="Father's Name" class="input-field">
            <input type="text" id="detUSN" placeholder="USN" class="input-field">
            <input type="text" id="detBranch" placeholder="Branch" class="input-field">
        `;
    }

    fields += `<button class="btn-signup-modal" style="width:100%; margin-top:10px;" onclick="savePersonalDetails()">Save & Enter Portal</button>`;
    container.innerHTML = fields;
}
    // 2. Add Role-Specific Fields
    if (currentUserRole === 'Student') {
        fields += `
            <input type="text" id="detFather" placeholder="Father's Name" class="input-field">
            <input type="text" id="detUSN" placeholder="USN" class="input-field">
            <input type="text" id="detDegree" placeholder="Degree" class="input-field">
            <input type="text" id="detDept" placeholder="Department" class="input-field">
            <input type="number" id="detBacklogs" placeholder="Number of Backlogs" class="input-field">
            <input type="number" id="detYOP" placeholder="Year of Passing" class="input-field">
        `;
    } else {
        fields += `<input type="text" id="detReg" placeholder="Registration Number" class="input-field">`;
    }

    // 3. Create a single instance of the Save Button
    fields += `<button class="btn-signup-modal" style="width:100%; margin-top:10px;" onclick="savePersonalDetails()">Save & Enter Portal</button>`;

    // Inject the final string into the container once
    container.innerHTML = fields;

    // Ensure we scroll to the top of the modal content
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;

/* --- 4. Image & Avatar Logic --- */
function updateDefaultAvatar(gender) {
    if (gender === "Male") {
        profileImageBase64 = "boy.png"; //
    } else if (gender === "Female") {
        profileImageBase64 = "woman.png"; //
    }
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImageBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

/* --- 5. Save & Dashboard Rendering --- */
function savePersonalDetails() {
    const mobile = document.getElementById('detMobile').value;
    
    // 10-Digit Validation
    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    currentUserData = {
        name: registeredName,
        gender: document.getElementById('detGender').value,
        mobile: mobile,
        blood: document.getElementById('detBlood').value,
        role: currentUserRole
    };

    if (currentUserRole === 'Student') {
        currentUserData.father = document.getElementById('detFather').value;
        currentUserData.usn = document.getElementById('detUSN').value;
        currentUserData.degree = document.getElementById('detDegree').value;
        currentUserData.dept = document.getElementById('detDept').value;
        currentUserData.backlogs = document.getElementById('detBacklogs').value;
        currentUserData.yop = document.getElementById('detYOP').value;
    } else {
        currentUserData.reg = document.getElementById('detReg').value;
    }

    document.getElementById('detailsModal').style.display = "none";
    renderDashboard(currentUserRole, registeredName);
}

function toggleProfile() {
    const card = document.getElementById('profileDropdown');
    card.style.display = (card.style.display === 'none' || card.style.display === '') ? 'block' : 'none';
    if (card.style.display === 'block') renderProfileCard();
}

function renderProfileCard() {
    const content = document.getElementById('profileContent');
    const d = currentUserData;
    
    // Update the header icon with the final choice
    document.getElementById('headerProfileIcon').src = profileImageBase64 || "profile-logo.png";

    let html = `<h3>Profile Details</h3><div style="text-align: left; font-size: 14px;">`;
    
    if (d.role === 'Student') {
        html += `
            <p><b>1. Name:</b> ${d.name}</p>
            <p><b>2. Gender:</b> ${d.gender}</p>
            <p><b>3. Father:</b> ${d.father}</p>
            <p><b>4. USN:</b> ${d.usn}</p>
            <p><b>5. Mobile:</b> ${d.mobile}</p>
            <p><b>6. Blood:</b> ${d.blood}</p>
            <p><b>7. Degree:</b> ${d.degree}</p>
            <p><b>8. Dept:</b> ${d.dept}</p>
            <p><b>9. Backlogs:</b> ${d.backlogs}</p>
            <p><b>10. Passing:</b> ${d.yop}</p>
        `;
    } else {
        html += `
            <p><b>1. Name:</b> ${d.name}</p>
            <p><b>2. Gender:</b> ${d.gender}</p>
            <p><b>3. Reg Number:</b> ${d.reg}</p>
            <p><b>4. Mobile:</b> ${d.mobile}</p>
            <p><b>5. Blood:</b> ${d.blood}</p>
        `;
    }

    html += `</div><button class="btn-logout" style="width:100%; margin-top:10px;" onclick="location.reload()">Logout</button>`;
    content.innerHTML = html;
}

function renderDashboard(role, displayName) {
    // 1. Hide the landing page and the top header
    document.getElementById('landingPage').style.display = 'none';
    const topHeader = document.querySelector('.top-header');
    if(topHeader) topHeader.style.display = 'none';

    // 2. Show the dashboard and ensure it's on top
    const dashboard = document.getElementById('dashboardSection');
    dashboard.style.display = 'block';
    dashboard.style.position = 'relative'; 
    dashboard.style.zIndex = '10'; // Higher than the video background

    // 3. Update the text
    document.getElementById('userNameDisplay').innerText = displayName;
    const displayRole = role.includes('Staff') ? "Staff Portal" : role + " Portal";
    document.getElementById('userGreeting').innerText = displayRole;

    // 4. Render the grid cards
    const grid = document.getElementById('portalGrid');
    grid.innerHTML = ''; 

    const cards = roleContent[role] || roleContent['Student'];
    cards.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'grid-item';
        card.style.animationDelay = (index * 0.1) + "s";
        card.innerHTML = `<h3>${item}</h3><p>Manage ${item} details</p>`;
        card.onclick = () => alert("Opening " + item + "...");
        grid.appendChild(card);
    });
}

/* --- 6. Typewriter Effect --- */
const mottoText = "Bridge to the Future";
let mottoIndex = 0;
function typeWriter() {
    const mottoElement = document.getElementById("motto");
    if (mottoElement && mottoIndex < mottoText.length) {
        mottoElement.innerHTML += mottoText.charAt(mottoIndex);
        mottoIndex++;
        setTimeout(typeWriter, 100);
    }
}
window.onload = typeWriter;

/* --- 3. Personal Details Modal Logic (FIXED) --- */
function openDetailsModal() {
    const modal = document.getElementById('detailsModal');
    const container = document.getElementById('formFieldsContainer');
    
    // Clear the container first to prevent any leftover duplicates
    container.innerHTML = ''; 
    modal.style.display = "block";

    // 1. Create a single instance of the Profile Picture upload
    let fields = `
        <div style="text-align:center; margin-bottom:15px;">
            <p style="font-size: 14px; color: #fff; margin-bottom: 5px;">Add Profile Picture:</p>
            <input type="file" id="profilePicInput" accept="image/*" class="input-field" onchange="handleFileUpload(this)">
        </div>
        <input type="text" id="detName" value="${registeredName}" class="input-field" readonly>
        <select id="detGender" class="input-field" onchange="updateDefaultAvatar(this.value)" required>
            <option value="">Select Gender</option>
            <option value="Male">Male/Boy</option>
            <option value="Female">Female/Girl</option>
        </select>
        <input type="text" id="detMobile" placeholder="Mobile Number (10 Digits)" class="input-field" maxlength="10">
        <input type="text" id="detBlood" placeholder="Blood Group" class="input-field">
    `;

    // 2. Add Role-Specific Fields
    if (currentUserRole === 'Student') {
        fields += `
            <input type="text" id="detFather" placeholder="Father's Name" class="input-field">
            <input type="text" id="detUSN" placeholder="USN" class="input-field">
            <input type="text" id="detDegree" placeholder="Degree" class="input-field">
            <input type="text" id="detDept" placeholder="Department" class="input-field">
            <input type="number" id="detBacklogs" placeholder="Number of Backlogs" class="input-field">
            <input type="number" id="detYOP" placeholder="Year of Passing" class="input-field">
        `;
    } else {
        fields += `<input type="text" id="detReg" placeholder="Registration Number" class="input-field">`;
    }

    // 3. Create a single instance of the Save Button
    fields += `<button class="btn-signup-modal" style="width:100%; margin-top:10px;" onclick="savePersonalDetails()">Save & Enter Portal</button>`;

    // Inject the final string into the container once
    container.innerHTML = fields;

    // Ensure we scroll to the top of the modal content
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;
}
/* --- Updated Profile Rendering Logic --- */
f/* --- Updated Profile Rendering Logic --- */
function renderProfileCard() {
    const card = document.getElementById('profileDropdown');
    const content = document.getElementById('profileContent');
    const headerIcon = document.getElementById('headerProfileIcon');
    const d = currentUserData;

    if (!card || !headerIcon) return;

    // 1. Get the position of the PNG logo to align the card below it
    const rect = headerIcon.getBoundingClientRect();
    
    // 2. Position the card specifically below the logo
    card.style.position = "fixed";
    card.style.top = (rect.bottom + 10) + "px"; // 10px gap below logo
    card.style.left = (rect.left - 250) + "px"; // Align horizontally
    card.style.zIndex = "10000";               // Force to top layer
    card.style.display = "block";

    // 3. Update the header icon if a custom one was uploaded
    if (profileImageBase64) {
        headerIcon.src = profileImageBase64;
    }

    // 4. Render Content with Solid Black Labels
    let html = `<h3 style="color:#00e5ff; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:5px;">Profile Details</h3>`;
    html += `<div class="profile-details-list" style="text-align: left; font-size: 14px;">`;
    
    // Helper for black labels
    const row = (num, label, value) => `
        <p style="margin-bottom: 8px; color: #ffffff;">
            <b style="color: #000000 !important; font-weight: 800; display: inline-block; width: 110px;">
                ${num}. ${label}:
            </b> 
            ${value || 'N/A'}
        </p>`;

    if (d.role === 'Student') {
        html += row(1, "Name", d.name);
        html += row(2, "Gender", d.gender);
        html += row(3, "Father", d.father);
        html += row(4, "USN", d.usn);
        html += row(5, "Mobile", d.mobile);
        html += row(6, "Blood", d.blood);
        html += row(7, "Degree", d.degree);
        html += row(8, "Dept", d.dept);
        html += row(9, "Backlogs", d.backlogs);
        html += row(10, "Passing", d.yop);
    } else {
        html += row(1, "Name", d.name);
        html += row(2, "Gender", d.gender);
        html += row(3, "Reg Number", d.reg);
        html += row(4, "Mobile", d.mobile);
        html += row(5, "Blood", d.blood);
    }

    html += `</div><button class="btn-logout" style="width:100%; margin-top:15px; background:#ff4d4d; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; font-weight:bold;" onclick="location.reload()">Logout</button>`;
    
    content.innerHTML = html;
}
function updateDefaultAvatar(gender) {
    // Make sure these paths match your actual folder structure
    if (gender === "Male") {
        profileImageBase64 = "boy.png"; 
    } else if (gender === "Female") {
        profileImageBase64 = "woman.png"; 
    }
    
    // Update the icon immediately so the user sees the change
    const headerIcon = document.getElementById('headerProfileIcon');
    if (headerIcon) {
        headerIcon.src = profileImageBase64;
    }
}