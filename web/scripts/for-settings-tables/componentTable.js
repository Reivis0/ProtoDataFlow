// componentTables.js
window.componentGrids = {}; // Для хранения API таблиц компонентов

function createComponentGridOptions(representationId, componentId) {
    const mockData = [
        {
            id: 'component_code',
            element: 'Код компонента',
            fieldType: `Comp-${representationId}.${componentId}`,
            size: '3',
            hasFlag: true,
            flagEnabled: true
        },
        {
            id: 'component_name',
            element: 'Название компонента',
            fieldType: `Компонент ${representationId}.${componentId}`,
            size: '100',
            hasFlag: true,
            flagEnabled: true,
            requiresFile: true, //Вика, почему оно влияет на флаг редактируемости???????
            flagNote: 'НР' // Не редактируется
        },
        {
            id: 'em_file',
            element: 'Эталонная модель (ЭМ)',
            fieldType: 'Файл',
            size: '-',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: true
        },
        {
            id: 'example_file',
            element: 'Пример',
            fieldType: 'Файл',
            size: '-',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: true
        },
        {
            id: 'column1',
            element: 'Название столбца 1',
            fieldType: 'столбец 1',
            size: 50,
            hasFlag: true,
            flagEnabled: true,
            requiresFile: false
        },
        {
            id: 'column2',
            element: 'Название столбца 2',
            fieldType: 'столбец 2',
            size: 50,
            hasFlag: true,
            flagEnabled: true,
            requiresFile: false
        },
        {
            id: 'column3',
            element: 'Название столбца 3',
            fieldType: 'столбец 3',
            size: 50,
            hasFlag: true,
            flagEnabled: true,
            requiresFile: false
        },
        {
            id: 'column4',
            element: 'Название столбца 4',
            fieldType: 'столбец 4',
            size: 50,
            hasFlag: true,
            flagEnabled: true,
            requiresFile: false
        },
        {
            id: 'column5',
            element: 'Название столбца 5',
            fieldType: 'столбец 5',
            size: 10000,
            hasFlag: true,
            flagEnabled: true,
            requiresFile: false
        },
        {
            id: 'column6',
            element: 'Название столбца 6',
            fieldType: 'столбец 6',
            size: 10000,
            hasFlag: true,
            flagEnabled: true,
            requiresFile: false
        },
        {
            id: 'column7',
            element: 'Название столбца 7',
            fieldType: 'столбец 7',
            size: 50,
            hasFlag: true,
            flagEnabled: true,
            requiresFile: false
        }
    ];

    const gridOptions = {
        rowData: mockData,
        columnDefs: [
            {
                headerName: '',
                field: "flagEnabled",
                width: 50,
                cellRenderer: flagRenderer,
                cellRendererParams: { representationId, componentId },
                editable: false,
                filter: false
            },
            {
                field: "element",
                headerName: "Элемент",
                flex: 2
            },
            {
                field: "fieldType",
                headerName: "название",
                flex: 1,
                editable: true
                
            },
            {
                field: "size",
                headerName: "Размер",
                width: 100,
                editable: true
            }
        ],
        defaultColDef: {
            sortable: true,
            filter: true
        },
        undoRedoCellEditing: true,
        getRowId: params => params.data.id
    };

    return gridOptions;
}

function initializeComponentTables() {
    for (let repId = 1; repId <= 7; repId++) {
        for (let compId = 1; compId <= 5; compId++) {
            const containerId = `componentGrid_${repId}_${compId}`;
            const container = document.createElement('div');
            container.id = containerId;
            container.style.height = "60vh";
            container.className = 'gridContainer hiddenContainer';
            container.innerHTML = `
                <h2>Компонент ${repId}.${compId}</h2>
                <div class="ag-grid-toolbar">
                 <button class="toolbar-btn" id="undoBtnComp_${repId}_${compId}" title="Отменить (Ctrl+Z)">
                     <span class="material-icons">undo</span>
                 </button>
                 <button class="toolbar-btn" id="redoBtnComp_${repId}_${compId}" title="Вернуть (Ctrl+Y)">
                     <span class="material-icons">redo</span>
                 </button>
                 <div style="flex-grow: 1"></div>
                    <button class="toolbar-btn" id="saveComponentBtn_${repId}_${compId}">
                        <span class="material-icons">save</span>
                    </button>
                </div>
                <div id="componentGridInner_${repId}_${compId}" 
                    class="ag-theme-alpine" 
                    style="height: 90%; width: 100%;"></div>
            `;

            document.getElementById('generalContainer').appendChild(container);

            const gridOptions = createComponentGridOptions(repId, compId);
            const gridApi = agGrid.createGrid(
                document.querySelector(`#componentGridInner_${repId}_${compId}`),
                gridOptions
            );
            componentGrids[`${repId}_${compId}`] = gridApi;
            
            setupComponentTableButtons(repId, compId);
            setupComponentToRepresentationSync(repId, compId); // Add this line
        }
    }
}

function setupComponentTableButtons(repId, compId) {
    const saveBtn = document.getElementById(`saveComponentBtn_${repId}_${compId}`);
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

    const gridApi = componentGrids[`${repId}_${compId}`];
    document.getElementById(`undoBtnComp_${repId}_${compId}`).addEventListener("click", () => {
        gridApi.undoCellEditing();
        //console.log(`${repId}_${compId}`)
    });
    
    document.getElementById(`redoBtnComp_${repId}_${compId}`).addEventListener("click", () => {
        gridApi.redoCellEditing();
    });
}

// Add this to componentTable.js
function setupComponentToRepresentationSync(representationId, componentId) {
    const gridApi = componentGrids[`${representationId}_${componentId}`];
    
    gridApi.addEventListener('cellValueChanged', (params) => {
        // Check if we're editing name or code in component table
        if (params.data.id === 'component_name' || params.data.id === 'component_code') {
            const representationGrid = representationGrids[representationId];
            if (!representationGrid) return;
            
            // Find corresponding row in representation table
            const rowId = params.data.id === 'component_name' ? 
                `component_${componentId}_name` : `component_${componentId}_code`;
            
            representationGrid.forEachNode(node => {
                if (node.data.id === rowId) {
                    node.data.fieldType = params.value;
                    representationGrid.applyTransaction({ update: [node.data] });
                }
            });
        }
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initializeComponentTables);