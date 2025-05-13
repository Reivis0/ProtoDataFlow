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
// Функция для отображения настроек
function showSettingsOfEnabled(enabledData) {
    const divSettings2 = document.getElementById("gridContainer2");
    let display = enabledData && enabledData[0] && enabledData[0].enabled ? "block" : "none";
    if (divSettings2) divSettings2.style.display = display;
}