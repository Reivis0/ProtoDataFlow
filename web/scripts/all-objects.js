
function loadData(){
    let data = {
        "Objects": ["dfdsfsd", "dfsdfsdf", "aaeo,l", "asdadad", " gsdgsgsgfg", "hhtrd"],
        "Types": [
            {
                "num" : 1,
                "name": "Type1"
            },
            {
                "num" : 4,
                "name": "Type4"
            },
            {
                "num" : 12,
                "name": "Type12"
            },
        ],
        "data" : [
            {
                "Object": "dfdsfsd",
                "Type": 4
            },
            {
                "Object": "dfsdfsdf",
                "Type": null
            },
            {
                "Object": "hhtrd",
                "Type": 1
            },
            {
                "Object": "aaeo,l",
                "Type": 12
            }
        ],
        "information":{
        "code": "QWE-3",
        "name": "Перечень моделируемых объектов",
        "Settings": [
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": false,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example":true
            }

        ]
    }
    }

    return data;
}

function loadViews(){
    let views = [
        {
            "number": 1,
            "header": "Представление_1",
            "code": "SDFS-3",
            "components": [
                {
                    "number": 1,
                    "name": "Компонент_1",
                    "code": "fafa-53_"
                },
                {
                    "number": 2,
                    "name": "Компонент_2",
                    "code": "fafa-54"
                },
                {
                    "number": 3,
                    "name": "Компонент_3",
                    "code": "fafa-55"
                }
            ]
    
    
        },
        {
            "number": 2,
            "header": "Представление_2",
            "code": "SDFS-3",
            "components": [
                {
                    "number": 1,
                    "name": "Компонент_1",
                    "code": "fafa-53_"
                },
                {
                    "number": 2,
                    "name": "Компонент_2",
                    "code": "fafa-54"
                },
                {
                    "number": 3,
                    "name": "Компонент_3",
                    "code": "fafa-55"
                }
            ]
    
    
        },
        {
            "number": 5,
            "header": "Представление_5",
            "code": "SDFS-3",
            "components": [
                {
                    "number": 1,
                    "name": "Компонент_1",
                    "code": "fafa-53_"
                },
                {
                    "number": 2,
                    "name": "Компонент_2",
                    "code": "fafa-54"
                },
                {
                    "number": 3,
                    "name": "Компонент_3",
                    "code": "fafa-55"
                }
            ]
    
    
        }
    ]

    return views;
}

class ActionsButtons {
    init(params) {
        this.params = params;
        this.eGui = document.createElement("div");
        this.eGui.style.display = "flex";
        this.eGui.style.gap = "5px";
        this.eGui.style.justifyContent = "center";
        
        this.loadPMButton = document.createElement("button"); //загрузить ЭМ
        

        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );

        iconSvg.setAttribute('height', '24px');
        iconSvg.setAttribute('viewBox', '0 -960 960 960');
        iconSvg.setAttribute('width', '24px');
        iconSvg.setAttribute('fill', '#1f1f1f');

        iconPath.setAttribute(
            'd',
            'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h200v80H160v480h640v-480H600v-80h200q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-184L280-544l56-56 104 104v-304h80v304l104-104 56 56-200 200Z'
        );



        iconSvg.appendChild(iconPath);
        this.loadPMButton.appendChild(iconSvg);
        this.loadPMButton.classList.add("actionButton");
        
        this.loadExampleButton = document.createElement("button"); //Загрузить пример
        

