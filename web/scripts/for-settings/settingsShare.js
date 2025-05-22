// settingsShare.js
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '40px';
    notification.style.right = '30px';
    notification.style.padding = '10px 20px';
    notification.style.background = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.color = 'white';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.textContent = message;
   
    const existing = document.querySelector('.ag-grid-notification');
    if (existing) existing.remove();
   
    notification.classList.add('ag-grid-notification');
    document.body.appendChild(notification);
   
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function loadData() {
    const mockData = [
        { isChosen: false, name: "Товар 1", quantity: 10, price: 100 },
        { isChosen: false, name: "Товар 2", quantity: 5, price: 200 },
        { isChosen: false, name: "Товар 3", quantity: 8, price: 150 },
        { isChosen: false, name: "Товар 4", quantity: 10, price: 100 },
        { isChosen: false, name: "Товар 5", quantity: 5, price: 200 },
    ];
    return mockData;
}

// Унифицированная функция сохранения всех данных
async function saveAllData() {
    try {
        // 1. Собираем данные из всех таблиц
        const allData = {
            enabledPages: getEnabledPagesData(),
            objectTypes: getObjectTypesData(),
            representations: getRepresentationsData(),
            components: getComponentsData()
        };

        // 2. Форматируем данные для сервера
        const formattedData = formatDataForServer(allData);

        // 3. Отправляем на сервер
        const response = await fetch('http://127.0.0.1:8080/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Сервер ответил:', result);
        showNotification('Все данные успешно сохранены', 'success');
        return result;

    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showNotification(`Ошибка сохранения: ${error.message}`, 'error');
        throw error;
    }
}

// Вспомогательные функции для сбора данных
function getEnabledPagesData() {
    if (!window.gridApi1) return [];
    const data = [];
    window.gridApi1.forEachNode(node => data.push(node.data));
    return data;
}

function getObjectTypesData() {
    const data = {};
    for (let i = 1; i <= 12; i++) {
        if (window.objectTypeGrids && window.objectTypeGrids[i]) {
            const tableData = [];
            window.objectTypeGrids[i].forEachNode(node => tableData.push(node.data));
            data[`objectType_${i}`] = tableData;
        }
    }
    return data;
}

function getRepresentationsData() {
    const data = {};
    for (let i = 1; i <= 7; i++) {
        if (window.representationGrids && window.representationGrids[i]) {
            const tableData = [];
            window.representationGrids[i].forEachNode(node => tableData.push(node.data));
            data[`representation_${i}`] = tableData;
        }
    }
    return data;
}

function getComponentsData() {
    const data = {};
    for (let repId = 1; repId <= 7; repId++) {
        for (let compId = 1; compId <= 5; compId++) {
            const key = `${repId}_${compId}`;
            if (window.componentGrids && window.componentGrids[key]) {
                const tableData = [];
                window.componentGrids[key].forEachNode(node => tableData.push(node.data));
                data[`component_${key}`] = tableData;
            }
        }
    }
    return data;
}

function formatDataForServer(data) {
    const message = {
        ObjectTypes: [],
        Views: [],
        AdditionalData: {
            objectTypes: data.objectTypes,
            representations: data.representations,
            components: data.components
        }
    };

// Форматирование данных доступных страниц
if (data.enabledPages && data.enabledPages.length > 0) {
    for (let i = 0; i < Math.min(12, data.enabledPages.length); i++) {
        message.ObjectTypes.push({
            name: (data.enabledPages[i].name === `тип объекта ${i+1}`) ? null : data.enabledPages[i].name,
            enabled: data.enabledPages[i].enabled
        });
    }

    for (let i = 0; i < Math.min(7, Math.floor((data.enabledPages.length - 12) / 6)); i++) {
        const viewIndex = 12 + i * 6;
        if (viewIndex < data.enabledPages.length) {
            message.Views.push({
                name: (data.enabledPages[viewIndex].name === `Представление ${i+1}`) ? null : data.enabledPages[viewIndex].name,
                enabled: data.enabledPages[viewIndex].enabled,
                Components: []
            });

            for (let j = 1; j <= 5; j++) {
                const compIndex = viewIndex + j;
                if (compIndex < data.enabledPages.length) {
                    message.Views[i].Components.push({
                        name: (data.enabledPages[compIndex].name === `Компонент ${i+1}.${j}`) ? null : data.enabledPages[compIndex].name,
                        enabled: data.enabledPages[compIndex].enabled
                    });
                }
            }
        }
    }
    return message;
    }
}
// // Функция для отображения настроек
// function showSettingsOfEnabled(enabledData) {
//     const divSettings2 = document.getElementById("gridContainer2");
//     let display = enabledData && enabledData[0] && enabledData[0].enabled ? "block" : "none";
//     if (divSettings2) divSettings2.style.display = display;
// }

