function loadData(){
    let answer = {
        information: {
            code: "ADW-32",
            name: "Начальные требования",
            headers: [
                {
                    header: "столбец 1",
                    type: "string",
                    maxSmth: 50,
                    name: "column1"

                },
                {
                    header: "столбец 2",
                    type: "string",
                    maxSmth: 50,
                    name: "column2"

                },
                {
                    header: "столбец 3",
                    type: "string",
                    maxSmth: 50,
                    name: "column3"

                },
                {
                    header: "столбец 4",
                    type: "string",
                    maxSmth: 50,
                    name: "column4"

                },
                {
                    header: "столбец 6",
                    type: "num",
                    maxSmth: 10000,
                    name: "column6"

                }

            ]

        },
        data: [
            {"column1": "asdasdas", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column6": 999.6 },
            {"column1": "ysdsadas", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column6": 979.6 },
            {"column1": "assfsfs", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column6": 9969.6 },
            {"column1": "kasdas", "column2": "kykjyuk", "column3": "adsadad", "column4": "Sahjda", "column6": 959.6 },
            {"column1": "asddsas", "column2": "l,ljykjyuk", "column3": "pooadad", "column4": "iuuuada", "column6": 969.6 },
            {"column1": "klsdas", "column2": "qaykjyuk", "column3": "ksadad", "column4": "uuada", "column6": 99.6 },
        ]
    };
    return answer;
}

function returnGridOptions(options){

    let coldefs = [];
    options.information.headers.forEach(element => {
        let column = {field: element.name, headerName: element.header};
        if(element.type === "string") {
            column.cellEditor = 'agTextCellEditor';
            columncellEditorParams = {maxLength: element.maxSmth}
        }
        else if (element.type === "num") {
            column.cellEditor = 'agNumberCellEditor';
            column.cellEditorParams = {min: 0, max: element.maxSmth, precision: 1}
        }
        coldefs.push(column)
    });

    coldefs[0].rowDrag = true;

    let gridOptions = {
        rowData: options.data,
        columnDefs: coldefs,
        defaultColDef: {
            flex: 1,
            editable: true,
            sortable: true,
            filter: true,
            enableCellChangeFlash: true
        },
        enableRangeSelection: true,
        cellSelection: true,
        enableRangeHandle: true,
        suppressMultiRangeSelection: false,
        rowDragManaged: true,
        animateRows: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        undoRedoCellEditing: true,
        onSelectionChanged: onSelectionChanged,
        enableCellTextSelection: false,
        suppressClipboardPaste: false,

        onRowDoubleClicked: event => { //выделение по дв щелчк
            if (event.node.isSelected()){
            event.node.setSelected(false);
        } else {event.node.setSelected(true);}
        },

    };

    return gridOptions
}

let gridApi;

let localData;

function onSelectionChanged() {
    const selectedCount = gridApi.getSelectedNodes().length;
    const saveBtn = document.getElementById('saveSelectedBtn');
    saveBtn.disabled = selectedCount === 0;
    document.getElementById('selectedCount').textContent = selectedCount;
}




function setupButtons() {

    document.getElementById("redoBtn").addEventListener("click", (e) => {
        gridApi.redoCellEditing();
      });
  
      document.getElementById("undoBtn").addEventListener("click", (e) => {
        gridApi.undoCellEditing();
      });

    // Сохранение выделенного
    document.getElementById('saveSelectedBtn').addEventListener('click', () => {
        const selectedData = gridApi.getSelectedNodes().map(node => node.data);
        if (selectedData.length === 0) {
            showNotification('Нет выбранных строк!', 'error');
            return;
        }
        console.log('Saving selected:', selectedData);
        showNotification(`Сохранено ${selectedData.length} выбранных строк`);
    });




    // Сохранение всей таблицы
    document.getElementById('saveAllBtn').addEventListener('click', () => {
        const allData = [];
        gridApi.forEachNode(node => allData.push(node.data));
        console.log('Saving all:', allData);
        showNotification(`Сохранено ${allData.length} строк (вся таблица)`);
    });




    // Вставка строк (обновлённая версия)
    document.getElementById('insertRowsBtn').addEventListener('click', (e) => {
        if (e.processed) return;
        e.processed = true;
        
        const selectedNodes = gridApi.getSelectedNodes();
        const defaultCount = 0;
        
        const question = selectedNodes.length > 0
            ? "Сколько пустых строк вставить под каждую выбранную?"
            : "Сколько пустых строк добавить в конец таблицы?";
        
        const input = prompt(question, defaultCount);
        const count = parseInt(input) || defaultCount;
        if (count <= 0) return;
        
        // Get current row data and column definitions
        const allData = [];
        gridApi.forEachNode(node => allData.push(node.data));
        const columnDefs = gridApi.getColumnDefs();
        
        // Create empty row template based on column definitions
        const emptyRow = {};
        columnDefs.forEach(colDef => {
            // Initialize each field with appropriate empty value based on type
            if (colDef.cellEditor === 'agNumberCellEditor') {
                emptyRow[colDef.field] = 0;
            } else {
                emptyRow[colDef.field] = "";
            }
        });
        
        const inserts = [];
        
        if (selectedNodes.length > 0) {
            // Insert below selected rows
            selectedNodes.forEach(node => {
                const rowIndex = allData.findIndex(row => {
                    // Compare all fields to ensure we find the exact match
                    return Object.keys(row).every(key => row[key] === node.data[key]);
                });
                
                if (rowIndex !== -1) {
                    inserts.push({
                        index: rowIndex + 1,
                        rows: Array(count).fill().map(() => ({ ...emptyRow }))
                    });
                }
            });
        } else {
            // Insert at the end
            inserts.push({
                index: allData.length,
                rows: Array(count).fill().map(() => ({ ...emptyRow }))
            });
        }
        
        // Apply inserts in reverse order to maintain correct indices
        inserts.sort((a, b) => b.index - a.index);
        inserts.forEach(insert => {
            allData.splice(insert.index, 0, ...insert.rows);
        });
        console.log(allData);
        gridApi.setGridOption('rowData', allData);
        if (selectedNodes.length > 0) gridApi.deselectAll();
    });



    // Удаление строк
    document.getElementById('deleteRowsBtn').addEventListener('click', () => {
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
}

document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    let data = loadData();
    let GrdOptions = returnGridOptions(data);
    console.log(GrdOptions);
    gridApi = agGrid.createGrid(document.getElementById("myGrid"), GrdOptions);
    setupButtons();
    document.getElementById("mainFormName").textContent = data.information.name;
    document.getElementById("code").textContent = data.information.code;
});

function showNotification(message, type = 'success') { //показать уведомление пользователю
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '75px';
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
   
    setTimeout(() => { //исчезает через время
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}