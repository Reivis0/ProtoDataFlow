// objectTypeTables.js
//window.gridApi1 = null; //настройки этой таблицы

//window.enabeledPagesData = null; //данные этой таблицы

window.objectTypeGrids = {}; // Здесь будем хранить все API таблиц

function createObjectTypeGridOptions(objectTypeId) {
    // Создаем mock-данные для таблицы
    const mockData = [];
    const viewsCount = 7;
    const componentsPerView = 5;
    
    for (let viewNum = 1; viewNum <= viewsCount; viewNum++) {
        // Добавляем строку представления
        mockData.push({
            id: `view_${viewNum}`,
            name: `Представление ${viewNum}`,
            isView: true,
            file1: null,
            file2: null,
            file3: null
        });
        
        // Добавляем строки компонентов для этого представления
        for (let compNum = 1; compNum <= componentsPerView; compNum++) {
            mockData.push({
                id: `view_${viewNum}_comp_${compNum}`,
                name: `Компонент ${viewNum}.${compNum}`,
                isView: false,
                file1: null,
                file2: null,
                file3: null
            });
        }
    }

    const gridOptions = {
        rowData: mockData,
        columnDefs: [
            {
                field: "name",
                headerName: "Название",
                flex: 2,
                cellClassRules: {
                    'view-row': params => params.data.isView
                }
            },
            {
                headerName: "ЭМ",
                children: [
                    {
                        field: "file1",
                        headerName: "Файл",
                        flex: 1,
                        editable: false,
                        cellRenderer: fileCellRenderer
                    },
                    {
                        headerName: "Загрузить",
                        width: 120,
                        cellRenderer: uploadButtonRenderer,
                        cellRendererParams: {
                            fileType: 'file1',
                            objectTypeId: objectTypeId
                        }
                    }
                ]
            },
            {
                headerName: "Пример",
                children: [
                    {
                        field: "file2",
                        headerName: "Файл",
                        flex: 1,
                        editable: false,
                        cellRenderer: fileCellRenderer
                    },
                    {
                        headerName: "Загрузить",
                        width: 120,
                        cellRenderer: uploadButtonRenderer,
                        cellRendererParams: {
                            fileType: 'file2',
                            objectTypeId: objectTypeId
                        }
                    }
                ]
            },
            
        ],
        defaultColDef: {
            flex: 1,
            editable: true,
            sortable: true,
            filter: true,
            resizable: true
        },
        enableRangeSelection: true,
        rowDragManaged: true,
        animateRows: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        undoRedoCellEditing: true,
        enableCellTextSelection: false,
        suppressClipboardPaste: false,
        onRowDoubleClicked: event => {
            if (event.node.isSelected()) {
                event.node.setSelected(false);
            } else {
                event.node.setSelected(true);
            }
        },
        getRowId: params => params.data.id
    };

    return gridOptions;
}

// Рендерер для кнопки загрузки
function uploadButtonRenderer(params) {
    const eGui = document.createElement('div');
    
    const button = document.createElement('button');
    button.textContent = params.data.isView ? 'Загрузить' : 'Загрузить';
    button.classList.add('upload-btn');
    
    if (params.data.isView) {
        button.classList.add('upload-em-btn');
    }
    
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        handleFileUpload(params.data, params.fileType, params.objectTypeId);
    });
    
    eGui.appendChild(button);
    return eGui;
}

// Рендерер для отображения имени файла
function fileCellRenderer(params) {
    const eGui = document.createElement('div');
    if (params.value) {
        eGui.textContent = params.value;
        eGui.style.color = '#2196F3';
    } else {
        eGui.textContent = 'Не загружено';
        eGui.style.color = '#999';
    }
    return eGui;
}

// Обработчик загрузки файла
function handleFileUpload(rowData, fileType, objectTypeId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            // Обновляем данные в таблице
            rowData[fileType] = file.name;
            objectTypeGrids[objectTypeId].applyTransaction({ update: [rowData] });
            
            // Здесь можно добавить логику для фактической загрузки файла на сервер
            showNotification(`Файл "${file.name}" загружен для ${rowData.name}`);
        }
    };
    
    input.click();
}