// Add this to settingsShare.js
function generateFirstJSON() {
    const enabledData = getEnabledPagesData();
    const componentsData = getComponentsData();
    const representationsData = getRepresentationsData();
    
    const result = {
        ObjectTypes: [],
        Views: []
    };

    // Process ObjectTypes - get names from input fields
    for (let i = 1; i <= 12; i++) {
        const nameInput = document.getElementById(`name${i}`);
        const nameValue = nameInput ? nameInput.value : null;
        
        // Check if we have corresponding enabled data
        const enabledStatus = enabledData[i-1] ? enabledData[i-1].enabled : false;
        
        result.ObjectTypes.push({
            name: nameValue || null,
            enabled: enabledStatus
        });
    }

    // Process Views and Components
    for (let viewNum = 1; viewNum <= 7; viewNum++) {
        const viewIndex = 12 + (viewNum - 1) * 6;
        if (viewIndex >= enabledData.length) break;

        // Get view name from representation table (fieldType column)
        let viewName = null;
        let viewCode = null;
        if (representationsData[`representation_${viewNum}`]) {
            const viewData = representationsData[`representation_${viewNum}`];
            const formNameRow = viewData.find(row => row.id === 'form_name');
            if (formNameRow) {
                viewName = formNameRow.fieldType || null;
            }
            const formCodeRow = viewData.find(row => row.id === 'form_code');
            if (formCodeRow) {
                viewCode = formCodeRow.fieldType || null;
            }
        }

        const view = {
            name: viewName,
            code: viewCode, // Added code field
            enabled: enabledData[viewIndex].enabled,
            Components: []
        };

        // Add components (5 per view)
        for (let compNum = 1; compNum <= 5; compNum++) {
            const compIndex = viewIndex + compNum;
            if (compIndex >= enabledData.length) break;

            const componentKey = `${viewNum}_${compNum}`;
            const componentData = componentsData[`component_${componentKey}`] || [];
            
            // Get component name and code from component table
            let componentName = null;
            let componentCode = null;
            const nameRow = componentData.find(row => row.id === 'component_name');
            if (nameRow) {
                componentName = nameRow.fieldType || null;
            }
            const codeRow = componentData.find(row => row.id === 'component_code');
            if (codeRow) {
                componentCode = codeRow.fieldType || null;
            }

            // Find headers data from component table
            const headers = componentData
                .filter(item => item.id.includes('column'))
                .map(item => ({
                    header: item.element,
                    type: item.fieldType.toLowerCase().includes('число') ? 'num' : 'string',
                    maxSmth: item.size === '-' ? undefined : parseInt(item.size),
                    name: item.id,
                    enabled: item.flagEnabled
                }));

            view.Components.push({
                name: componentName,
                enabled: enabledData[compIndex].enabled,
                code: componentCode,
                headers: headers.length > 0 ? headers : undefined
            });
        }

        result.Views.push(view);
    }

    return result;
}

function saveSettingsToStorage() {
    try {
        // Get data from all tables
        const allData = {
            enabledPages: getEnabledPagesData(),
            objectTypes: {},
            representations: {},
            components: {},
            objectTypeNames: {}
        };

        // Save object type names from input fields
        for (let i = 1; i <= 12; i++) {
            const nameInput = document.getElementById(`name${i}`);
            if (nameInput) {
                allData.objectTypeNames[`objectType_${i}`] = nameInput.value;
            }
        }

        // Save object type tables data
        for (let i = 1; i <= 12; i++) {
            if (window.objectTypeGrids && window.objectTypeGrids[i]) {
                const tableData = [];
                window.objectTypeGrids[i].forEachNode(node => tableData.push(node.data));
                allData.objectTypes[`objectType_${i}`] = tableData;
            }
        }

        // Save representation tables data
        for (let i = 1; i <= 7; i++) {
            if (window.representationGrids && window.representationGrids[i]) {
                const tableData = [];
                window.representationGrids[i].forEachNode(node => tableData.push(node.data));
                allData.representations[`representation_${i}`] = tableData;
            }
        }

        // Save component tables data
        for (let repId = 1; repId <= 7; repId++) {
            for (let compId = 1; compId <= 5; compId++) {
                const key = `${repId}_${compId}`;
                if (window.componentGrids && window.componentGrids[key]) {
                    const tableData = [];
                    window.componentGrids[key].forEachNode(node => tableData.push(node.data));
                    allData.components[`component_${key}`] = tableData;
                }
            }
        }

        // Save to sessionStorage
        sessionStorage.setItem('allSettingsData', JSON.stringify(allData));
        console.log('All settings data saved to sessionStorage');
        showNotification('Настройки сохранены', 'success');
        
        // Also save the JSON formats if needed
        sessionStorage.setItem('JSONSettings1', JSON.stringify(generateFirstJSON()));
        sessionStorage.setItem('JSONSettings2', JSON.stringify(generateSecondJSON()));
        sessionStorage.setItem('JSONSettings3', JSON.stringify(generateThirdJSON()));
        
        return true;
    } catch (e) {
        console.error('Ошибка сохранения в sessionStorage:', e);
        showNotification('Ошибка сохранения настроек', 'error');
        return false;
    }
}

