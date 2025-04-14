let originalData = []; // массив сохраннных данных
let gridApi; // Чтобы работала таблица
let deletedRows = []; // удаленные не пустые строки


document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    let status = sessionStorage.getItem('GlobalLevel');
    //alert(status);
    if(status !== 'admin') {
        e.preventDefault();
        window.location.href = "log-in.html";
    }

    
    // fetch("http://127.0.0.1:8080")
    // .then(response => {
    // if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return response.json(); 
    // })
    // .then(data => {
    //     const gridOptions = {
    //     columnDefs: columnDefs,
    //     rowData: loadData(),
    //     defaultColDef: {
    //         flex: 1,
    //         minWidth: 100,
    //         editable: (params) => {
    //             // Only allow editing if the row is selected
    //             return params.node.isSelected();
    //         },
    //         filter: true,
    //         sortable: true,
    //         resizable: true
    //     },
    //     rowSelection: 'multiple',
    //     rowDragManaged: true,
    //     animateRows: true,
    //     suppressRowClickSelection: true, // Allow selection on click
    //     enableCellTextSelection: true,
    //     undoRedoCellEditing: true,
    //     undoRedoCellEditingLimit: 10,
    //     onCellValueChanged: (params) => {
    //         // Visual feedback for changed cells
    //         params.node.setDataValue('__dirty', true);
    //         const cellEl = params.api.getCellRendererInstances({
    //             rowNodes: [params.node],
    //             columns: [params.column]
    //         })[0]?.getGui();
    //         if (cellEl) {
    //             cellEl.style.backgroundColor = '#fffde7';
    //             setTimeout(() => {
    //                 cellEl.style.backgroundColor = '';
    //             }, 1000);
    //         }
    //     },
    //     onRowSelected: (params) => {
    //         // Refresh the row to update editable state when selection changes
    //         params.api.refreshCells({
    //             rowNodes: [params.node],
    //             force: true
    //         });
    //     },
    //     // Prevent editing when not selected
    //     onCellEditingStarted: (params) => {
    //         if (!params.node.isSelected()) {
    //             // Cancel editing if row isn't selected
    //             params.api.stopEditing(true);
    //         }
    //     }
    // };
    
    // gridApi = agGrid.createGrid(document.querySelector("#myGrid"), gridOptions);
    // originalData = data;

    // })
    // .catch(error => {
    //     console.error('Error fetching data:', error);
    // });

    

    
    gridApi = agGrid.createGrid(document.querySelector("#myGrid"), gridOptions);
    const saveButton = document.getElementById("save");
    saveButton.addEventListener('click', saveChanges);
})


