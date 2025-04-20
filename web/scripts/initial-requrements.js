// const { jsx } = require("react/jsx-runtime");

function loadData(){
    let answer = {
        information: {
            code: "ADW-32",
            name: "Начальные требования",
            headers: [
                {
                    header: "Источник требований",
                    type: "string",
                    maxSmth: 50,
                    name: "column1",
                    enabled: true

                },
                {
                    header: "Объект",
                    type: "string",
                    maxSmth: 50,
                    name: "column2",
                    enabled: true

                },
                {
                    header: "Требование",
                    type: "string",
                    maxSmth: 50,
                    name: "column3",
                    enabled: true

                },
                {
                    header: "Ед. изм.",
                    type: "string",
                    maxSmth: 50,
                    name: "column4",
                    enabled: true

                },
                {
                    header: "Количество 1",
                    type: "num",
                    maxSmth: 10000,
                    name: "column5",
                    enabled: false

                },
                {
                    header: "Количество 2",
                    type: "num",
                    maxSmth: 10000,
                    name: "column6",
                    enabled: true

                },
                {
                    header: "Код",
                    type: "string",
                    maxSmth: 50,
                    name: "column7",
                    enabled: true

                }

            ]

        },
        data: [
            {"column1": "11111", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            {"column1": "22222", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            {"column1": "33333", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" },
            {"column1": "44444", "column2": "kykjyuk", "column3": "adsadad", "column4": "Sahjda", "column5": 678, "column6": 959.6, "column7": "asadad" },
            {"column1": "55555", "column2": "l,ljykjyuk", "column3": "pooadad", "column4": "iuuuada", "column5": 678, "column6": 969.6, "column7": "asadad"},
            {"column1": "66666", "column2": "qaykjyuk", "column3": "ksadad", "column4": "uuada", "column5": 678, "column6": 99.6, "column7": "asadad" },
            {"column1": "77777", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            {"column1": "88888", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            {"column1": "99999", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" },
            {"column1": "11111", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            {"column1": "22222", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            {"column1": "33333", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" },
            {"column1": "44444", "column2": "kykjyuk", "column3": "adsadad", "column4": "Sahjda", "column5": 678, "column6": 959.6, "column7": "asadad" },
            {"column1": "55555", "column2": "l,ljykjyuk", "column3": "pooadad", "column4": "iuuuada", "column5": 678, "column6": 969.6, "column7": "asadad"},
            {"column1": "66666", "column2": "qaykjyuk", "column3": "ksadad", "column4": "uuada", "column5": 678, "column6": 99.6, "column7": "asadad" },
            {"column1": "77777", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            {"column1": "88888", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            {"column1": "99999", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" }
        ]
    };
    return answer;
}

function returnGridOptions(information, data){ //получить настройки таблицы

    let coldefs = []; //выбрать только включенные столбики
    information.headers.forEach(element => {
        if(element.enabled){
            let column = {field: element.name, headerName: element.header};
            if(element.type === "string") {
                column.cellEditor = 'agTextCellEditor';
                column.cellEditorParams = {maxLength: element.maxSmth};
                column.filter = 'agTextColumnFilter';
            }
            else if (element.type === "num") {
                column.cellEditor = 'agNumberCellEditor';
                column.cellEditorParams = {min: 0, max: element.maxSmth, precision: 1};
                column.filter = 'agNumberColumnFilter';
            }
            coldefs.push(column);
        }
    });

    coldefs[0].rowDrag = true;
    for(let i = 0; i < 3; ++i) {
        coldefs[i].pinned = "left";
        coldefs[i].flex = 0.8;
    }

    let id = 0

    for(let i = 0; i < data.length; ++i) {
        if(!(data[i].id === undefined || data[i].id === null)){
            break
        }
        data[i].id = id;
        ++id;
    }

    let gridOptions = {
        rowData: data,
        columnDefs: coldefs,
        defaultColDef: {
            flex: 1,
            editable: true,
            sortable: true,
            filter: true,
            enableCellChangeFlash: true,
            lockPosition: true
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
        enableCellTextSelection: false,
        suppressClipboardPaste: false,
        rowDragMultiRow: true,


        onRowDoubleClicked: event => { //выделение по дв щелчк
            if (event.node.isSelected()){
            event.node.setSelected(false);
        } else {event.node.setSelected(true);}
        },

    };

    return gridOptions
}

let gridApi;

let localSaveData = []; //для локального сохранения
let dataForFilter = []; //для локального сохранения

let deletedNodes = [];

function localSave() {
    let newData = JSON.parse(JSON.stringify(dataForFilter));
    let filteredData = [];
    gridApi.forEachNode(node => filteredData.push(node.data));

    console.log(newData, filteredData, "before saving")

    for(let i = 0; i < deletedNodes.length; ++i){
        const index = newData.findIndex(element => JSON.stringify(element) === JSON.stringify(deletedNodes[i]))
        if(index !== -1){
            newData.splice(index, 1);
        }
    }

    data = [];

    console.log(newData, filteredData, "after delition")

    for(let i = 0; i < filteredData.length; ++i){
        const index = newData.findIndex(element => element.id === filteredData[i].id)
        if(index !== -1){
            newData[index] = filteredData[i]
        }
        else{
            newData.push(filteredData[i]);
        }
    }

    console.log(newData, filteredData, "after saving")

    localSaveData = JSON.parse(JSON.stringify(newData));

    sessionStorage.setItem("initial-requrements-data", JSON.stringify(localSaveData));
    console.log(JSON.parse(sessionStorage.getItem("initial-requrements-data")));
    console.log('Saving all:', localSaveData);
    showNotification(`Сохранено строк: ${localSaveData.length}`);
    
}

const listSourceBtn = document.getElementById("listSourceBtn");
const listObjectBtn = document.getElementById("listObjectBtn");

function setupButtons() {

    document.getElementById("redoBtn").addEventListener("click", (e) => {
        gridApi.redoCellEditing();
      });
  
      document.getElementById("undoBtn").addEventListener("click", (e) => {
        gridApi.undoCellEditing();
      });

    // Сохранение всей таблицы
    document.getElementById('saveAllBtn').addEventListener('click', localSave);

    document.getElementById('removeFiltersBtn').addEventListener('click', () => {
        gridApi.setFilterModel(null);
    });
    

    // Вставка строк (обновлённая версия)
    document.getElementById('insertRowsBtn').addEventListener('click', (e) => {
        //alert("sdsd");
         if (e.processed) return; // Если событие уже обработано
         e.processed = true;
         const selectedNodes = gridApi.getSelectedNodes();
         const defaultCount = 0;
        
         const question = selectedNodes.length > 0
             ? "Сколько пустых строк вставить под каждую выбранную?"
             : "Сколько пустых строк добавить в конец таблицы?";
        
         const input = prompt(question, defaultCount);
         const count = parseInt(input) || defaultCount;
         if (count <= 0) return;
        
         const allData = [];
         gridApi.forEachNode(node => allData.push(node.data));
        
         const maxId = dataForFilter.reduce((max, row) => {
            const rowId = parseInt(row.id);
            return rowId > max ? rowId : max;
            }, 0);

            console.log(maxId)
        
        // Создаем массив новых строчек
        const inserts = [];
        let nextId = maxId + 1;
         if (selectedNodes.length > 0) {
             // Вставка под выделенные строки
             selectedNodes.forEach(node => {
                 const rowIndex = allData.findIndex(row => row === node.data);
                 if (rowIndex !== -1) {
                     inserts.push({
                         index: rowIndex + 1,
                         rows: Array(count).fill().map((_, i) => ({
                            "id" : nextId+i,
                            "column1" : listSourceBtn.textContent === "Все" ? "" : listSourceBtn.textContent,
                            "column2" : listObjectBtn.textContent === "Все" ? "" : listObjectBtn.textContent,
                            "column3" : "",
                            "column4" : "",
                            "column5" : null,
                            "column6" : null,
                            "column7" : "",
                         }))
                     });
                 }
             });
         } else {
             // Вставка в конец
             inserts.push({
                 index: allData.length,
                 rows: Array(count).fill().map((_, i) => ({
                        "id" : nextId+i,
                        "column1" : listSourceBtn.textContent === "Все" ? "" : listSourceBtn.textContent,
                        "column2" : listObjectBtn.textContent === "Все" ? "" : listObjectBtn.textContent,
                        "column3" : "",
                        "column4" : "",
                        "column5" : null,
                        "column6" : null,
                        "column7" : "",
                 }))
             });
         }
        
         inserts.sort((a, b) => b.index - a.index);
         inserts.forEach(insert => {
             allData.splice(insert.index, 0, ...insert.rows);
         });
        
         gridApi.setGridOption('rowData', allData);
         console.log(allData)
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

        deletedNodes = deletedNodes.concat(selectedNodes.map(node => node.data));

        gridApi.applyTransaction({
            remove: selectedNodes.map(node => node.data)
        });
       
        gridApi.deselectAll();
    });

    //выпадающие списки

    const dropUps = Array.from(document.getElementsByClassName("dropUp"));

    for (let i = 0; i < dropUps.length; ++i) {
        dropUps[i].addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropUps[i].children[0].style.display === 'flex';
            dropUps[i].children[0].style.display = isOpen ? 'none' : 'flex';
        });

        dropUps[i].addEventListener('mouseleave', function() {
            setTimeout(() => {
            if (!dropUps[i].children[0].matches(':hover')) {
                dropUps[i].children[0].style.display = 'none';
            }
            }, 200);
        });
    }

    let dropUpBtns = Array.from(document.getElementsByClassName("dropUpBtn"));

    for(let i = 0; i  < dropUpBtns.length; ++i) {
        dropUpBtns[i].addEventListener('click', function() {
            console.log(this.textContent);
        });
    }
    
    const dropDowns = Array.from(document.getElementsByClassName("dropdown"));

    for (let i = 0; i < dropDowns.length; ++i) {
        dropDowns[i].addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropDowns[i].children[0].style.display === 'flex';
            dropDowns[i].children[0].style.display = isOpen ? 'none' : 'flex';
        });

        dropDowns[i].addEventListener('mouseleave', function() {
            setTimeout(() => {
            if (!dropDowns[i].children[0].matches(':hover')) {
                dropDowns[i].children[0].style.display = 'none';
            }
            }, 200);
        });
    }

    let dropDownBtns = Array.from(document.getElementsByClassName("dropdownBtn"));

    for(let i = 0; i  < dropDownBtns.length; ++i) {
        dropDownBtns[i].addEventListener('click', function() {
            // console.log(this.textContent);
        });
    }

    
        
}

document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    let serverData = loadData();

    localSaveData = JSON.parse(sessionStorage.getItem("initial-requrements-data"));
    let GrdOptions;

    if(!localSaveData) {
        GrdOptions = returnGridOptions(serverData.information, serverData.data);
        localSaveData = JSON.parse(JSON.stringify(serverData.data));
        let id = 0;
        for(let i = 0; i < localSaveData.length; ++i) {
            localSaveData[i].id = id
            ++id;
        }

        dataForFilter = JSON.parse(JSON.stringify(localSaveData));
    }
    else{
        GrdOptions = returnGridOptions(serverData.information, localSaveData);
        dataForFilter = JSON.parse(JSON.stringify(localSaveData));
    }
    gridApi = agGrid.createGrid(document.getElementById("myGrid"), GrdOptions);
    setupButtons();
    document.getElementById("mainFormName").textContent = serverData.information.name;
    document.getElementById("code").textContent = serverData.information.code;

    document.getElementById("listSourceBtn").textContent = "Все";
    document.getElementById("listObjectBtn").textContent = "Все";
    addSourceListener(document.getElementById("sourceOptions").children[0])
    addObjectListener(document.getElementById("objectOptions").children[0])

    CreateSourceOptions();
    CreateObjectOptions();

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

document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    console.log(localSaveData, dataForFilter);
    console.log(typeof localSaveData, typeof dataForFilter)
    if(dataForFilter.length !== localSaveData.length){
        if(confirm(`Сохранить данные в табице?`)){
            localSave();
        }
    }
    else{
        for(let i = 0; i < dataForFilter.length; ++i){
            if(JSON.stringify(dataForFilter[i]) !== JSON.stringify(localSaveData[i])){
                
                if(confirm(`Сохранить данные в табице?`)){
                    localSave();
                }
                break
            }
        }
    }
    //window.location.href = "log-in.html";
})

document.getElementById("nextBtn").addEventListener("click", (e) => {
    e.preventDefault();
    console.log(localSaveData);

    if(dataForFilter.length !== localSaveData.length){
        if(confirm(`Сохранить данные в табице?`)){
            localSave();
        }
    }
    else{
        for(let i = 0; i < dataForFilter.length; ++i){
            if(JSON.stringify(dataForFilter[i]) !== JSON.stringify(localSaveData[i])){
                
                if(confirm(`Сохранить данные в табице?`)){
                    localSave();
                }
                break
            }
        }
    }
    //window.location.href = "log-in.html";
})

document.getElementById("exitBtn").addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

document.getElementById("toServerBtn").addEventListener("click", (e) => {
    localSave();
    showNotification(`Сохранено строк в модели: ${localSaveData.length}`);
})

function CreateSourceOptions(){
    allSourses = new Set();
    dataForFilter.forEach(node => allSourses.add(node.column1));
    const sourceOptions = document.getElementById("sourceOptions");
    
    sourceOptions.querySelectorAll('button:not(:first-child)')
    .forEach(button =>  button.remove() );


    Array.from(allSourses).sort().forEach(source => {
        const newSource = document.createElement("button");
        newSource.classList.add("dropdownBtn");
        newSource.classList.add("sourceBtn");
        newSource.textContent = source;
        addSourceListener(newSource);
        sourceOptions.appendChild(newSource);
    })
}

listSourceBtn.addEventListener("click", CreateSourceOptions);

function CreateObjectOptions(){
    allObjects = new Set();
    dataForFilter.forEach(node => allObjects.add(node.column2));
    const objectOptions = document.getElementById("objectOptions");
    
    objectOptions.querySelectorAll('button:not(:first-child)')
    .forEach(button =>  button.remove() );


    Array.from(allObjects).sort().forEach(object => {
        const newObject = document.createElement("button");
        newObject.classList.add("dropdownBtn");
        newObject.classList.add("objectBtn");
        newObject.textContent = object;
        addObjectListener(newObject);
        objectOptions.appendChild(newObject);
    })
}

listObjectBtn.addEventListener("click", CreateObjectOptions);

function addSourceListener(sourceBtn){
    sourceBtn.addEventListener("click", (e) => {
        listSourceBtn.textContent = e.target.textContent;

        const filteredData = [];
        gridApi.forEachNode(node => filteredData.push(node.data));
       
        filteredData.sort((a, b) => a.id - b.id)
        const newData = JSON.parse(JSON.stringify(dataForFilter));


        for(let i = 0; i < deletedNodes.length; ++i){
            const index = newData.findIndex(element => JSON.stringify(element) === JSON.stringify(deletedNodes[i]));
            if(index !== -1){
                newData.splice(index, 1);
            }
        }
        for(let i = 0; i < filteredData.length; ++i){
            const index = newData.findIndex(element => element.id === filteredData[i].id)
            if(index !== -1){
                newData[index] = filteredData[i]
            }
            else{
                newData.push(filteredData[i]);
            }
        }
        dataForFilter = JSON.parse(JSON.stringify(newData));

        if(listSourceBtn.textContent === "Все"){
            if(listObjectBtn.textContent === "Все"){
                gridApi.setGridOption('rowData', newData);
            }
            else{
                gridApi.setGridOption('rowData', newData.filter(element => element.column2 === listObjectBtn.textContent));
            }
        }
        else{
            if(listObjectBtn.textContent === "Все"){
                gridApi.setGridOption('rowData', newData.filter(element => element.column1 === listSourceBtn.textContent));
            }
            else{
                gridApi.setGridOption('rowData', newData.filter(element => element.column1 === listSourceBtn.textContent && element.column2 === listObjectBtn.textContent));
            }
        }
    })
}

function addObjectListener(objectBtn){
    objectBtn.addEventListener("click", (e) => {
        listObjectBtn.textContent = e.target.textContent;

        const filteredData = [];
        gridApi.forEachNode(node => filteredData.push(node.data));
        filteredData.sort((a, b) => a.id - b.id)
        const newData = JSON.parse(JSON.stringify(dataForFilter));


        for(let i = 0; i < deletedNodes.length; ++i){
            const index = newData.findIndex(element => JSON.stringify(element) === JSON.stringify(deletedNodes[i]));
            if(index !== -1){
                newData.splice(index, 1);
            }
        }


        for(let i = 0; i < filteredData.length; ++i){
            const index = newData.findIndex(element => element.id === filteredData[i].id)
            if(index !== -1){
                newData[index] = filteredData[i]
            }
            else{
                newData.push(filteredData[i]);
            }
        }

        dataForFilter = JSON.parse(JSON.stringify(newData));

        if(listObjectBtn.textContent === "Все"){
            if(listSourceBtn.textContent === "Все"){
                gridApi.setGridOption('rowData', newData);
            }
            else{
                gridApi.setGridOption('rowData', newData.filter(element => element.column1 === listSourceBtn.textContent));
            }
        }
        else{
            if(listSourceBtn.textContent === "Все"){
                gridApi.setGridOption('rowData', newData.filter(element => element.column2 === listObjectBtn.textContent));
            }
            else{
                gridApi.setGridOption('rowData', newData.filter(element => element.column2 === listObjectBtn.textContent && element.column1 === listSourceBtn.textContent));
            }
        }
    })
}