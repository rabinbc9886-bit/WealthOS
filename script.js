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