        const iconSvg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconPath2 = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );

        iconSvg2.setAttribute('height', '24px');
        iconSvg2.setAttribute('viewBox', '0 -960 960 960');
        iconSvg2.setAttribute('width', '24px');
        iconSvg2.setAttribute('fill', '#1f1f1f');

        iconPath2.setAttribute(
            'd',
            'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v80h-80v-80H200v560h560v-80h80v80q0 33-23.5 56.5T760-120H200Zm480-160-56-56 103-104H360v-80h367L624-624l56-56 200 200-200 200Z'
        );



        iconSvg2.appendChild(iconPath2);
        this.loadExampleButton.appendChild(iconSvg2);
        this.loadExampleButton.classList.add("actionButton");

        this.goToViewsButton = document.createElement("button"); //перейти к представлению
        

        const iconSvg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconPath3 = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );

        iconSvg3.setAttribute('height', '24px');
        iconSvg3.setAttribute('viewBox', '0 -960 960 960');
        iconSvg3.setAttribute('width', '24px');
        iconSvg3.setAttribute('fill', '#1f1f1f');

        iconPath3.setAttribute(
            'd',
            'M80-240v-480h80v480H80Zm560 0-57-56 144-144H240v-80h487L584-664l56-56 240 240-240 240Z'
        );



        iconSvg3.appendChild(iconPath3);
        this.goToViewsButton.appendChild(iconSvg3);
        this.goToViewsButton.classList.add("actionButton")

        this.goToViewsButton.disabled = true;

        this.goToViewsButton.title = "Перейти к требованиям к объекту";
        this.loadPMButton.title = "Загрузить ЭМ";
        this.loadExampleButton.title = "Загрузить пример";
        
        this.eGui.appendChild(this.goToViewsButton);
        this.eGui.appendChild(this.loadPMButton);
        this.eGui.appendChild(this.loadExampleButton);

        this.goToViewsButton.addEventListener("click", (e) => {
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
            sessionStorage.setItem("counter2", 0);
            sessionStorage.setItem("currentObjAndType", JSON.stringify(this.params.data));
            // console.log(JSON.stringify(this.params.data));
            window.location.href = "specific-requrements.html";
        })
    }


    getGoToViewsButton() {
        return this.goToViewsButton;
    }
    getLoadExampleButton() {
        return this.loadExampleButton;
    }
    getLoadPMButton() {
        return this.loadPMButton;
    }
    

    getGui() {
        return this.eGui;
    }

    destroy() {
        this.insertButton?.removeEventListener('click', this.onInsert);
        this.deleteButton?.removeEventListener('click', this.onDelete);
    }
}

let gridApi;

let localSaveData = [];

let Objects = [""];
const Types = ["(нет)"];
let typesDictionary = {};

let enabledButtons = [];


