// representationTables.js

window.representationGrids = {}; // Для хранения API таблиц представлений

function createRepresentationGridOptions(representationId) {
    // Данные для таблицы представления
    const mockData = [
        {
            id: 'form_code',
            element: 'Код формы',
            fieldType: 'Строка',
            size: '3',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'form_name',
            element: 'Название формы',
            fieldType: 'Строка',
            size: '100',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: true,
            flagNote: 'НР'
        },
        {
            id: 'hint1',
            element: 'Текст подсказки 1 «Что делать»',
            fieldType: 'Текст абзац (в т.ч. гиперссылка)',
            size: '1000',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'hint2',
            element: 'Текст подсказки 2 «Как делать»',
            fieldType: 'Текст абзац (в т.ч. гиперссылка)',
            size: '1000',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        // Компоненты 1-5
        ...Array.from({length: 5}, (_, i) => ({
            id: `component_${i+1}_code`,
            element: `Строка ${i+1} Код компонента`,
            fieldType: 'Строка',
            size: '3',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        })),
        ...Array.from({length: 5}, (_, i) => ({
            id: `component_${i+1}_name`,
            element: `Строка ${i+1} Название компонента`,
            fieldType: 'Строка',
            size: '100',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: true,
            flagNote: 'НР'
        })),
        ...Array.from({length: 5}, (_, i) => ({
            id: `component_${i+1}_em`,
            element: `Строка ${i+1} ЭМ`,
            fieldType: 'Строка «Эталонная модель»',
            size: '30',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        })),
        ...Array.from({length: 5}, (_, i) => ({
            id: `component_${i+1}_example`,
            element: `Строка ${i+1} Пример`,
            fieldType: 'Строка «Пример»',
            size: '30',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        }))
    ];

    const gridOptions = {
        rowData: mockData,
        columnDefs: [
            {
                headerName: '',
                field: "flagEnabled",
                width: 50,
                cellRenderer: flagRenderer,
                cellRendererParams: { representationId },
                editable: false,
                sortable: false,
                filter: false,
                resizable: false
            },
            {
                field: "element",
                headerName: "Настраиваемые элементы",
                flex: 2,
                cellClassRules: {
                    'component-row': params => params.data.id.includes('component')
                }
            },
            {
                field: "fieldType",
                headerName: "Название",
                flex: 1,
                editable: true
            },
            {
                field: "size",
                headerName: "Размер (символов)",
                width: 150
            }
        ],
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true
        },
        getRowId: params => params.data.id,
        onRowDataUpdated: params => {
            params.api.refreshCells({ force: true });
        },
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        headerHeight: 40,
        undoRedoCellEditing: true,
        rowHeight: 40
    };

    return gridOptions;
}

// Улучшенный рендерер для чекбоксов
function flagRenderer(params) {
    const eGui = document.createElement('div');
    eGui.style.display = 'flex';
    eGui.style.justifyContent = 'center';
    eGui.style.alignItems = 'center';
    eGui.style.height = '100%';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = params.data.flagEnabled;
    checkbox.disabled = params.data.requiresFile && !isFileUploaded(params.data.id, params.representationId);
    
    // Стилизация чекбокса
    checkbox.style.width = '18px';
    checkbox.style.height = '18px';
    checkbox.style.cursor = checkbox.disabled ? 'not-allowed' : 'pointer';
    checkbox.style.opacity = checkbox.disabled ? '0.7' : '1';
    
    checkbox.addEventListener('change', (e) => {
        params.data.flagEnabled = e.target.checked;
        params.api.applyTransaction({ update: [params.data] });
    });

    eGui.appendChild(checkbox);
    
    if (params.data.flagNote) {
        const note = document.createElement('span');
        note.textContent = params.data.flagNote;
        note.style.marginLeft = '5px';
        note.style.fontSize = '12px';
        note.style.color = '#666';
        eGui.appendChild(note);
    }
    
    return eGui;
}

// Проверка загруженного файла
function isFileUploaded(elementId, representationId) {
    // Реальная реализация должна проверять факт загрузки файла
    // Заглушка: для теста считаем, что файлы для четных ID загружены
    return parseInt(elementId.split('_').pop()) % 2 === 0;
}