function loadData() {
    // Эмуляция запроса к серверу
    const mockData = [
        { id: 1, level: "User", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "123", password: "123", acsess: true, startDate: new Date("2005-02-03"), endDate: new Date("2005-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd"},
        { id: 2, level: "Admin", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "321", password: "321", acsess: true, startDate: new Date("2005-02-03"), endDate: new Date("2005-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd"},
        { id: 3, level: "User", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "123", password: "123", acsess: true, startDate: new Date("2005-02-03"), endDate: new Date("2005-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd"},
        { id: 4, level: "Admin", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "321", password: "321", acsess: true, startDate: new Date("2005-02-03"), endDate: new Date("2005-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd"},
        { id: 5, level: "User", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "123", password: "123", acsess: true, startDate: new Date("2005-02-03"), endDate: new Date("2005-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd"},
        { id: 6, level: "Admin", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "321", password: "321", acsess: true, startDate: new Date("2005-02-03"), endDate: new Date("2005-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd"}
    ];
    originalData = JSON.parse(JSON.stringify(mockData));
    return mockData;
}

// Кнопки с действиями
class ActionsButtons {
    init(params) {
        this.params = params;
        this.eGui = document.createElement("div");
        this.eGui.style.display = "flex";
        this.eGui.style.gap = "5px";
        this.eGui.style.justifyContent = "center";
        
        this.insertButton = document.createElement("button"); //вставка строчек
        this.insertButton.textContent = 'Вставить строки';
        this.insertButton.classList.add('ag-grid-insert-button');
        this.insertButton.addEventListener('click', (e) => this.onInsert(e));
        
        this.deleteButton = document.createElement("button"); //удаление строчек
        this.deleteButton.textContent = 'Удалить';
        this.deleteButton.classList.add('ag-grid-delete-button');
        this.deleteButton.addEventListener('click', (e) => this.onDelete(e));
        
        this.eGui.appendChild(this.insertButton);
        this.eGui.appendChild(this.deleteButton);
    }

    onInsert(event) {
      event.stopPropagation();
      const api = this.params.api;
      const clickedNode = this.params.node;
      const selectedNodes = api.getSelectedNodes(); //получить выдленные строки
      
      // Нажата ли кнопка в выделенной строке
      const isBulkInsert = selectedNodes.length > 0 && 
                         selectedNodes.some(node => node.id === clickedNode.id);
      
      const nodesForInsert = isBulkInsert ? selectedNodes : [clickedNode];
      const defaultCount = 0;
      const question = isBulkInsert ? "Сколько пустых строк вставить под каждую выбранную?" : "Сколько пустых строк вставить?"
      const input = prompt(question);
      const count = parseInt(input) || defaultCount;
      
      if (count <= 0) return;
      
      // Получаем текущее состояние таблицы
      const allData = [];
      api.forEachNode(node => allData.push(node.data));
      
      // Накодим максимальный id
      const maxId = allData.reduce((max, row) => {
          const rowId = parseInt(row.id);
          return rowId > max ? rowId : max;
      }, 0);
      
      // Создаем массив новых строчек
      const inserts = [];
      let nextId = maxId + 1;
      
      nodesForInsert.forEach(node => {
          const rowIndex = allData.findIndex(row => row === node.data); //находим под какую строку вставлять
          if (rowIndex !== -1) {
              const newRows = Array(count).fill().map((_, i) => ({
                  id: nextId + i,
                  flag: true,
                  level: "",
                  surname: "",
                  name: "",
                  patronymic: "",
                  login: "",
                  password: "",
                  acsess: false,
                  startDate: null,
                  endDate: null,
                  email: "",
                  phone: null,
                  comment: "",
                  __isNew: true  // Помечаем новой строкой
              }));
              inserts.push({ index: rowIndex + 1, rows: newRows });
              nextId += count;
          }
      });
      
      // Добавляем строки
      inserts.forEach(insert => {
          allData.splice(insert.index, 0, ...insert.rows);
      });
      
      api.setGridOption('rowData', allData);
      
      // Убрать выделение со всех строк
      if (isBulkInsert) {
          api.deselectAll();
      }

      api.forEachNode(node => {
        if(node.data.__isNew) {
            node.setSelected(true);
        }
      });
    }

    onDelete(event) {
        event.stopPropagation();
        const api = this.params.api;
        const clickedNode = this.params.node;
        const selectedNodes = api.getSelectedNodes(); //так же выбираем выделенные строки
        
        const isBulkDelete = selectedNodes.length > 0 && 
                            selectedNodes.includes(clickedNode);
        
        const nodesToRemove = isBulkDelete ? selectedNodes : [clickedNode];
        
        if (!confirm(`Удалить строк: ${nodesToRemove.length}?`)) return;
        
        // В массив уддаленных строк закинуть только непустые
        const rowsToDelete = nodesToRemove
            .map(node => node.data)
            .filter(rowData => !isEmptyRow(rowData));
        deletedRows = [...deletedRows, ...rowsToDelete];
        
        // Удалить строки
        api.applyTransaction({
            remove: nodesToRemove.map(node => node.data)
        });
        
        api.deselectAll();
    }
    

    getGui() {
        return this.eGui;
    }

    destroy() {
        this.insertButton?.removeEventListener('click', this.onInsert);
        this.deleteButton?.removeEventListener('click', this.onDelete);
    }
}
function isEmptyRow(rowData) {
    // Проверка что строка пустая
    const { id, actions, ...fields } = rowData;
    return Object.values(fields).every(
        value => value === '' || value === null || value === undefined
    );
}
// Сохранение данных
function saveChanges() {
    if (!gridApi) {
        console.error('Grid API not initialized');
        return;
    }

    const allData = [];
    gridApi.forEachNode(node => allData.push(node.data)); //состояние таблицы

    const invalidNewRows = allData.filter(
        row => row.__isNew && (!row.login || !row.password)
    );

    if (invalidNewRows.length > 0) {
        alert("Ошибка: Логин и пароль обязательны для новых строк!");
        return; 
    }

    const noLevel = allData.filter(
        row => row.__isNew && (!row.level)
    );

    if ( noLevel.length > 0) {
        alert("Ошибка: Группа пользователей должна быть задана для новых строк!");
        return; 
    }
    
    // Находим измененные строки
    const changedRows = allData.filter(row => {
        if (row.__isNew) return false;
        
        const originalRow = originalData.find(r => r.id === row.id);
        if (!originalRow) return false; //по идее не должно срабатывать
        return JSON.stringify(row) !== JSON.stringify(originalRow);
    });
    
    // НАходим новые строки
    const newRows = allData.filter(row => row.__isNew);
    
    const changes = {
      updated: changedRows,
      new: newRows,
      deleted: deletedRows
    };
    
    if (changedRows.length === 0 && deletedRows.length === 0 && newRows.length === 0) {
        alert('Нет изменений для сохранения');
        return;
    }
    
    alert('Changes to save:' + JSON.stringify(changes));
    alert(`Сохранено: 
    ${changedRows.length} измененных, 
    ${deletedRows.length} удаленных,
    ${newRows.length} новых строк`);
      
      // отправка на сервер
      // fetch('/api/save-data', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(changed)
      // })
      // .then(response => response.json())
      // .then(data => {
      //     originalData = allData.map(row => ({...row}));
      //     alert('Изменения успешно сохранены');
      // });
      

      //это в fetch
      //Удалить удаленные строки
      originalData = originalData.filter(row => 
        !deletedRows.some(deleted => deleted.id === row.id)
      );
      deletedRows = [];

      //Обновить обновленные строки
      originalData = originalData.map(row => {
          const changed = changedRows.find(r => r.id === row.id);
          return changed ? {...changed} : row;
      });

      //Добавить добавленные строки
      originalData = [...originalData, ...newRows.map(row => {
          const { __isNew, ...cleanRow } = row;
          return cleanRow;
      })];

      gridApi.forEachNode(node => {
          if (node.data.__isNew) {
              const { __isNew, ...cleanData } = node.data;
              node.setData(cleanData);
          }
      });
}

PREDETERMINED_LIST = [
    "User",
    "Admin",
    "SuperAdmin"
]

// Объявление столбцов
const columnDefs = [
    { 
        field: "id",
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        rowDrag: true,
        cellRenderer: params => '',
        editable: false
    },
    {
        field: "level",
        headerName: "Группа пользователей",
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: PREDETERMINED_LIST },
    },
    { field: "surname", headerName: "Фамилия", editable: true },
    { field: "name", headerName: "Имя", editable: true },
    { field: "patronymic", headerName: "Oтчество", editable: true },
    { 
        field: "login",
        headerName: "Логин",
        cellClass: params => params.data.__isNew ? '' : 'non-editable-cell1',
        editable: params => params.node.isSelected() && params.data.__isNew
    },
    { 
        field: "password",
        headerName: "Пароль",
        cellClass: params => (params.data.__isNew) ? '' : 'non-editable-cell2',
        editable: params => params.node.isSelected() && params.data.__isNew
    },
    {
        field: "acsess",
        headerName: "Доступ",
        cellEditor: "agCheckboxCellEditor"
    },
    { 
        field: "startDate", 
        headerName: "Дата начала",
        cellEditor: 'agDateCellEditor',
        //cellRenderer: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
        cellEditorParams: {
            min: '2000-01-01',
            max: '2100-12-31'
        }
    },
    { 
        field: "endDate", 
        headerName: "Дата окончания",
        cellEditor: 'agDateCellEditor',
        //cellRenderer: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
        cellEditorParams: {
            min: '2000-01-01',
            max: '2100-12-31'
        }
    },
    { 
        field: "email", 
        headerName: "Email",
        cellEditor: 'agTextCellEditor',
    },
    { 
        field: "phone", 
        headerName: "Телефон",
        cellEditor: 'agNumberCellEditor',
    },
    { field: "comment",
      headerName: "Комментарий",
      cellEditor: "agLargeTextCellEditor",
      cellEditorParams: {
        maxLength: 1000
      },
     },
    {
        field: "actions",
        headerName: "Действия",
        cellRenderer: ActionsButtons,
        editable: false,
        sortable: false,
        filter: false,
        flex: 2,
    }
];

// НАстройки таблицы убрать закоментить когда будет сервер
const gridOptions = {
    columnDefs: columnDefs,
    rowData: loadData(),
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        filter: true,
        sortable: true,
        resizable: true,
        editable: params => params.node.isSelected()
    },
   
    rowSelection: 'multiple',
    rowDragManaged: true,
    animateRows: true,
    suppressRowClickSelection: true,
    enableCellTextSelection: false,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 20,

    
    // Можно редактировать только выделенные строки
    onCellEditingStarted: (params) => {
        if (!params.node.isSelected()) {
            params.api.stopEditing(true);
        }
    },

    onCellKeyDown: (params) => {
        if (params.event.ctrlKey && (params.event.key === 'c' || params.event.key === 'с')) {
            const selectedNodes = gridApi.getSelectedNodes();
            if (selectedNodes.length > 0) {
                const copiedData = selectedNodes.map(node => ({...node.data}));
                localStorage.setItem('agGridCopiedRows', JSON.stringify({
                    data: copiedData,
                    count: copiedData.length
                }));
                params.event.preventDefault();
            }
        }
        else if (params.event.ctrlKey && (params.event.key === 'v' || params.event.key === 'м')) {
            const copiedData = localStorage.getItem('agGridCopiedRows');
            if (copiedData) {
                const { data: parsedData, count: copiedCount } = JSON.parse(copiedData);
                const selectedNodes = gridApi.getSelectedNodes();
               
                if (selectedNodes.length === 0) {
                    // showNotification('Нет выбранных строк для вставки', 'error');
                    return;
                }32
               
                const rowsToPaste = Math.min(copiedCount, selectedNodes.length);
                const dataToPaste = parsedData.slice(0, rowsToPaste);
               
                selectedNodes.slice(0, rowsToPaste).forEach((node, index) => {
                    const newData = {
                        ...dataToPaste[index],
                        isChosen: true
                    };

                    try{
                        newData.startDate = new Date(newData.startDate);
                    } catch {}
                    try{
                        newData.endDate = new Date(newData.endDate);
                    } catch {}


                    node.setData(newData);
                });
               
                params.event.preventDefault();
            }
        }
    }
};
  
  document.getElementById("back").addEventListener("click", (e) => {
  
    sessionStorage.clear();
    e.preventDefault();
    window.location.href = "log-in.html";
  })