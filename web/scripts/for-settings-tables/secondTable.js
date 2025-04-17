window.gridApi2 = null;

window.TableData2 = null;

{
const undo = document.getElementById("undoBtn2") ;

undo.addEventListener("click", (e) => {
    gridApi2.undoCellEditing();
})

const redo = document.getElementById("redoBtn2") ;

redo.addEventListener("click", (e) => {
    gridApi2.redoCellEditing();
})
}


function createGridOptions2(data) {

let gridOptions = {
        rowData: data,
        columnDefs: [
            {
                field: "isChosen",
                headerName: "",
                width: 50,
                rowDrag: true,
                cellClass: 'ag-selection-checkbox',
                
            },
            {
                field: "name",
                headerName: "Название",
            },
            {
                field: "quantity",
                headerName: "Количество",
            },
            {
                field: "price",
                headerName: "Цена",
            },
        ],
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
        onSelectionChanged: onSelectionChanged2,
        enableCellTextSelection: false,
        suppressClipboardPaste: false,

        onRowDoubleClicked: event => { //выделение по дв щелчк
            if (event.node.isSelected()){
            event.node.setSelected(false);
        } else {event.node.setSelected(true);}
        },

    };

    return gridOptions;


}




function onSelectionChanged2() {
    const selectedCount = gridApi2.getSelectedNodes().length;
    const saveBtn = document.getElementById('saveSelectedBtn2');
    saveBtn.disabled = selectedCount === 0;
    document.getElementById('selectedCount2').textContent = selectedCount;
}




function setupButtons2() {
    // Сохранение выделенного
    document.getElementById('saveSelectedBtn2').addEventListener('click', () => {
        const selectedData = gridApi2.getSelectedNodes().map(node => node.data);
        if (selectedData.length === 0) {
            showNotification('Нет выбранных строк!', 'error');
            return;
        }
        console.log('Saving selected:', selectedData);
        showNotification(`Сохранено ${selectedData.length} выбранных строк`);
    });




    // Сохранение всей таблицы
    document.getElementById('saveAllBtn2').addEventListener('click', () => {
        const allData = [];
        gridApi2.forEachNode(node => allData.push(node.data));
        console.log('Saving all:', allData);
        showNotification(`Сохранено ${allData.length} строк (вся таблица)`);
    });




    // Вставка строк (обновлённая версия)
    document.getElementById('insertRowsBtn2').addEventListener('click', (e) => {
       //alert("sdsd");
        if (e.processed) return; // Если событие уже обработано
        e.processed = true;
        const selectedNodes = gridApi2.getSelectedNodes();
        const defaultCount = 0;
       
        const question = selectedNodes.length > 0
            ? "Сколько пустых строк вставить под каждую выбранную?"
            : "Сколько пустых строк добавить в конец таблицы?";
       
        const input = prompt(question, defaultCount);
        const count = parseInt(input) || defaultCount;
        if (count <= 0) return;
       
        const allData = [];
        gridApi2.forEachNode(node => allData.push(node.data));
       
        const inserts = [];
        if (selectedNodes.length > 0) {
            // Вставка под выделенные строки
            selectedNodes.forEach(node => {
                const rowIndex = allData.findIndex(row => row === node.data);
                if (rowIndex !== -1) {
                    inserts.push({
                        index: rowIndex + 1,
                        rows: Array(count).fill().map(() => ({
                            isChosen: false,
                            name: "",
                            quantity: 0,
                            price: 0
                        }))
                    });
                }
            });
        } else {
            // Вставка в конец
            inserts.push({
                index: allData.length,
                rows: Array(count).fill().map(() => ({
                    isChosen: false,
                    name: "",
                    quantity: 0,
                    price: 0
                }))
            });
        }
       
        inserts.sort((a, b) => b.index - a.index);
        inserts.forEach(insert => {
            allData.splice(insert.index, 0, ...insert.rows);
        });
       
        gridApi2.setGridOption('rowData', allData);
        if (selectedNodes.length > 0) gridApi2.deselectAll();
    });




    // Удаление строк
    document.getElementById('deleteRowsBtn2').addEventListener('click', () => {
        const selectedNodes = gridApi2.getSelectedNodes();
        if (selectedNodes.length === 0) {
            showNotification('Нет выделенных строк для удаления!', 'error');
            return;
        }
       
        if (!confirm(`Удалить ${selectedNodes.length} строк(у)?`)) return;
       
        gridApi2.applyTransaction({
            remove: selectedNodes.map(node => node.data)
        });
       
        gridApi2.deselectAll();
    });
}