// Инициализация таблиц представлений
function initializeRepresentationTables() {
    for (let i = 1; i <= 7; i++) {
        const containerId = `representationGrid${i}`;
        
        // Проверяем, не создан ли уже контейнер
        if (document.getElementById(containerId)) continue;
        
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'gridContainer hiddenContainer';
        container.innerHTML = `
            <h2 style="margin: 10px 0">Настройки формы Представление ${i}</h2>
            <div class="ag-grid-toolbar">
                 <button class="toolbar-btn" id="undoBtnRep_${i}" title="Отменить (Ctrl+Z)">
                     <span class="material-icons">undo</span>
                 </button>
                 <button class="toolbar-btn" id="redoBtnRep_${i}" title="Вернуть (Ctrl+Y)">
                     <span class="material-icons">redo</span>
                 </button>
                 <div style="flex-grow: 1"></div>
                <button class="toolbar-btn" id="saveRepresentationBtn_${i}" title="Сохранить">
                    <span class="material-icons">save</span>
                </button>
            </div>
            <div id="representationGrid_${i}" class="ag-theme-alpine representation-grid" 
                 style="height: 600px; width: 100%;"></div>
        `;
        
        document.getElementById('generalContainer').appendChild(container);
        
        const gridOptions = createRepresentationGridOptions(i);
        const gridApi = agGrid.createGrid(document.querySelector(`#representationGrid_${i}`), gridOptions);
        representationGrids[i] = gridApi;
        
        setupRepresentationTableButtons(i);
        setupRepresentationToComponentSync(i); // Add this line
    }
}

// Настройка кнопок таблицы
function setupRepresentationTableButtons(representationId) {
    const saveBtn = document.getElementById(`saveRepresentationBtn_${representationId}`);
    if (!saveBtn) return;
    
    saveBtn.addEventListener('click', () => {
        // const allData = [];
        // representationGrids[representationId].forEachNode(node => allData.push(node.data));
        // console.log('Сохранение данных представления:', allData);
        // showNotification(`Настройки Представления ${representationId} сохранены`);
        saveSettingsToStorage();
        // Здесь можно добавить отправку данных на сервер
        // saveRepresentationData(representationId, allData);
    });
    
    const gridApi = representationGrids[representationId];
    document.getElementById(`undoBtnRep_${representationId}`).addEventListener("click", () => {
        gridApi.undoCellEditing();
        console.log(`${representationId}`)
    });
    
    document.getElementById(`redoBtnRep_${representationId}`).addEventListener("click", () => {
        gridApi.redoCellEditing();
    });
}

// Экспорт функций для управления таблицами
window.RepresentationTables = {
    init: initializeRepresentationTables,
    updateVisibility: (enabledData) => {
        for (let i = 1; i <= 7; i++) {
            const container = document.getElementById(`representationGrid${i}`);
            if (container) {
                const dataIndex = 11 + i; // Индексы представлений в enabledData
                container.style.display = enabledData[dataIndex]?.enabled ? 'block' : 'none';
            }
        }
    }
};

// Add this to representationTables.js
function setupRepresentationToComponentSync(representationId) {
    const gridApi = representationGrids[representationId];
    
    gridApi.addEventListener('cellValueChanged', (params) => {
        // Check if we're editing a component name or code in representation table
        if (params.data.id && params.data.id.includes('component_') && 
            (params.data.id.includes('_name') || params.data.id.includes('_code'))) {
            
            // Extract component number from row ID (e.g., "component_1_name" -> 1)
            const compNum = parseInt(params.data.id.split('_')[1]);
            
            // Get the corresponding component table
            const componentKey = `${representationId}_${compNum}`;
            const componentGrid = componentGrids[componentKey];
            
            if (componentGrid) {
                // Get all component data
                const componentData = [];
                componentGrid.forEachNode(node => componentData.push(node.data));
                
                // Update either name or code in component table
                if (params.data.id.includes('_name')) {
                    const nameRow = componentData.find(row => row.id === 'component_name');
                    if (nameRow) {
                        nameRow.fieldType = params.value;
                        componentGrid.applyTransaction({ update: [nameRow] });
                    }
                } 
                else if (params.data.id.includes('_code')) {
                    const codeRow = componentData.find(row => row.id === 'component_code');
                    if (codeRow) {
                        codeRow.fieldType = params.value;
                        componentGrid.applyTransaction({ update: [codeRow] });
                    }
                }
            }
        }
    });
}

// Инициализация при загрузке (если нужно)
 document.addEventListener('DOMContentLoaded', initializeRepresentationTables);