// ============================================
// WEALTHOS - COMPLETE FINANCE LOGIC (finance.js)
// ============================================

// १. पेज राउटीङ
function handleFinanceView() {
    const hash = window.location.hash;
    const homeSection = document.getElementById('homeSection');
    const financeSection = document.getElementById('financeSection');
    const assetDetailSection = document.getElementById('assetDetailSection');
    const meSection = document.getElementById('meSection');

    if (homeSection) homeSection.style.display = 'none';
    if (financeSection) financeSection.style.display = 'none';
    if (assetDetailSection) assetDetailSection.style.display = 'none';
    if (meSection) meSection.style.display = 'none';

    if (hash === '#finance') {
        if (financeSection) financeSection.style.display = 'block';
        renderFinanceTracker();
    } else if (hash === '#me') {
        if (meSection) meSection.style.display = 'block';
    } else {
        if (homeSection) homeSection.style.display = 'block';
    }
}
window.addEventListener('hashchange', handleFinanceView);
window.addEventListener('DOMContentLoaded', handleFinanceView);
window.addEventListener('DOMContentLoaded', () => {
    renderFinanceTracker();

    const saveButton = document.getElementById('saveAssetBtn');
    if (saveButton) saveButton.addEventListener('click', saveAsset);

    const assetSelect = document.getElementById('assetCategorySelect');
    if (assetSelect) {
        assetSelect.addEventListener('change', toggleCustomCategoryInput);
        toggleCustomCategoryInput();
    }
});

// २. मुख्य ट्र्याकर
function getSavedAssets() {
    return JSON.parse(localStorage.getItem('wealthOS_assets') || JSON.stringify([
        { id: 'ast_1', category: 'Cash & Liquidity', investment: 0, current: 0 },
        { id: 'ast_2', category: 'Total Shares Value', investment: 0, current: 0 },
        { id: 'ast_3', category: 'Gold/Silver', investment: 0, current: 0 },
        { id: 'ast_4', category: 'Land', investment: 0, current: 0 },
        { id: 'ast_5', category: 'Liabilities', investment: 0, current: 0 }
    ]));
}

