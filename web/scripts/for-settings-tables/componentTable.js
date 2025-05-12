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
                headerName: "Тип поля",
                flex: 1
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
            container.className = 'gridContainer hiddenContainer';
            container.innerHTML = `
                <h2>Компонент ${repId}.${compId}</h2>
                <div class="ag-grid-toolbar">
                    <button class="toolbar-btn" id="saveComponentBtn_${repId}_${compId}">
                        <span class="material-icons">save</span>
                    </button>
                </div>
                <div id="componentGridInner_${repId}_${compId}" class="ag-theme-alpine"></div>
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