function createGridOptions(data, flag) {

    Objects = Objects.concat(data.Objects);
    data.Types.forEach(type => {
        typesDictionary[type.num] = type.name;
        Types.push(type.name);
    });
    let rows = data.data;
    if(flag){
        rows.forEach(row => {

            if(row.Type === undefined || row.Type === null || row.Type === "") {
                row.Type = Types[0];
            }
            else{
            row.Type = typesDictionary[row.Type];
            }
            
        });
    }

    while(rows.length !== Objects.length - 1){
        rows.push({Object: "", Type: ""});
    }
    
    let gridOptions = {
        rowData: rows,
        columnDefs: [
            {
                field: "Object",
                headerName: "Объект",
                width: 50,
                filter: 'agTextColumnFilter',
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: { values: Objects },
                
                
            },
            {
                field: "Type",
                headerName: "Тип объекта",
                width: 50,
                filter: 'agTextColumnFilter',
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: { values: Types }
            },
            {
                field: "actions",
                headerName: "Действия",
                cellRenderer: ActionsButtons,
                editable: false,
                sortable: false,
                filter: false,
                flex: 1,
                
            }
        ],
        defaultColDef: {
            flex: 2,
            editable: true,
            filter: true,
        },
        enableRangeSelection: true,
        cellSelection: true,
        enableRangeHandle: true,
        suppressMultiRangeSelection: false,
        rowHeight: 55,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        undoRedoCellEditing: true,
        enableCellTextSelection: false,
        suppressClipboardPaste: false,

        onCellValueChanged: function(event) {
            const newValue = event.newValue;
            const oldValue = event.oldValue;
            const render = gridApi.getCellRendererInstances({
                rowNodes: [event.node],
                columns: ['actions']
            })[0];
            const loadPMButton = render.getLoadPMButton();
            const loadExampleButton = render.getLoadExampleButton();
            const goToViewsButton = render.getGoToViewsButton();
            if(event.colDef.field === "Object") {
                if(newValue !== ""){
                    const firstColData = [];
                    gridApi.forEachNode(node => {
                        firstColData.push( node.id === event.node.id ? oldValue : node.data["Object"])}
                    );
                    if(firstColData.indexOf(newValue) !== -1) {
                        event.data["Object"] = oldValue;
                        if(oldValue === "") {
                            goToViewsButton.disabled = true;
                        }

                        gridApi.refreshCells({columns: [event.colDef.field], rowNodes: [event.node]});
                        showNotification("Этот объект уже выбран", false);

                    }
                    else{
                        goToViewsButton.disabled = false;
                        event.data["Type"] = "(нет)";
                        gridApi.refreshCells({columns: ["Type"], rowNodes: [event.node]});
                    }
                    

                } else{
                    goToViewsButton.disabled = true;
                    loadPMButton.disabled = true;
                    loadExampleButton.disabled = true;
                    event.data["Type"] = "";
                    gridApi.refreshCells({columns: ["Type"], rowNodes: [event.node]});
                }
            }
            else if(event.colDef.field === "Type") {
                const type = event.data["Type"];
                if(type === null || type === "(нет)" || type === undefined || type === ""){
                    loadPMButton.disabled = true;
                    loadExampleButton.disabled = true;
                }
                else{
                    const typeNums = Object.keys(typesDictionary);
                    console.log(typeNums, typesDictionary);
                    for(let i = 0; i < typeNums.length; ++i) {
                        if(typesDictionary[typeNums[i]] === type){
                            loadPMButton.disabled = !enabledButtons[typeNums[i] - 1].PM;
                            loadExampleButton.disabled = !enabledButtons[typeNums[i] - 1].example;
                            break
                        }
                    }
                }
            }
        }
        
        
        // onRowDoubleClicked: event => { //выделение по дв щелчк
        //     if (event.node.isSelected()){
        //         event.node.setSelected(false);
        //     } else {event.node.setSelected(true);}
        // },
        
    };
    
    return gridOptions;
}

function enableButtons(node) {
    const render = gridApi.getCellRendererInstances({
        rowNodes: [node],
        columns: ['actions']
    })[0];
    const goToViewsButton = render.getGoToViewsButton();
    const loadPMButton = render.getLoadPMButton();
    const loadExampleButton = render.getLoadExampleButton();

    const object = node.data["Object"];
    goToViewsButton.disabled = object === "";


    const type = node.data["Type"];
    if(type === null || type === "(нет)" || type === undefined || type === ""){
        loadPMButton.disabled = true;
        loadExampleButton.disabled = true;
    }
    else{
        const typeNums = Object.keys(typesDictionary);
        for(let i = 0; i < typeNums.length; ++i) {
            if(typesDictionary[typeNums[i]] === type){
                loadPMButton.disabled = !enabledButtons[typeNums[i] - 1].PM;
                loadExampleButton.disabled = !enabledButtons[typeNums[i] - 1].example;
                break
            }
        }
    }
}

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
    
    const dropUpBtns = Array.from(document.getElementsByClassName("dropUpBtn"));
    
    for(let i = 0; i  < dropUpBtns.length; ++i) {
        dropUpBtns[i].addEventListener('click', function() {
            console.log(this.textContent);
        });
    }
    
}

