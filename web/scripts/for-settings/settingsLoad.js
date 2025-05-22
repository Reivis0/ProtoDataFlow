window.enabledData = window.enabledData || null;

document.addEventListener('DOMContentLoaded', (e) => {
    let status = sessionStorage.getItem('GlobalLevel');
    if(status !== 'superAdmin') {
        e.preventDefault();
        window.location.href = "log-in.html";
    }
    const settings = loadSettingsFromStorage();
    //const settings = loadSettingsFromStorage();

    if (settings.json1) {
        // If we have saved settings, use them
        enabledData = convertToEnabled(settings.json1);
    } else {
        // Otherwise use mock data
        enabledData = convertToEnabled(tempData());
    }

    // initializeObjectTypeTables();
    // initializeRepresentationTables();
    // initializeComponentTables();

    let gridOptions1 = createGridOptions1(enabledData);
    gridApi1 = agGrid.createGrid(document.querySelector("#myGrid1"), gridOptions1);
    setTimeout( () => {
        initializeAllTablesWithSavedData();
        showSettingsOfEnabled(enabledData);
    }, 100)
    setupButtons1();

    const exitButton = document.createElement('button');
    exitButton.textContent = "Выйти";
    exitButton.classList.add('leave-btn');
    exitButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "log-in.html";
    });
    exitButton.style.position = 'fixed';
    exitButton.style.bottom = '20px';
    exitButton.style.right = '20px';
    exitButton.style.width = "160px";
    exitButton.style.backgroundColor = "white";
    exitButton.style.zIndex = "5";
    
        // Initialize all tables with saved data
    

    document.body.appendChild(exitButton);
    addJSONDownloadButtons();

    setTimeout( () => {
        showNotification("настройки в процессе создания", false)
    }, 1000)

    //   setTimeout( () => {
    //     // console.log("First JSON:", JSON.stringify(generateFirstJSON(), null, 2));
    //     // console.log("Second JSON:", JSON.stringify(generateSecondJSON(), null, 2));
    //     // console.log("Third JSON:", JSON.stringify(generateThirdJSON(), null, 2));   
    //     console.log("First JSON:", generateFirstJSON());
    //     console.log("Second JSON:", generateSecondJSON());
    //     console.log("Third JSON:", generateThirdJSON());   
    // }, 5000)
    setTimeout( () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <div style="height: 120px; width: 100px;" id="adwada">
                <p></p>
                <!-- Гениальное решение чтобы кнопки не закрывали таблицу в самом низу -->
            </div>
            `
        document.getElementById('generalContainer').appendChild(container);
    }, 1000)

});

function addJSONDownloadButtons() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '70px';
    container.style.right = '20px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.zIndex = "5";
    
    const createButton = (label) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.width = "160px";
        btn.style.zIndex = "5";
        btn.addEventListener('click', () => {
        saveSettingsToStorage()
        const meesage = {settings1:  generateFirstJSON(), settings2: generateSecondJSON(), settings3: generateThirdJSON()}
        console.log("First JSON:", meesage.settings1);
        console.log("Second JSON:",  meesage.settings2);
        console.log("Third JSON:",  meesage.settings3);
        //на сервер  
        fetch(ServerAdress+'/settings/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: meesage
            })
        })
        });
        return btn;
    };
    
    container.appendChild(createButton('Применить настройки', generateFirstJSON));
    
    document.body.appendChild(container);
}


// function showSettingsOfEnabled(enabledData) {
//     // Проверяем структуру данных
//     console.log('Enabled Data:', enabledData);
    
//     // Типы объектов (1-12)
//     for (let i = 1; i <= 12; i++) {
//         const container = document.getElementById(`objectTypeGrid${i}`);
//         if (container) {
//             const isEnabled = enabledData[i-1]?.enabled;
//             container.style.display = isEnabled ? 'block' : 'none';
//             console.log(`Тип объекта ${i}:`, isEnabled ? 'visible' : 'hidden');
//         }
//     }

//     // Представления (1-7) ой а так нельзя А КАК МОЖНО Я НИЧЕГО НЕ ПОНИМАЮ
//     for (let i = 1; i <= 7; i++) {
//         const container = document.getElementById(`representationGrid${i}`);
//         if (container) {
//             // Индексы представлений начинаются после 12 типов объектов
//             // Каждое представление имеет 1 + 5 элементов (само представление + 5 компонентов)
//             const viewIndex = 12 + (i-1)*6; // Первый элемент представления
//             const isEnabled = enabledData[viewIndex]?.enabled;
            
//             container.style.display = isEnabled ? 'block' : 'none';
//             console.log(`Представление ${i} (index ${viewIndex}):`, 
//                        isEnabled ? 'visible' : 'hidden');
//         }
//     }
// }
// function showSettingsOfEnabled(enabledData) {
//     // Проверяем структуру данных
//     console.log('Enabled Data:', enabledData);
    
//     // Типы объектов (1-12)
//     for (let i = 1; i <= 12; i++) {
//         const container = document.getElementById(`objectTypeGrid${i}`);
//         if (container) {
//             const isEnabled = enabledData[i-1]?.enabled;
//             container.style.display = isEnabled ? 'block' : 'none';
//             console.log(`Тип объекта ${i}:`, isEnabled ? 'visible' : 'hidden');
//         }
//     }

//     // Представления (1-7) и их компоненты (1-5)
//     for (let i = 1; i <= 7; i++) {
//         const viewIndex = 12 + (i-1)*6; // Индекс представления в enabledData
//         const isViewEnabled = enabledData[viewIndex]?.enabled;
//         const viewContainer = document.getElementById(`representationGrid${i}`);
        
//         // Управление видимостью представления
//         if (viewContainer) {
//             viewContainer.style.display = isViewEnabled ? 'block' : 'none';
//             console.log(`Представление ${i}:`, isViewEnabled ? 'visible' : 'hidden');
//         }

//         // Управление видимостью компонентов представления
//         for (let j = 1; j <= 5; j++) {
//             const componentIndex = viewIndex + j; // Индекс компонента в enabledData
//             const isComponentEnabled = enabledData[componentIndex]?.enabled;
//             const componentContainer = document.getElementById(`componentGrid_${i}_${j}`);
            
//             if (componentContainer) {
//                 // Компонент видим только если включено и представление, и сам компонент
//                 componentContainer.style.display = (isViewEnabled && isComponentEnabled) ? 'block' : 'none';
//                 console.log(`Компонент ${i}.${j}:`, 
//                           (isViewEnabled && isComponentEnabled) ? 'visible' : 'hidden');
//             }
//         }
//     }
// }
function showSettingsOfEnabled(enabledData) {
    if (!enabledData || !Array.isArray(enabledData)) {
        console.error('Invalid enabledData:', enabledData);
        return;
    }

    // Константы для индексов
    const OBJECT_TYPES_COUNT = 12;
    const VIEWS_COUNT = 7;
    const COMPONENTS_PER_VIEW = 5;

    // Скрыть/показать типы объектов (1-12)
    for (let i = 1; i <= OBJECT_TYPES_COUNT; i++) {
        const container = document.getElementById(`objectTypeGrid${i}`);
        if (container) {
            const isEnabled = enabledData[i - 1]?.enabled;
            container.style.display = isEnabled ? 'block' : 'none';
        }
    }

    // Скрыть/показать представления и их компоненты
    for (let viewNum = 1; viewNum <= VIEWS_COUNT; viewNum++) {
        const viewIndex = OBJECT_TYPES_COUNT + (viewNum - 1) * (COMPONENTS_PER_VIEW + 1);
        const isViewEnabled = enabledData[viewIndex]?.enabled;

        // Управление представлением
        const viewContainer = document.getElementById(`representationGrid${viewNum}`);
        if (viewContainer) {
            viewContainer.style.display = isViewEnabled ? 'block' : 'none';
        }

        // Управление компонентами представления
        for (let compNum = 1; compNum <= COMPONENTS_PER_VIEW; compNum++) {
            const compIndex = viewIndex + compNum;
            const isCompEnabled = enabledData[compIndex]?.enabled;
            const compContainer = document.getElementById(`componentGrid_${viewNum}_${compNum}`);
            
            if (compContainer) {
                compContainer.style.display = (isViewEnabled && isCompEnabled) ? 'block' : 'none';
            }
        }
    }
}

async function initializeAllTablesWithSavedData() {
    try {
        // Load saved settings from storage
        const savedData = JSON.parse(sessionStorage.getItem('allSettingsData')) || {};
        
        // Initialize all tables if they don't exist
        if (!window.objectTypeGrids) {
            initializeObjectTypeTables();
        }
        if (!window.representationGrids) {
            initializeRepresentationTables();
        }
        if (!window.componentGrids) {
            initializeComponentTables();
        }
        
        // Wait for tables to be initialized
        await new Promise(resolve => setTimeout(resolve, 300));
        
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
        
        // Update visibility based on enabled pages
        if (savedData.enabledPages) {
            showSettingsOfEnabled(savedData.enabledPages);
        }
        
        //console.log('All tables initialized with saved data');
        return true;
    } catch (error) {
        console.error('Error initializing tables with saved data:', error);
        return false;
    }
}

function updateTablesFromSavedData(savedData) {
    if (!savedData) return;
    
    // Update Object Types names from input fields
    for (let i = 0; i < Math.min(12, savedData.ObjectTypes.length); i++) {
        const nameInput = document.getElementById(`name${i+1}`);
        if (nameInput && savedData.ObjectTypes[i].name) {
            nameInput.value = savedData.ObjectTypes[i].name;
        }
    }
    
    // Update Representations and Components
    for (let viewNum = 0; viewNum < Math.min(7, savedData.Views.length); viewNum++) {
        const view = savedData.Views[viewNum];
        const representationId = viewNum + 1;
        
        // Update representation table
        if (representationGrids[representationId]) {
            const repGrid = representationGrids[representationId];
            const repData = [];
            repGrid.forEachNode(node => repData.push(node.data));
            
            // Update form name and code
            const formNameRow = repData.find(row => row.id === 'form_name');
            const formCodeRow = repData.find(row => row.id === 'form_code');
            
            if (formNameRow && view.name) {
                formNameRow.fieldType = view.name;
                repGrid.applyTransaction({ update: [formNameRow] });
            }
            
            if (formCodeRow && view.code) {
                formCodeRow.fieldType = view.code;
                repGrid.applyTransaction({ update: [formCodeRow] });
            }
            
            // Update components in representation table
            for (let compNum = 0; compNum < Math.min(5, view.Components.length); compNum++) {
                const component = view.Components[compNum];
                const compNameRow = repData.find(row => row.id === `component_${compNum+1}_name`);
                const compCodeRow = repData.find(row => row.id === `component_${compNum+1}_code`);
                
                if (compNameRow && component.name) {
                    compNameRow.fieldType = component.name;
                    repGrid.applyTransaction({ update: [compNameRow] });
                }
                
                if (compCodeRow && component.code) {
                    compCodeRow.fieldType = component.code;
                    repGrid.applyTransaction({ update: [compCodeRow] });
                }
            }
        }
        
        // Update component tables
        for (let compNum = 0; compNum < Math.min(5, view.Components.length); compNum++) {
            const component = view.Components[compNum];
            const componentKey = `${representationId}_${compNum+1}`;
            
            if (componentGrids[componentKey]) {
                const compGrid = componentGrids[componentKey];
                const compData = [];
                compGrid.forEachNode(node => compData.push(node.data));
                
                // Update component name and code
                const nameRow = compData.find(row => row.id === 'component_name');
                const codeRow = compData.find(row => row.id === 'component_code');
                
                if (nameRow && component.name) {
                    nameRow.fieldType = component.name;
                    compGrid.applyTransaction({ update: [nameRow] });
                }
                
                if (codeRow && component.code) {
                    codeRow.fieldType = component.code;
                    compGrid.applyTransaction({ update: [codeRow] });
                }
                
                // Update headers if they exist
                if (component.headers) {
                    component.headers.forEach(header => {
                        const headerRow = compData.find(row => row.id === header.name);
                        if (headerRow) {
                            headerRow.fieldType = header.type === 'num' ? 'Число' : 'Строка';
                            headerRow.size = header.maxSmth ? header.maxSmth.toString() : '-';
                            headerRow.flagEnabled = header.enabled;
                            compGrid.applyTransaction({ update: [headerRow] });
                        }
                    });
                }
            }
        }
    }
}