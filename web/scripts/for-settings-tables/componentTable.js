// componentTables.js
window.componentGrids = {}; // Для хранения API таблиц компонентов

function createComponentGridOptions(representationId, componentId) {
    const mockData = [
        {
            id: 'component_code',
            element: 'Код компонента',
            fieldType: 'Строка',
            size: '3',
            hasFlag: true,
            flagEnabled: false
        },
        {
            id: 'component_name',
            element: 'Название компонента',
            fieldType: 'Строка',
            size: '100',
            hasFlag: true,
            flagEnabled: false,
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
            fieldType: 'Строка',
            size: '50',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'column2',
            element: 'Название столбца 2',
            fieldType: 'Строка',
            size: '50',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'column3',
            element: 'Название столбца 3',
            fieldType: 'Строка',
            size: '50',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'column4',
            element: 'Название столбца 4',
            fieldType: 'Строка',
            size: '50',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'column5',
            element: 'Название столбца 5',
            fieldType: 'Число',
            size: 'NNN,N',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'column6',
            element: 'Название столбца 6',
            fieldType: 'Число',
            size: 'NNN,N',
            hasFlag: true,
            flagEnabled: false,
            requiresFile: false
        },
        {
            id: 'column7',
            element: 'Название столбца 7',
            fieldType: 'Строка',
            size: '50',
            hasFlag: true,
            flagEnabled: false,
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
                editable: false
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
                width: 100
            }
        ],
        defaultColDef: {
            sortable: true,
            filter: true
        },
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
            container.style.height = "50vh";
            container.className = 'gridContainer hiddenContainer';
            container.innerHTML = `
                <h2>Компонент ${repId}.${compId}</h2>
                <div class="ag-grid-toolbar">
                    <button class="toolbar-btn" id="saveComponentBtn_${repId}_${compId}">
                        <span class="material-icons">save</span>
                    </button>
                </div>
                <div id="componentGridInner_${repId}_${compId}" 
                    class="ag-theme-alpine" 
                    style="height: 400px; width: 100%;"></div>
            `;

            document.getElementById('generalContainer').appendChild(container);

            const gridOptions = createComponentGridOptions(repId, compId);
            const gridApi = agGrid.createGrid(
                document.querySelector(`#componentGridInner_${repId}_${compId}`),
                gridOptions
            );
            componentGrids[`${repId}_${compId}`] = gridApi;
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initializeComponentTables);