function localSave(){
    let allData = [];
    gridApi.forEachNode(node => allData.push(node.data));
    allData = allData.filter(row => !(row.Object === null || row.Object === "" || row.Object === undefined));
    localSaveData = JSON.parse(JSON.stringify(allData));
    sessionStorage.setItem("all-objects", JSON.stringify(allData));
    console.log('Saving all:', allData);
    showNotification(`Сохранено ${allData.length} строк (вся таблица)`);
}

let counter1;
let Views;

document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа

    let login = sessionStorage.getItem("GlobalLogin");
    if(login === '' || login === null) {
        e.preventDefault();
        //window.location.assigsn("log-in.html");
        window.location.href = "log-in.html";
    }
    
    let serverData = loadData();

    enabledButtons = serverData.information.Settings;

     localSaveData = JSON.parse(sessionStorage.getItem("all-objects"));
     let GrdOptions;

    console.log(JSON.parse(sessionStorage.getItem("all-objects")), "after loading");

    const previousData = JSON.parse(sessionStorage.getItem("initial-requrements-data"));
    // console.log(previousData);
    if(!previousData){

        GrdOptions = createGridOptions(serverData, true);
        localSaveData = JSON.parse(JSON.stringify(serverData.data));
    }
    else{
        
        let ConvertedObjects = new Set();
        previousData.forEach(row =>{
            ConvertedObjects.add(row.column2);
        });
    
        let ConvertedData = [];
        const arrayObjects = Array.from(ConvertedObjects);
        arrayObjects.forEach(obj => {
            ConvertedData.push({Object: obj, Type: "(нет)"});
        });

        serverData.data = JSON.parse(JSON.stringify(ConvertedData));
        serverData.Objects = JSON.parse(JSON.stringify(arrayObjects));
        GrdOptions = createGridOptions(serverData, false);
        localSaveData = JSON.parse(JSON.stringify(ConvertedData));
    }
    gridApi = agGrid.createGrid(document.getElementById("myGrid"), GrdOptions);
    setupButtons();
    document.getElementById("mainFormName").textContent = serverData.information.name;
    document.getElementById("code").textContent = serverData.information.code;

    counter1 = sessionStorage.getItem("counter1");
    Views = loadViews();
    sessionStorage.setItem("Views", JSON.stringify(Views));

    setTimeout(() => {
        gridApi.forEachNode(node => enableButtons(node));
    }, 0);
    
});

document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let curDat = [];
    gridApi.forEachNode(node => {
        curDat.push(node.data)
    });

    curDat = curDat.filter(row => !(row.Object === null || row.Object === "" || row.Object === undefined));

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
    sessionStorage.setItem("all-objects", JSON.stringify(localSaveData));
    window.location.href = "initial-requrements.html";
})

document.getElementById("nextBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let curDat = [];
    gridApi.forEachNode(node => {
        curDat.push(node.data)
    });

    curDat = curDat.filter(row => !(row.Object === null || row.Object === "" || row.Object === undefined));
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
    ++counter1;
    sessionStorage.setItem("counter1", counter1);
    sessionStorage.setItem("all-objects", JSON.stringify(localSaveData));
    sessionStorage.setItem("currentObjAndType", JSON.stringify(localSaveData[counter1]));
    // console.log(JSON.stringify(localSaveData[counter1]));
    window.location.href = "specific-requrements.html";
})

document.getElementById("exitBtn").addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

document.getElementById("toServerBtn").addEventListener("click", (e) => {
    localSave();
    let message = JSON.parse(sessionStorage.getItem("all-objects"));
    message.forEach(row => {
        if(row.Type === "(нет)"|| row.Type === ""){
            row.Type = null;
        }
        else{
            const typeNums = Object.keys(typesDictionary);
            for(let i = 0; i < typeNums.length; ++i) {
                if(typesDictionary[typeNums[i]] === row.Type){
                    row.Type = typeNums[i];
                    break
                }
            }

        }
    });
    message = message.filter(row => (row.Object !== ""));
    console.log(message);
    showNotification(`Сохранено строк в модели: ${localSaveData.length}`);
})