function renderFinanceTracker() {
    const tbody = document.getElementById('financeTableBody');
    if (!tbody) return;
    const assets = getSavedAssets();
    tbody.innerHTML = '';
    let totalNetWorth = 0;

    assets.forEach(asset => {
        const currentValue = Number(asset.current);
        // Exclude liabilities from total net worth: only sum non-liability current values
        if (!(asset.category === 'Liabilities' || asset.category.toLowerCase().includes('liability'))) {
            totalNetWorth += currentValue;
        }
        const displayCategory = asset.category === 'Gold' ? 'Gold/Silver' : asset.category;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td onclick="openDetailView('${asset.category}')" style="cursor:pointer; color: #198754; font-weight: bold; text-decoration: underline;">${displayCategory}</td>
            <td>Rs. ${Number(asset.investment).toFixed(2)}</td>
            <td>Rs. ${Number(asset.current).toFixed(2)}</td>
            <td>Rs. ${(asset.current - asset.investment).toFixed(2)}</td>
            <td><button onclick="removeAssetItem('${asset.id}')">🗑️</button></td>
        `;
        tbody.appendChild(row);
    });
    const totalNetWorthElement = document.getElementById('finTotalNetWorth');
    if (totalNetWorthElement) {
        totalNetWorthElement.innerText = `Rs. ${totalNetWorth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
    updateSummaryTable(assets);
}

function updateSummaryTable(assets) {
    let totalLiabilities = 0;
    let totalInvestment = 0;
    let totalCurrent = 0;

    assets.forEach(asset => {
        if (asset.category === 'Liabilities' || asset.category.toLowerCase().includes('liability')) {
            totalLiabilities += Number(asset.current);
        } else {
            totalInvestment += Number(asset.investment);
            totalCurrent += Number(asset.current);
        }
    });

    const totalPL = totalCurrent - totalInvestment;
    const totalNetProfit = totalPL - totalLiabilities;

    document.getElementById('summaryTotalLiabilities').innerText = `Rs. ${totalLiabilities.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('summaryTotalInvestment').innerText = `Rs. ${totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('summaryTotalCurrent').innerText = `Rs. ${totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('summaryTotalPL').innerText = `Rs. ${totalPL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('summaryNetProfit').innerText = `Rs. ${totalNetProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function toggleCustomCategoryInput() {
    const assetSelect = document.getElementById('assetCategorySelect');
    const customGroup = document.getElementById('customCategoryGroup');
    const customInput = document.getElementById('customCategoryInput');
    const investGroup = document.getElementById('assetInvestGroup');
    const currentLabel = document.getElementById('labelCurrentVal');
    
    if (!assetSelect || !customGroup || !customInput) return;

    const isLiability = assetSelect.value === 'Liabilities';
    
    if (isLiability) {
        if (investGroup) investGroup.style.display = 'none';
        if (currentLabel) currentLabel.innerText = 'Current Loan Amount (Rs.)';
    } else {
        if (investGroup) investGroup.style.display = 'block';
        if (currentLabel) currentLabel.innerText = 'Current Value (Rs.)';
    }

    if (assetSelect.value === 'Other') {
        customGroup.style.display = 'block';
        customInput.required = true;
    } else {
        customGroup.style.display = 'none';
        customInput.required = false;
    }
}

function saveAsset() {
    const assetSelect = document.getElementById('assetCategorySelect');
    const customInput = document.getElementById('customCategoryInput');
    const investInput = document.getElementById('assetInvestInput');
    const currentInput = document.getElementById('assetCurrentInput');
    if (!assetSelect || !currentInput) return;

    let category = assetSelect.value;
    if (category === 'Other') {
        category = customInput.value.trim();
    }

    const isLiability = category === 'Liabilities';
    const investment = isLiability ? 0 : Number(investInput.value);
    const current = Number(currentInput.value);
    
    if (!category) {
        alert('कृपया Asset को नाम राख्नुहोस्।');
        return;
    }
    if (isNaN(current)) {
        alert('कृपया सही तरिकाले मूल्य भर्नुहोस्।');
        return;
    }
    if (!isLiability && isNaN(investment)) {
        alert('कृपया Investment र Current Value दुवै सही तरिकाले भर्नुहोस्।');
        return;
    }

    const assets = getSavedAssets();
    const existing = assets.find(a => a.category === category);
    if (existing) {
        existing.investment = investment;
        existing.current = current;
    } else {
        assets.push({ id: `ast_${Date.now()}`, category, investment, current });
    }

    localStorage.setItem('wealthOS_assets', JSON.stringify(assets));
    renderFinanceTracker();
    alert('Asset सफलतापूर्वक अपडेट भयो।');
}

window.removeAssetItem = function(assetId) {
    const assets = getSavedAssets().filter(asset => asset.id !== assetId);
    localStorage.setItem('wealthOS_assets', JSON.stringify(assets));
    renderFinanceTracker();
};

// ३. डिटेल पेज लजिक
window.openDetailView = function(category) {
    document.getElementById('financeSection').style.display = 'none';
    document.getElementById('assetDetailSection').style.display = 'block';
    document.getElementById('detailTitle').innerText = category;

    const boxes = ['cashInputBox', 'shareInputBox', 'goldInputBox', 'landInputBox', 'liabilityInputBox'];
    boxes.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = 'none'; });

    const thead = document.getElementById('detailTableHeader');
    const displayCategory = category === 'Gold' ? 'Gold/Silver' : category;

    document.getElementById('detailTitle').innerText = displayCategory;

    if (category === 'Cash & Liquidity') {
        document.getElementById('cashInputBox').style.display = 'flex';
        thead.innerHTML = `<tr><th>Bank</th><th>Invested</th><th>Current Value</th><th>Action</th></tr>`;
        renderDetailTable();
    } else if (category === 'Total Shares Value') {
        document.getElementById('shareInputBox').style.display = 'flex';
        thead.innerHTML = `<tr><th>Buy Date</th><th>Stock</th><th>Sector</th><th>Units</th><th>Buy Price</th><th>Current Price</th><th>Invested Amt</th><th>Current Value</th><th>P/L</th><th>Action</th></tr>`;
        renderShareDetailTable();
    } else if (category === 'Gold' || category === 'Gold/Silver') {
        document.getElementById('goldInputBox').style.display = 'flex';
        thead.innerHTML = `<tr><th>Date</th><th>Type</th><th>Weight</th><th>Inv</th><th>Rate (per gram)</th><th>Curr</th><th>P/L</th><th>Action</th></tr>`;
        renderGoldDetailTable();
    } else if (category === 'Land') {
        document.getElementById('landInputBox').style.display = 'flex';
        thead.innerHTML = `<tr><th>Plot</th><th>Location</th><th>Inv</th><th>Curr</th><th>P/L</th><th>Action</th></tr>`;
        renderLandDetailTable();
    } else if (category === 'Liabilities') {
        document.getElementById('liabilityInputBox').style.display = 'flex';
        thead.innerHTML = `<tr><th>Loan Name</th><th>Loan Type</th><th>Total Loan Amount</th><th>Remaining Balance</th><th>Interest Rate</th><th>Monthly EMI</th><th>Start Date</th><th>End Date</th><th>Action</th></tr>`;
        renderLiabilityDetailTable();
    }
};

window.backToFinance = function() {
    document.getElementById('assetDetailSection').style.display = 'none';
    document.getElementById('financeSection').style.display = 'block';
};

// --- बैंक लजिक (Cash & Liquidity) ---
window.addBankDetail = function() {
    const bank = document.getElementById('bankNameInput').value;
    const inv = Number(document.getElementById('investInput').value);
    const current = Number(document.getElementById('interestInput').value);
    if (!bank || !inv || !current) return alert("सबै विवरण भर्नुहोस्!");

    let data = JSON.parse(localStorage.getItem('bank_details') || '[]');
    data.push({ bank, inv, current });
    localStorage.setItem('bank_details', JSON.stringify(data));
    updateMainNetWorth('Cash & Liquidity', data);
    renderDetailTable();
};

window.renderDetailTable = function() {
    const tbody = document.getElementById('detailTableBody');
    const data = JSON.parse(localStorage.getItem('bank_details') || '[]');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color: #475569;">कुनै बैंक विवरण हाल भइ सकेको छैन। तलका इनपुटमा बैंक, लगानी र ब्याज भर्नुहोस्।</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        const currentValue = item.current !== undefined ? item.current : item.int;
        tbody.innerHTML += `<tr><td>${item.bank}</td><td>Rs. ${Number(item.inv).toFixed(2)}</td><td>Rs. ${Number(currentValue).toFixed(2)}</td><td><button onclick="deleteBankDetail(${index})">X</button></td></tr>`;
    });
};

window.deleteBankDetail = function(index) {
    let data = JSON.parse(localStorage.getItem('bank_details') || '[]');
    data.splice(index, 1);
    localStorage.setItem('bank_details', JSON.stringify(data));
    updateMainNetWorth('Cash & Liquidity', data);
    renderDetailTable();
};

window.addLiabilityDetail = function() {
    const loanName = document.getElementById('loanNameInput').value.trim();
    const loanType = document.getElementById('loanTypeInput').value.trim();
    const totalLoan = Number(document.getElementById('loanAmountInput').value);
    const remaining = Number(document.getElementById('loanBalanceInput').value);
    const interest = Number(document.getElementById('loanInterestInput').value);
    const emi = Number(document.getElementById('loanEmiInput').value);
    const startDate = document.getElementById('loanStartDateInput').value;
    const endDate = document.getElementById('loanEndDateInput').value;

    if (!loanName || !loanType || !totalLoan || !remaining || isNaN(interest) || isNaN(emi) || !startDate || !endDate) {
        alert('कृपया सबै ऋण विवरण सही रूपमा भर्नुहोस्!');
        return;
    }

    let data = JSON.parse(localStorage.getItem('liability_details') || '[]');
    data.push({ loanName, loanType, totalLoan, remaining, interest, emi, startDate, endDate });
    localStorage.setItem('liability_details', JSON.stringify(data));

    document.getElementById('loanNameInput').value = '';
    document.getElementById('loanTypeInput').value = '';
    document.getElementById('loanAmountInput').value = '';
    document.getElementById('loanBalanceInput').value = '';
    document.getElementById('loanInterestInput').value = '';
    document.getElementById('loanEmiInput').value = '';
    document.getElementById('loanStartDateInput').value = '';
    document.getElementById('loanEndDateInput').value = '';

    updateMainNetWorth('Liabilities', data);
    renderLiabilityDetailTable();
};

window.renderLiabilityDetailTable = function() {
    const tbody = document.getElementById('detailTableBody');
    const data = JSON.parse(localStorage.getItem('liability_details') || '[]');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 20px; color: #475569;">कुनै ऋण विवरण हाल भइ सकेको छैन। तलका इनपुटमा ऋणको जानकारी भर्नुहोस्।</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        tbody.innerHTML += `<tr>
            <td>${item.loanName}</td>
            <td>${item.loanType}</td>
            <td>Rs. ${Number(item.totalLoan).toFixed(2)}</td>
            <td>Rs. ${Number(item.remaining).toFixed(2)}</td>
            <td>${Number(item.interest).toFixed(2)}%</td>
            <td>Rs. ${Number(item.emi).toFixed(2)}</td>
            <td>${item.startDate}</td>
            <td>${item.endDate}</td>
            <td><button onclick="deleteLiability(${index})" style="color:red; cursor:pointer;">X</button></td>
        </tr>`;
    });
};

window.deleteLiability = function(index) {
    let data = JSON.parse(localStorage.getItem('liability_details') || '[]');
    data.splice(index, 1);
    localStorage.setItem('liability_details', JSON.stringify(data));
    updateMainNetWorth('Liabilities', data);
    renderLiabilityDetailTable();
};

// --- अन्य लजिक (Land/Share/Gold) ---

// --- नेटवर्थ अपडेटर ---
function updateMainNetWorth(category, data) {
    let assets = getSavedAssets();
    let asset = assets.find(a => a.category === category);
    if(asset) {
        if (category === 'Cash & Liquidity') {
            asset.investment = data.reduce((sum, item) => sum + Number(item.inv || 0), 0);
            asset.current = data.reduce((sum, item) => sum + Number(item.current ?? item.int ?? 0), 0);
        } else if (category === 'Total Shares Value') {
            asset.investment = data.reduce((sum, item) => sum + Number(item.invested || (item.units * item.buyPrice) || 0), 0);
            asset.current = data.reduce((sum, item) => sum + Number(item.current || (item.units * item.currPrice) || 0), 0);
        } else if (category === 'Gold' || category === 'Gold/Silver') {
            asset.investment = data.reduce((sum, item) => sum + Number(item.inv), 0);
            asset.current = data.reduce((sum, item) => sum + Number(item.currVal), 0);
        } else if (category === 'Land') {
            asset.investment = data.reduce((sum, item) => sum + Number(item.inv), 0);
            asset.current = data.reduce((sum, item) => sum + Number(item.val), 0);
        } else if (category === 'Liabilities') {
            asset.investment = 0;
            asset.current = data.reduce((sum, item) => sum + Number(item.remaining || 0), 0);
        }
        // थप कैटेगरीको लागि यहाँ थप्दै जानुहोस्
        localStorage.setItem('wealthOS_assets', JSON.stringify(assets));
        renderFinanceTracker();
    }
}

window.toggleManageSection = function() {
    const section = document.getElementById('manageAssetSection');
    if (section) {
        section.style.display = (section.style.display === 'none' || section.style.display === '') ? 'block' : 'none';
    } else {
        console.error("manageAssetSection ID भेटिएन!");
    }
};

window.addShareDetail = function() {
    const date = document.getElementById('shareDate').value;
    const stock = document.getElementById('shareStock').value;
    const sector = document.getElementById('shareSector').value;
    const units = Number(document.getElementById('shareUnits').value);
    const buyPrice = Number(document.getElementById('shareBuyPrice').value);
    const currPrice = Number(document.getElementById('shareCurrPrice').value);

    if (!date || !stock || !sector || !units || !buyPrice || !currPrice) {
        alert("कृपया सबै विवरण भर्नुहोस्!");
        return;
    }

    const invested = units * buyPrice;
    const current = units * currPrice;
    const pl = current - invested;

    let data = JSON.parse(localStorage.getItem('share_details') || '[]');
    data.push({ date, stock, sector, units, buyPrice, currPrice, invested, current, pl });
    localStorage.setItem('share_details', JSON.stringify(data));

    document.getElementById('shareDate').value = '';
    document.getElementById('shareStock').value = '';
    document.getElementById('shareSector').value = '';
    document.getElementById('shareUnits').value = '';
    document.getElementById('shareBuyPrice').value = '';
    document.getElementById('shareCurrPrice').value = '';

    updateMainNetWorth('Total Shares Value', data);
    renderShareDetailTable();
};

window.renderShareDetailTable = function() {
    const tbody = document.getElementById('detailTableBody');
    const data = JSON.parse(localStorage.getItem('share_details') || '[]');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10">शेयर विवरण यहाँ आउनेछ...</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        tbody.innerHTML += `<tr>
            <td>${item.date}</td>
            <td>${item.stock}</td>
            <td>${item.sector}</td>
            <td>${item.units}</td>
            <td>Rs. ${Number(item.buyPrice).toFixed(2)}</td>
            <td>Rs. ${Number(item.currPrice).toFixed(2)}</td>
            <td>Rs. ${Number(item.invested).toFixed(2)}</td>
            <td>Rs. ${Number(item.current).toFixed(2)}</td>
            <td>Rs. ${Number(item.pl).toFixed(2)}</td>
            <td><button onclick="deleteShare(${index})" style="color:red;">X</button></td>
        </tr>`;
    });
};

window.deleteShare = function(index) {
    let data = JSON.parse(localStorage.getItem('share_details') || '[]');
    data.splice(index, 1);
    localStorage.setItem('share_details', JSON.stringify(data));
    updateMainNetWorth('Total Shares Value', data);
    renderShareDetailTable();
};

window.addGoldDetail = function() {
    const date = document.getElementById('goldDate').value;
    const type = document.getElementById('goldType').value;
    const weight = Number(document.getElementById('goldWeight').value);
    const inv = Number(document.getElementById('goldInvest').value);
    const rate = Number(document.getElementById('goldRate').value);

    if (!type || !weight || !inv || !rate) {
        alert("कृपया सबै विवरण भर्नुहोस्!");
        return;
    }

    const ratePerGram = Number(rate) / 11.664;
    const currVal = weight * ratePerGram;
    const pl = currVal - inv;

    let goldData = JSON.parse(localStorage.getItem('gold_details') || '[]');
    goldData.push({ date, type, weight, inv, rate, ratePerGram, currVal, pl });
    localStorage.setItem('gold_details', JSON.stringify(goldData));

    document.getElementById('goldDate').value = '';
    document.getElementById('goldType').value = '';
    document.getElementById('goldWeight').value = '';
    document.getElementById('goldInvest').value = '';
    document.getElementById('goldRate').value = '';

    updateMainNetWorth('Gold', goldData);
    renderGoldDetailTable();
};

window.renderGoldDetailTable = function() {
    const tbody = document.getElementById('detailTableBody');
    const data = JSON.parse(localStorage.getItem('gold_details') || '[]');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">सुनको विवरण यहाँ आउनेछ...</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        const ratePerGram = item.ratePerGram ?? (Number(item.rate) / 11.664);
        const currentValue = item.currVal ?? (Number(item.weight) * ratePerGram);
        tbody.innerHTML += `<tr>
            <td>${item.date}</td>
            <td>${item.type}</td>
            <td>${item.weight} g</td>
            <td>Rs. ${Number(item.inv).toFixed(2)}</td>
            <td>Rs. ${Number(ratePerGram).toFixed(2)}</td>
            <td>Rs. ${Number(currentValue).toFixed(2)}</td>
            <td>Rs. ${Number(item.pl).toFixed(2)}</td>
            <td><button onclick="deleteGold(${index})" style="color:red; cursor:pointer;">X</button></td>
        </tr>`;
    });
};

window.deleteGold = function(index) {
    let data = JSON.parse(localStorage.getItem('gold_details') || '[]');
    data.splice(index, 1);
    localStorage.setItem('gold_details', JSON.stringify(data));
    updateMainNetWorth('Gold', data);
    renderGoldDetailTable();
};

window.addLandDetail = function() {
    const plotNo = document.getElementById('landPlotNo').value;
    const location = document.getElementById('landLocation').value;
    const inv = Number(document.getElementById('landInvest').value);
    const val = Number(document.getElementById('landCurrVal').value);

    if (!plotNo || !location || !inv || !val) {
        alert("कृपया सबै विवरण भर्नुहोस्!");
        return;
    }

    const pl = val - inv;
    let data = JSON.parse(localStorage.getItem('land_details') || '[]');
    data.push({ plotNo, location, inv, val, pl });
    localStorage.setItem('land_details', JSON.stringify(data));

    document.getElementById('landPlotNo').value = '';
    document.getElementById('landLocation').value = '';
    document.getElementById('landInvest').value = '';
    document.getElementById('landCurrVal').value = '';

    updateMainNetWorth('Land', data);
    renderLandDetailTable();
};

window.renderLandDetailTable = function() {
    const tbody = document.getElementById('detailTableBody');
    const data = JSON.parse(localStorage.getItem('land_details') || '[]');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: #475569;">कुनै जग्गा विवरण हाल भइ सकेको छैन। तलका इनपुटमा प्लट नम्बर, स्थान, लगानी र वर्तमान मूल्य भर्नुहोस्।</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        tbody.innerHTML += `<tr>
            <td>${item.plotNo}</td>
            <td>${item.location}</td>
            <td>Rs. ${Number(item.inv).toFixed(2)}</td>
            <td>Rs. ${Number(item.val).toFixed(2)}</td>
            <td>Rs. ${Number(item.pl).toFixed(2)}</td>
            <td><button onclick="deleteLand(${index})" style="color:red; cursor:pointer;">X</button></td>
        </tr>`;
    });
};

window.deleteLand = function(index) {
    let data = JSON.parse(localStorage.getItem('land_details') || '[]');
    data.splice(index, 1);
    localStorage.setItem('land_details', JSON.stringify(data));
    updateMainNetWorth('Land', data);
    renderLandDetailTable();
};