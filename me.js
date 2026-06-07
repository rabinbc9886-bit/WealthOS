// ============================================
// WEALTHOS - ME (PROFILE) LOGIC WITH DASHBOARD PHOTO
// ============================================

function loadProfileAndPhotos() {
    // १. LocalStorage बाट डाटा र सेभ भएको फोटो तान्ने
    const meUser = JSON.parse(localStorage.getItem('wealthOS_currentUser'));
    const savedAvatar = localStorage.getItem('wealthOS_userAvatar');

    // एलिमेन्टहरू समात्ने
    const avatarBox = document.getElementById('meAvatar');
    const initialSpan = document.getElementById('avatarInitial');
    const dbAvatar = document.getElementById('dashboardAvatar');
    const dbText = document.getElementById('dashboardText');

    // २. युजरको टेक्स्ट डाटाहरू प्रोफाइलमा भर्ने
    if (meUser) {
        if (document.getElementById('meFirstName')) document.getElementById('meFirstName').innerText = meUser.firstName;
        if (document.getElementById('meLastName')) document.getElementById('meLastName').innerText = meUser.lastName;
        if (document.getElementById('meEmail')) document.getElementById('meEmail').innerText = meUser.email;
        if (document.getElementById('meDOB')) document.getElementById('meDOB').innerText = meUser.dob || 'Not Provided';
    }

    // ३. फोटो सम्बन्धी कन्डिसन चेक गर्ने (प्रोफाइल र ड्यासबोर्ड दुवैको लागि)
    if (savedAvatar) {
        // क) यदि फोटो पहिले नै सेभ छ भने दुवै ठाउँमा देखाउने र अक्षर/टेक्स्ट लुकाउने
        if (avatarBox) avatarBox.style.backgroundImage = `url('${savedAvatar}')`;
        if (initialSpan) initialSpan.style.display = 'none';

        if (dbAvatar) dbAvatar.style.backgroundImage = `url('${savedAvatar}')`;
        if (dbText) dbText.style.display = 'none';
        
        // Navbar avatar मा पनि फोटो देखाउने
        const navbarAvatar = document.getElementById('navbarAvatar');
        const navbarInitial = document.getElementById('navbarAvatarInitial');
        if (navbarAvatar) navbarAvatar.style.backgroundImage = `url('${savedAvatar}')`;
        if (navbarInitial) navbarInitial.style.display = 'none';
    } else {
        // ख) यदि फोटो छैन भने प्रोफाइल बक्समा नामको पहिलो अक्षर देखाउने
        if (meUser && meUser.firstName && initialSpan) {
            const firstLetter = meUser.firstName.charAt(0).toUpperCase();
            initialSpan.innerText = firstLetter;
            initialSpan.style.display = 'block';
        }
        // ड्यासबोर्डमा डिफ्लोट टेक्स्ट देखाउने
        if (dbText) dbText.style.display = 'block';
        
        // Navbar avatar मा नामको पहिलो अक्षर देखाउने
        if (meUser && meUser.firstName) {
            const navbarInitial = document.getElementById('navbarAvatarInitial');
            const firstLetter = meUser.firstName.charAt(0).toUpperCase();
            if (navbarInitial) {
                navbarInitial.innerText = firstLetter;
                navbarInitial.style.display = 'block';
            }
        }
    }
}

// ४. मेनु क्लिक गर्दा कुन सेक्सन देखाउने/लुकाउने लजिक
const homeBlock = document.querySelector('.hero'); 
const meBlock = document.getElementById('meSection');

function checkView() {
    if (window.location.hash === '#me') {
        if (homeBlock) homeBlock.style.display = 'none';
        if (meBlock) meBlock.style.display = 'block';
    } else if (window.location.hash === '#finance') {
        if (homeBlock) homeBlock.style.display = 'none';
        if (meBlock) meBlock.style.display = 'none';
    } else {
        if (homeBlock) homeBlock.style.display = 'block';
        if (meBlock) meBlock.style.display = 'none';
    }
}

// ५. नयाँ फोटो अपलोड गर्ने बित्तिकै दुवै ठाउँमा तुरुन्तै सेभ र अपडेट गर्ने इभेन्ट
const avatarUploadInput = document.getElementById('avatarUpload');
if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;

            // LocalStorage मा फोटो सुरक्षित गर्ने
            localStorage.setItem('wealthOS_userAvatar', base64Image);

            // क) प्रोफाइल सेक्सन तुरुन्तै अपडेट गर्ने
            const avatarBox = document.getElementById('meAvatar');
            const initialSpan = document.getElementById('avatarInitial');
            if (avatarBox) avatarBox.style.backgroundImage = `url('${base64Image}')`;
            if (initialSpan) initialSpan.style.display = 'none';

            // ख) ड्यासबोर्ड (होम पेज) को बक्स पनि तुरुन्तै स्क्वायरमा अपडेट गर्ने
            const dbAvatar = document.getElementById('dashboardAvatar');
            const dbText = document.getElementById('dashboardText');
            if (dbAvatar) dbAvatar.style.backgroundImage = `url('${base64Image}')`;
            if (dbText) dbText.style.display = 'none';
            
            // ग) Navbar avatar पनि अपडेट गर्ने
            const navbarAvatar = document.getElementById('navbarAvatar');
            const navbarInitial = document.getElementById('navbarAvatarInitial');
            if (navbarAvatar) navbarAvatar.style.backgroundImage = `url('${base64Image}')`;
            if (navbarInitial) navbarInitial.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
}

// इभेन्ट लिसनरहरू: पेज लोड हुँदा र ह्यास चेन्ज हुँदा चल्ने
window.addEventListener('hashchange', checkView);
window.addEventListener('DOMContentLoaded', () => {
    checkView();
    loadProfileAndPhotos(); // फोटो र प्रोफाइल लोड गराउने फङ्सन कल गरेको
    
    // Navbar avatar मा क्लिक गर्दा Me सेक्सनमा जाने
    const navbarAvatar = document.getElementById('navbarAvatar');
    if (navbarAvatar) {
        navbarAvatar.addEventListener('click', () => {
            window.location.hash = '#me';
        });
    }
});