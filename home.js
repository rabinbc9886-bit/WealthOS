// १. कुन युजर लगइन भएको छ पत्ता लगाउने
        const currentUser = JSON.parse(localStorage.getItem('wealthOS_currentUser'));

        // सुरक्षा जाँच: लगइन नगरी कसैले सिधै यो पेज खोल्न खोजेमा बाहिर धपाइदिने
        if (!currentUser) {
            alert("कृपया पहिले लगइन गर्नुहोस्!");
            window.location.href = "index.html";
        }   
        

    