// Инициализация всех таблиц "Тип объекта"
function initializeObjectTypeTables() {
    for (let i = 1; i <= 12; i++) {
        const containerId = `objectTypeGrid${i}`;
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'gridContainer hiddenContainer';
        container.innerHTML = `
            <h2 style="margin: 10px 0">Тип Объекта ${i}</h2>
            <div style="margin: 10px auto; width: 40%;">
                <label for="name${i}">Название: </label>
                <input type="text" id="name${i}" name="name${i}" required placeholder="Название типа ${i}">
            </div>
            <div class="ag-grid-toolbar">
                <button class="toolbar-btn" id="insertRowsBtn_${i}" title="Вставить строки">
                    <span class="material-icons">add</span>
                </button>
                <button class="toolbar-btn" id="deleteRowsBtn_${i}" title="Удалить строки">
                    <span class="material-icons">delete</span>
                </button>
                <button class="toolbar-btn" id="undoBtn_${i}" title="Отменить (Ctrl+Z)">
                    <span class="material-icons">undo</span>
                </button>
                <button class="toolbar-btn" id="redoBtn_${i}" title="Вернуть (Ctrl+Y)">
                    <span class="material-icons">redo</span>
                </button>
                <div style="flex-grow: 1"></div>
                <button class="toolbar-btn" id="saveSelectedBtn_${i}" title="Сохранить выбранные">
                    <span class="material-icons">save</span>
                    <span id="selectedCount_${i}" style="margin-left: 5px; font-size: 14px;">0</span>
                </button>
                <button class="toolbar-btn" id="saveAllBtn_${i}" title="Сохранить всю таблицу">
                    <span class="material-icons">save_alt</span>
                </button>
            </div>
            <div id="myGrid_${i}" class="ag-theme-alpine" style="height: calc(100% - 100px);"></div>
        `;
        
        document.getElementById('generalContainer').appendChild(container);
        
        const gridOptions = createObjectTypeGridOptions(i);
        const gridApi = agGrid.createGrid(document.querySelector(`#myGrid_${i}`), gridOptions);
        objectTypeGrids[i] = gridApi;
        
        setupObjectTypeTableButtons(i);
    }
}

// Настройка кнопок для таблицы "Тип объекта"
function setupObjectTypeTableButtons(objectTypeId) {
    const gridApi = objectTypeGrids[objectTypeId];
    
    document.getElementById(`undoBtn_${objectTypeId}`).addEventListener("click", () => {
        gridApi.undoCellEditing();
    });
    
    document.getElementById(`redoBtn_${objectTypeId}`).addEventListener("click", () => {
        gridApi.redoCellEditing();
    });
    
    document.getElementById(`saveSelectedBtn_${objectTypeId}`).addEventListener('click', () => {
        const selectedData = gridApi.getSelectedNodes().map(node => node.data);
        if (selectedData.length === 0) {
            showNotification('Нет выбранных строк!', 'error');
            return;
        }
        console.log('Saving selected:', selectedData);
        showNotification(`Сохранено ${selectedData.length} выбранных строк (Тип объекта ${objectTypeId})`);
    });
    
    document.getElementById(`saveAllBtn_${objectTypeId}`).addEventListener('click', () => {
        const allData = [];
        gridApi.forEachNode(node => allData.push(node.data));
        console.log('Saving all:', allData);
        showNotification(`Сохранено ${allData.length} строк (Тип объекта ${objectTypeId})`);
    });
    
    document.getElementById(`insertRowsBtn_${objectTypeId}`).addEventListener('click', (e) => {
        if (e.processed) return;
        e.processed = true;
        
        const selectedNodes = gridApi.getSelectedNodes();
        const defaultCount = 1;
        
        const question = selectedNodes.length > 0
            ? "Сколько пустых строк вставить под каждую выбранную?"
            : "Сколько пустых строк добавить в конец таблицы?";
        
        const input = prompt(question, defaultCount);
        const count = parseInt(input) || defaultCount;
        if (count <= 0) return;
        
        const allData = [];
        gridApi.forEachNode(node => allData.push(node.data));
        
        const inserts = [];
        if (selectedNodes.length > 0) {
            selectedNodes.forEach(node => {
                const rowIndex = allData.findIndex(row => row.id === node.data.id);
                if (rowIndex !== -1) {
                    inserts.push({
                        index: rowIndex + 1,
                        rows: Array(count).fill().map((_, i) => ({
                            id: `new_${Date.now()}_${i}`,
                            name: "",
                            isView: false,
                            file1: null,
                            file2: null,
                            file3: null
                        }))
                    });
                }
            });
        } else {
            inserts.push({
                index: allData.length,
                rows: Array(count).fill().map((_, i) => ({
                    id: `new_${Date.now()}_${i}`,
                    name: "",
                    isView: false,
                    file1: null,
                    file2: null,
                    file3: null
                }))
            });
        }
        
        inserts.sort((a, b) => b.index - a.index);
        inserts.forEach(insert => {
            allData.splice(insert.index, 0, ...insert.rows);
        });
        
        gridApi.setGridOption('rowData', allData);
        if (selectedNodes.length > 0) gridApi.deselectAll();
    });
    
    document.getElementById(`deleteRowsBtn_${objectTypeId}`).addEventListener('click', () => {
        const selectedNodes = gridApi.getSelectedNodes();
        if (selectedNodes.length === 0) {
            showNotification('Нет выделенных строк для удаления!', 'error');
            return;
        }
        
        if (!confirm(`Удалить ${selectedNodes.length} строк(у)?`)) return;
        
        gridApi.applyTransaction({
            remove: selectedNodes.map(node => node.data)
        });
        
        gridApi.deselectAll();
    });
    
    gridApi.addEventListener('selectionChanged', () => {
        const selectedCount = gridApi.getSelectedNodes().length;
        document.getElementById(`selectedCount_${objectTypeId}`).textContent = selectedCount;
    });
}

// Добавляем вызов инициализации в DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeObjectTypeTables);