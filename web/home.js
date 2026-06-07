// १. कुन युजर लगइन भएको छ पत्ता लगाउने
        const currentUser = JSON.parse(localStorage.getItem('wealthOS_currentUser'));

        // सुरक्षा जाँच: लगइन नगरी कसैले सिधै यो पेज खोल्न खोजेमा बाहिर धपाइदिने
        if (!currentUser) {
            alert("कृपया पहिले लगइन गर्नुहोस्!");
            window.location.href = "index.html";
        } else {
            // लगइन भएको युजरको वास्तविक नाम न्याभबारमा देखाउने
            document.getElementById('welcomeUser').innerText = `Hello, ${currentUser.firstName}! 👋`;
        }

        // २. Logout प्रोसेस
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('wealthOS_currentUser');
            alert("हजुर सफलतापूर्वक लगआउट हुनुभयो।");
            window.location.href = "index.html"; // मुख्य पेजमा फिर्ता पठाउने
        });

    
