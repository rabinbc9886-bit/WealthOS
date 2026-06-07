function getDocumentStorageKey() {
    const currentUser = JSON.parse(localStorage.getItem('wealthOS_currentUser'));
    if (!currentUser) {
        alert('कृपया पहिले लगइन गर्नुहोस्!');
        window.location.href = 'index.html';
        return null;
    }
    return `wealthOS_userDocuments_${currentUser.email}`;
}

function loadDocuments() {
    const storageKey = getDocumentStorageKey();
    if (!storageKey) return [];

    const savedDocs = localStorage.getItem(storageKey);
    try {
        return savedDocs ? JSON.parse(savedDocs) : [];
    } catch (error) {
        console.error('Failed to parse saved documents', error);
        return [];
    }
}

function saveDocuments(documents) {
    const storageKey = getDocumentStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(documents));
}

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function loadNavbarAvatar() {
    const currentUser = JSON.parse(localStorage.getItem('wealthOS_currentUser'));
    const savedAvatar = localStorage.getItem('wealthOS_userAvatar');
    const navbarAvatar = document.getElementById('navbarAvatar');
    const navbarInitial = document.getElementById('navbarAvatarInitial');

    if (!navbarAvatar || !navbarInitial) return;

    if (savedAvatar) {
        navbarAvatar.style.backgroundImage = `url('${savedAvatar}')`;
        navbarInitial.style.display = 'none';
    } else if (currentUser && currentUser.firstName) {
        navbarAvatar.style.backgroundImage = 'none';
        navbarInitial.innerText = currentUser.firstName.charAt(0).toUpperCase();
        navbarInitial.style.display = 'block';
    }

    navbarAvatar.addEventListener('click', () => {
        window.location.href = 'home.html#me';
    });
}

function renderDocuments() {
    const documents = loadDocuments();
    const list = document.getElementById('documentsList');
    const count = document.getElementById('documentCount');
    const emptyState = document.getElementById('emptyState');

    if (!list || !count || !emptyState) return;

    list.innerHTML = '';
    count.innerText = `${documents.length} document${documents.length === 1 ? '' : 's'}`;

    if (documents.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    documents.forEach((doc) => {
        const card = document.createElement('div');
        card.className = 'doc-card';

        const preview = document.createElement('img');
        preview.className = 'doc-preview';
        preview.src = doc.dataUrl;
        preview.alt = doc.name;

        const info = document.createElement('div');
        info.className = 'doc-info';
        info.innerHTML = `<strong>${doc.name}</strong>
            <span>${doc.category || 'Other'} • ${formatFileSize(doc.size)}</span>
            <span>Uploaded: ${new Date(doc.uploadedAt).toLocaleString()}</span>`;

        const actions = document.createElement('div');
        actions.className = 'doc-actions';
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-doc-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            deleteDocument(doc.id);
        });
        actions.appendChild(deleteBtn);

        card.appendChild(preview);
        card.appendChild(info);
        card.appendChild(actions);
        list.appendChild(card);
    });
}

function addDocuments(files) {
    const storageKey = getDocumentStorageKey();
    if (!storageKey) return;

    const existingDocuments = loadDocuments();
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
        alert('कृपया केवल छवि फाइलहरू चयन गर्नुहोस्।');
        return;
    }

    const documentName = document.getElementById('documentName')?.value.trim();
    const documentCategory = document.getElementById('documentCategory')?.value || 'Other';

    const readers = fileArray.map((file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve({
                    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    name: documentName || file.name,
                    category: documentCategory,
                    originalFileName: file.name,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date().toISOString(),
                    dataUrl: reader.result,
                });
            };
            reader.readAsDataURL(file);
        });
    });

    Promise.all(readers).then((newDocs) => {
        const mergedDocuments = [...newDocs, ...existingDocuments];
        saveDocuments(mergedDocuments);
        renderDocuments();
        document.getElementById('documentFiles').value = '';
    });
}

function deleteDocument(id) {
    const documents = loadDocuments();
    const updatedDocs = documents.filter((doc) => doc.id !== id);
    saveDocuments(updatedDocs);
    renderDocuments();
}

function clearAllDocuments() {
    const storageKey = getDocumentStorageKey();
    if (!storageKey) return;
    if (confirm('के तपाइँले सबै दस्तावेजहरू हटाउन चाहनुहुन्छ?')) {
        localStorage.removeItem(storageKey);
        renderDocuments();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (!getDocumentStorageKey()) return;

    const fileInput = document.getElementById('documentFiles');
    const clearButton = document.getElementById('clearDocumentsBtn');
    const nameInput = document.getElementById('documentName');
    const categorySelect = document.getElementById('documentCategory');

    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            addDocuments(event.target.files);
        });
    }

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (!fileInput) return;
            fileInput.value = '';
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            if (!fileInput) return;
            fileInput.value = '';
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', clearAllDocuments);
    }

    loadNavbarAvatar();
    renderDocuments();
});
