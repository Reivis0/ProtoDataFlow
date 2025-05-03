// const { jsx } = require("react/jsx-runtime");

function loadData(){
    let answer = {
        information: {
            code: "ADW-15",
            name: "Требования (Спецификация)",
            headers: [
                {
                    header: "Название 1",
                    type: "string",
                    maxSmth: 50,
                    name: "column1",
                    enabled: true

                },
                {
                    header: "Название 2",
                    type: "string",
                    maxSmth: 50,
                    name: "column2",
                    enabled: true

                },
                {
                    header: "Название 3",
                    type: "string",
                    maxSmth: 50,
                    name: "column3",
                    enabled: true

                },
                {
                    header: "Название 4",
                    type: "string",
                    maxSmth: 50,
                    name: "column4",
                    enabled: true

                },
                {
                    header: "Название 5",
                    type: "num",
                    maxSmth: 10000,
                    name: "column5",
                    enabled: true

                },
                {
                    header: "Название 6",
                    type: "num",
                    maxSmth: 10000,
                    name: "column6",
                    enabled: true

                },
                {
                    header: "Название 7",
                    type: "string",
                    maxSmth: 50,
                    name: "column7",
                    enabled: true

                }

            ]

        },
        data: [
            {"flag": true, "column1": "11111", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            {"flag": true, "column1": "22222", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            // {"flag": true, "column1": "33333", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" },
            // {"flag": true, "column1": "44444", "column2": "kykjyuk", "column3": "adsadad", "column4": "Sahjda", "column5": 678, "column6": 959.6, "column7": "asadad" },
            // {"flag": true, "column1": "55555", "column2": "l,ljykjyuk", "column3": "pooadad", "column4": "iuuuada", "column5": 678, "column6": 969.6, "column7": "asadad"},
            // {"flag": true, "column1": "66666", "column2": "qaykjyuk", "column3": "ksadad", "column4": "uuada", "column5": 678, "column6": 99.6, "column7": "asadad" },
            // {"flag": true, "column1": "77777", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            // {"flag": true, "column1": "88888", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            // {"flag": true, "column1": "99999", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" },
            // {"flag": true, "column1": "11111", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            // {"flag": true, "column1": "22222", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            // {"flag": true, "column1": "33333", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" },
            // {"flag": true, "column1": "44444", "column2": "kykjyuk", "column3": "adsadad", "column4": "Sahjda", "column5": 678, "column6": 959.6, "column7": "asadad" },
            // {"flag": true, "column1": "55555", "column2": "l,ljykjyuk", "column3": "pooadad", "column4": "iuuuada", "column5": 678, "column6": 969.6, "column7": "asadad"},
            // {"flag": true, "column1": "66666", "column2": "qaykjyuk", "column3": "ksadad", "column4": "uuada", "column5": 678, "column6": 99.6, "column7": "asadad" },
            // {"flag": true, "column1": "77777", "column2": "fdjykjyuk", "column3": "qdqssadad", "column4": "hrtsadada", "column5": 678, "column6": 999.6, "column7": "asadad" },
            // {"flag": true, "column1": "88888", "column2": "ujykjyuk", "column3": "jdadad", "column4": "efada", "column5": 678, "column6": 979.6, "column7": "asadad" },
            // {"flag": true, "column1": "99999", "column2": "vbykjyuk", "column3": "vxcvadad", "column4": "lkjhlsadada", "column5": 678, "column6": 9969.6, "column7": "asadad" }
        ]
    };
    return answer;
}

function returnGridOptions(information, data){ //получить настройки таблицы

    let coldefs = [{field: "flag", headerName: "", cellEditor: "agCheckboxCellEditor"}]; //выбрать только включенные столбики
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
                column.type = "rightAligned";
                column.flex = '1';
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
        // if(!(data[i].id === undefined || data[i].id === null)){
        //     break
        // }
        data[i].id = id;
        ++id;
    }

    while(data.length < 15){
        data.push({
                   "id" : ++id,
                   "flag": false,
                   "column1" : "",
                   "column2" : "",
                   "column3" : "",
                   "column4" : "",
                   "column5" : null,
                   "column6" : null,
                   "column7" : "",
        });
    }

    let gridOptions = {
        rowData: data,
        columnDefs: coldefs,
        defaultColDef: {
            flex: 2,
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

function localSave(flag=true) {
    const allData = [];
    gridApi.forEachNode(node => allData.push(node.data));
    localSaveData = JSON.parse(JSON.stringify(allData));

    forMatricies = JSON.parse(sessionStorage.getItem("for-matricies"));
    tempArray = []
    localSaveData.forEach(row => {
        const {id, flag, ...data } = row;
        if(!Array.from(Object.keys(data)).every(el => {
            return (data[el] === "" || data[el] == null)
        })){
            tempArray.push(row);
        }
    });
    forMatricies[currentObjAndType.Object]["views"][`${curView.header}`][`${curComp.name}`] = tempArray;

    sessionStorage.setItem("for-matricies", JSON.stringify(forMatricies));
    console.log(JSON.parse(sessionStorage.getItem("for-matricies")));
    console.log('Saving all:', allData);
    if(flag){showNotification(`Сохранено ${tempArray.length} строк (вся таблица)`);}
    
}


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
        
        // Создаем массив новых строчек
        const inserts = [];
         if (selectedNodes.length > 0) {
             // Вставка под выделенные строки
             selectedNodes.forEach(node => {
                 const rowIndex = allData.findIndex(row => row === node.data);
                 if (rowIndex !== -1) {
                     inserts.push({
                         index: rowIndex + 1,
                         rows: Array(count).fill().map((_, i) => ({
                            "column1" : "",
                            "column2" : "",
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
                        "column1" : "",
                        "column2" : "",
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
}

let initialRequrements = [];
let currentObjAndType;
let curView;
let curComp;

document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    let login = sessionStorage.getItem("GlobalLogin");
    if(login === '' || login === null) {
        e.preventDefault();
        //window.location.assigsn("log-in.html");
        window.location.href = "log-in.html";
    }

    // let messageForIdentification = {login: login, model: "model", variant: "var"};
    // fetch('http://127.0.0.1:8080/api/auth', { 
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(messageForIdentification),
    //   }
    
    // )
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json(); 
    // })
    // .then(serverData => {

    //     curView = JSON.parse(sessionStorage.getItem("currentView"));

    //     document.getElementById("ViewCode").textContent = curView.code;
    //     document.getElementById("ViewName").textContent = curView.header;
    //     curComp = JSON.parse(sessionStorage.getItem("curComp"));
    //     document.getElementById("CompCode").textContent = curComp.code;
    //     document.getElementById("CompName").textContent = curComp.name;


    //     currentObjAndType = JSON.parse(sessionStorage.getItem("currentObjAndType"));
    //     document.getElementById("objectName").textContent = currentObjAndType.Object;
    //     document.getElementById("objectType").textContent = currentObjAndType.Type;
    //     let GrdOptions;

    //     if(!localSaveData) {
    //         GrdOptions = returnGridOptions(serverData.information, serverData.data);
    //         localSaveData = JSON.parse(JSON.stringify(serverData.data));
    //     }
    //     else{
    //         console.log(localSaveData);
    //         GrdOptions = returnGridOptions(serverData.information, localSaveData);
    //     }


    //     gridApi = agGrid.createGrid(document.getElementById("myGrid"), GrdOptions);
    //     setupButtons();
    // })
    // .catch(error => {
    //     console.error('Error fetching data:', error);
    // });



    let serverData = loadData();
    
    curView = JSON.parse(sessionStorage.getItem("currentView"));

    document.getElementById("ViewCode").textContent = curView.code;
    document.getElementById("ViewName").textContent = curView.header;
    curComp = JSON.parse(sessionStorage.getItem("curComp"));
    console.log(curComp);
    document.getElementById("CompCode").textContent = curComp.code;
    document.getElementById("CompName").textContent = curComp.name;
    
    
    currentObjAndType = JSON.parse(sessionStorage.getItem("currentObjAndType"));
    document.getElementById("objectName").textContent = currentObjAndType.Object;
    document.getElementById("objectType").textContent = currentObjAndType.Type;
    let GrdOptions;
    forMatricies = JSON.parse(sessionStorage.getItem("for-matricies"));
    
    localSaveData = forMatricies[currentObjAndType.Object]["views"][`${curView.header}`][`${curComp.name}`]
    
    if(!localSaveData.length) {
        GrdOptions = returnGridOptions(serverData.information, serverData.data);
        //localSaveData = JSON.parse(JSON.stringify(serverData.data));
    }
    else{
        console.log(localSaveData);
        GrdOptions = returnGridOptions(serverData.information, localSaveData);
    }


    gridApi = agGrid.createGrid(document.getElementById("myGrid"), GrdOptions);
    setupButtons();
    localSave(false);

    document.getElementById("equalsBtn").disabled = !IsComplianceEnabled();
    createComplianceButtons();
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

let counter3;

document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let curDat = [];
    gridApi.forEachNode(node => {
        curDat.push(node.data)
    });

    if(curDat.length !== localSaveData.length){
        if(confirm(`Сохранить данные в табице?`)){
            localSave();
        }
    }
    else{
        for(let i = 0; i < curDat.length; ++i){
            if(JSON.stringify(curDat[i]) !== JSON.stringify(localSaveData[i])){
                
                if(confirm(`Сохранить данные в табице?`)){
                    localSave();
                }
                break
            }
        }
    }

    counter3 = sessionStorage.getItem("counter3");
    counter3 = Math.max(-1, counter3 - 1);
    sessionStorage.setItem("counter3", counter3);
    if(counter3 === -1){
        
        window.location.href = "View.html";
    }
    else{
        sessionStorage.setItem("curComp", JSON.stringify(curView.components[counter3]));
        window.location.href = "component.html";
    }
    
})

document.getElementById("nextBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let curDat = [];
    gridApi.forEachNode(node => {
        curDat.push(node.data)
    });
    // console.log(curDat, localSaveData);
    if(curDat.length !== localSaveData.length){
        if(confirm(`Сохранить данные в табице?`)){
            localSave();
        }
    }
    else{
        for(let i = 0; i < curDat.length; ++i){
            if(JSON.stringify(curDat[i]) !== JSON.stringify(localSaveData[i])){
                
                if(confirm(`Сохранить данные в табице?`)){
                    localSave();
                }
                break
            }
        }
    }

    if(sessionStorage.getItem("cellBtnPressed") === "true"){
        window.location.href = "View.html";
        return
    }

    counter3 = sessionStorage.getItem("counter3");
    if(parseInt(counter3) === curView.components.length -1){
        //sessionStorage.setItem("counter3", -1);
        let counter2 = sessionStorage.getItem("counter2");
        
        let numOfViews = JSON.parse(sessionStorage.getItem("Views")).length;
        if(parseInt(counter2) === numOfViews - 1){
            //sessionStorage.setItem("counter2", 0);
            let counter1 = sessionStorage.getItem("counter1");
            let numOfObj = JSON.parse(sessionStorage.getItem("all-objects")).length;
            
            if(parseInt(counter1) === numOfObj - 1) {
                // sessionStorage.setItem("counter3", -1);
                // sessionStorage.setItem("counter1", -1);
                // sessionStorage.setItem("counter2", 0);
                sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page:"component.html", name: null, flag: false}));
                window.location.href = "compliance-matrix.html";
            }
            else{
                sessionStorage.setItem("counter3", -1);
                sessionStorage.setItem("counter2", 0);
                window.location.href = "all-objects.html";
            }
        }
        else{
            sessionStorage.setItem("counter3", -1);
            ++counter2;
            sessionStorage.setItem("counter2", counter2);
            window.location.href = "View.html";
        }
    }
    else{
        ++counter3;
        sessionStorage.setItem("counter3", counter3);
        sessionStorage.setItem("curComp", JSON.stringify(curView.components[counter3]));
        //alert(counter3);
        window.location.href = "component.html";
    }
    

})

document.getElementById("exitBtn").addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

document.getElementById("toServerBtn").addEventListener("click", (e) => {
    localSave();
    const message = {
        object: currentObjAndType.Object,
        data: localSaveData
    };
    console.log(message);
    fetch('http://127.0.0.1:8080/api/auth', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({information:"asda", data:message}),
      }
      )
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); 
      })
      .then(answer => {
          console.log(answer);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
    showNotification(`Сохранено строк в модели: ${localSaveData.length}`);
})

function IsComplianceEnabled(){
    let forMatricies = JSON.parse(sessionStorage.getItem("for-matricies"));
    let goodViews = 0;
    let objs = Array.from(Object.keys(forMatricies));
    for(let i = 0; i < objs.length; ++i){
        let views = Array.from(Object.keys(forMatricies[objs[i]]["views"]));
        for(let j = 0; j < views.length; ++j){
            let comps = Array.from(Object.keys(forMatricies[objs[i]]["views"][views[j]]));
            //let goodComps = 0;
            for(let k = 0; k < comps.length; ++k){
                if(forMatricies[objs[i]]["views"][views[j]][comps[k]].length > 0){
                    ++goodViews;
                    break
                }
            }
            if(goodViews > 1){break;}
        }
        if(goodViews > 1){break;}
    }
    return (goodViews > 1);
}

function createComplianceButtons(){
    let div = document.getElementById("matrixCompliance");
    div.querySelectorAll('button:not(:first-child)').forEach(button =>  button.remove() );
    let complianceData = JSON.parse(sessionStorage.getItem("compliance-matricies-data"));
    let names = Array.from(Object.keys(complianceData));
    names.forEach(name => {
        const button = document.createElement("button");
        button.className = "dropUpBtn";
        button.textContent = name;
        button.addEventListener("click", (e) => {
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page:"component.html", name: name, flag: true}));
            window.location.href = "compliance-matrix.html";
        });
        div.appendChild(button);
    });
    div.children[0].addEventListener("click", (e) => {
        sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page:"component.html", name: null, flag: true}));
        window.location.href = "compliance-matrix.html";
    });
}