function loadSettingsFromStorage() {
    try {
        return {
            json1: JSON.parse(sessionStorage.getItem('JSONSettings1') || 'null'),
            json2: JSON.parse(sessionStorage.getItem('JSONSettings2') || 'null'),
            json3: JSON.parse(sessionStorage.getItem('JSONSettings3') || 'null')
        };
    } catch (e) {
        console.error('Ошибка загрузки из sessionStorage:', e);
        return { json1: null, json2: null, json3: null };
    }
}

function getAllTableData() {
    const allData = {
        enabledPages: getEnabledPagesData(),
        objectTypes: {},
        representations: {},
        components: {},
        objectTypeNames: {}
    };

    // Get object type names from input fields
    for (let i = 1; i <= 12; i++) {
        const nameInput = document.getElementById(`name${i}`);
        if (nameInput) {
            allData.objectTypeNames[`objectType_${i}`] = nameInput.value;
        }
    }

    // Get object type tables data
    for (let i = 1; i <= 12; i++) {
        if (window.objectTypeGrids && window.objectTypeGrids[i]) {
            const tableData = [];
            window.objectTypeGrids[i].forEachNode(node => tableData.push(node.data));
            allData.objectTypes[`objectType_${i}`] = tableData;
        }
    }

    // Get representation tables data
    for (let i = 1; i <= 7; i++) {
        if (window.representationGrids && window.representationGrids[i]) {
            const tableData = [];
            window.representationGrids[i].forEachNode(node => tableData.push(node.data));
            allData.representations[`representation_${i}`] = tableData;
        }
    }

    // Get component tables data
    for (let repId = 1; repId <= 7; repId++) {
        for (let compId = 1; compId <= 5; compId++) {
            const key = `${repId}_${compId}`;
            if (window.componentGrids && window.componentGrids[key]) {
                const tableData = [];
                window.componentGrids[key].forEachNode(node => tableData.push(node.data));
                allData.components[`component_${key}`] = tableData;
            }
        }
    }

    return allData;
}

function restoreTableData(savedData) {
    if (!savedData) return false;

    // Restore object type names
    for (let i = 1; i <= 12; i++) {
        const nameInput = document.getElementById(`name${i}`);
        if (nameInput && savedData.objectTypeNames && savedData.objectTypeNames[`objectType_${i}`]) {
            nameInput.value = savedData.objectTypeNames[`objectType_${i}`];
        }
    }

    // Restore object type tables data
    for (let i = 1; i <= 12; i++) {
        if (window.objectTypeGrids && window.objectTypeGrids[i] && savedData.objectTypes && savedData.objectTypes[`objectType_${i}`]) {
            window.objectTypeGrids[i].setGridOption('rowData', savedData.objectTypes[`objectType_${i}`]);
        }
    }

    // Restore representation tables data
    for (let i = 1; i <= 7; i++) {
        if (window.representationGrids && window.representationGrids[i] && savedData.representations && savedData.representations[`representation_${i}`]) {
            window.representationGrids[i].setGridOption('rowData', savedData.representations[`representation_${i}`]);
        }
    }

    // Restore component tables data
    for (let repId = 1; repId <= 7; repId++) {
        for (let compId = 1; compId <= 5; compId++) {
            const key = `${repId}_${compId}`;
            if (window.componentGrids && window.componentGrids[key] && savedData.components && savedData.components[`component_${key}`]) {
                window.componentGrids[key].setGridOption('rowData', savedData.components[`component_${key}`]);
            }
        }
    }

    return true;
}