// मोडलहरू खोल्ने र बन्द गर्ने फङ्सनहरू
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// बटनहरूमा क्लिक इभेन्ट जोड्ने
document.querySelector('.signup-btn').addEventListener('click', () => openModal('signupModal'));
document.querySelector('.cta-button').addEventListener('click', () => openModal('signupModal'));
document.querySelector('.login-btn').addEventListener('click', () => openModal('loginModal'));

// मोडल बाहिर क्लिक गर्दा बन्द हुने बनाउने
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});


// युजरले जन्ममिति कोठामा टाइप गरेर बाहिर क्लिक गर्ने बित्तिकै चेक गर्ने
document.getElementById('dob').addEventListener('blur', function() {
    const selectedDate = this.value;
    if (!selectedDate) return;

    const birthYear = new Date(selectedDate).getFullYear();

    // यदि ब्राउजरले अटो-करेक्ट गरेर १९५० बनायो वा युजरले सिधै गलत हाल्यो भने
    if (birthYear <= 1950 || birthYear > 2013) {
        alert("त्रुटि: कृपया आफ्नो वास्तविक जन्ममिति राख्नुहोस्! (साल १९५१ देखि २०१३ सम्म मात्र मान्य हुनेछ)");
        this.value = ""; // कोठा पुरै खाली गरिदिने ताकि गलत डाटा बस्नै नपाओस्
    }
});
/* ============================================
   MULTI-USER REGISTER & LOGIN LOGIC
   ============================================ */

// १. REGISTER (SIGN UP) PROCESS
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault(); // पेज रिफ्रेस हुन नदिने

    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    // पहिले नै रजिस्टर भएका युजरहरूको लिस्ट तान्ने (छैन भने खाली एरे [] बनाउने)
    let users = JSON.parse(localStorage.getItem('wealthOS_users')) || [];

    // यो इमेलबाट पहिले नै अकाउन्ट छ कि छैन चेक गर्ने (Multi-user check)
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert('यो इमेलबाट पहिले नै अकाउन्ट बनिसकेको छ! कृपया लगइन गर्नुहोस्।');
        return;
    }
    // जन्ममिति (DOB) चेक गर्ने नियम
    const birthYear = new Date(dob).getFullYear();
    if (birthYear <= 1950 || birthYear > 2013) { 
        alert("कृपया आफ्नो वास्तविक जन्ममिति राख्नुहोस्! (उमेर कम्तीमा १३ वर्ष हुनुपर्छ)");
        return; 
    }

    // नयाँ युजरको डाटा अब्जेक्ट
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        email: email,
        password: password // नोट: रियल प्रोजेक्टमा पासवर्ड इन्क्रिप्ट गरिन्छ
    };

    // नयाँ युजरलाई लिस्टमा थप्ने र LocalStorage मा सेभ गर्ने
    users.push(newUser);
    localStorage.setItem('wealthOS_users', JSON.stringify(users));

    alert(`बधाई छ ${firstName}! हजुरको अकाउन्ट सफलतापूर्वक सेभ भयो। अब लगइन गर्नुहोस्।`);
    this.reset(); // फारम खाली गर्ने
    closeModal('signupModal');
    openModal('loginModal'); // सिधै लगइन बक्स खोल्दिने
});

// २. LOGIN PROCESS (लगइन भएपछि home.html मा लैजाने)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    let users = JSON.parse(localStorage.getItem('wealthOS_users')) || [];
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        // लगइन भएको युजरको डाटा सेभ गर्ने
        localStorage.setItem('wealthOS_currentUser', JSON.stringify(validUser));
        
        alert(`स्वागत छ, ${validUser.firstName}! लगइन सफल भयो।`);
        closeModal('loginModal');
        
        // यहाँ परिवर्तन भयो: अब सिधै नयाँ home.html मा जान्छ
        window.location.href = "home.html"; 
    } else {
        alert('इमेल वा पासवर्ड मिलेन! कृपया फेरि प्रयास गर्नुहोस्।');
    }
});

// ३. FORGOT PASSWORD (RESET) PROCESS
document.getElementById('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault(); // पेज रिफ्रेस हुन नदिने

    const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
    const dob = document.getElementById('forgotDOB').value;
    const newPassword = document.getElementById('newPassword').value;

    // LocalStorage बाट सबै युजरहरूको लिस्ट तान्ने
    let users = JSON.parse(localStorage.getItem('wealthOS_users')) || [];
    
    // युजरले हालेको ईमेल र जन्ममिति दुवै म्याच गर्ने एकाउन्ट लिस्टमा खोज्ने
    const userIndex = users.findIndex(user => user.email === email && user.dob === dob);

    if (userIndex !== -1) {
        // यदि भेटियो भने नयाँ पासवर्ड अपडेट गर्दिने
        users[userIndex].password = newPassword;
        localStorage.setItem('wealthOS_users', JSON.stringify(users));

        alert("बधाई छ! हजुरको पासवर्ड सफलतापूर्वक रिसेट भयो। अब नयाँ पासवर्डबाट लगइन गर्नुहोस्।");
        this.reset(); // फारम खाली गर्ने
        closeModal('forgotModal'); // रिसेट बक्स बन्द गर्ने
        openModal('loginModal'); // सिधै लगइन बक्स खोल्दिने
    } else {
        // यदि ईमेल वा जन्ममिति मध्ये एउटा मात्र पनि मिलेन भने एरर देखाउने
        alert("त्रुटि: ईमेल वा जन्ममिति मिलेन! कृपया सही विवरण राख्नुहोस्।");
    }
});