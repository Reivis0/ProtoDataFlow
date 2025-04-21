
function loadSettings(num){
    let data =[ 
        [
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
                "example":true
            },
            {
                "PM": false,
                "example":false
            },
            {
                "PM": true,
                "example":false
            }
        ],
        [
            {
                "PM": true,
                "example":true
            },
            {
                "PM": false,
                "example":true
            },
            {
                "PM": true,
                "example":true
            },
            {
                "PM": false,
                "example":false
            },
            {
                "PM": true,
                "example":false
            }
        ],
        [
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
            }
        ],
        [
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
            }
        ],
        [
            {
                "PM": false,
                "example":true
            },
            {
                "PM": true,
                "example":false
            },
            {
                "PM": true,
                "example": true
            },
            {
                "PM": false,
                "example":false
            },
            {
                "PM": true,
                "example":false
            }
        ],
        [
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
            }
        ],
        [
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
                "example":true
            },
            {
                "PM": false,
                "example":false
            },
            {
                "PM": true,
                "example":false
            }
        ],
    ]

    return data[num];
}
let settings;

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

        this.gotoComponentButton = document.createElement("button"); //перейти к представлению
        

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
        this.gotoComponentButton.appendChild(iconSvg3);
        this.gotoComponentButton.classList.add("actionButton")

        this.gotoComponentButton.disabled = true;
        
        this.eGui.appendChild(this.gotoComponentButton);
        this.eGui.appendChild(this.loadPMButton);
        this.eGui.appendChild(this.loadExampleButton);

        this.gotoComponentButton.addEventListener("click", (e) => {
            e.preventDefault();
            
            let compName = this.params.data.name;

            sessionStorage.setItem("cellBtnPressed", false);


            const compNums = Object.keys(settings);
            for(let i = 0; i < compNums.length; ++i) {
                if(componentsDictionary[compNums[i]] === compName){
                    let nextComp = View.components[compNums[i]];
                    sessionStorage.setItem("curComp", JSON.stringify(nextComp));
                    sessionStorage.setItem("cellBtnPressed", false);

                    window.location.href = "component.html";
                    break
                }
            }

            
        })
    }


    getGotoComponentButton() {
        return this.gotoComponentButton;
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
let componentsDictionary = {};


function createGridOptions(data) {

    let defs1 = [
        {
            field: "code",
            headerName: "Код",
            width: 50,
        }
    ];
    let defs2 = [
        {
            field: "name",
            headerName: "Тип объекта",
            width: 50,
        },
        {
            field: "actions",
            headerName: "Действия",
            cellRenderer: ActionsButtons,
            flex: 1,
            
        }
    ];

    const defs = data.components.every(element => element.code === "") ? defs2 : defs1.concat(defs2);
    
    let gridOptions = {
        rowData: data.components,
        columnDefs: defs,
        defaultColDef: {
            flex: 2,
            editable: false,
            filter: false,
            sortable: false,
        },
        rowHeight: 55,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        enableCellTextSelection: false,
        suppressClipboardPaste: false,
        
    };
    
    return gridOptions;
}

function enableButtons(node) {
    const render = gridApi.getCellRendererInstances({
        rowNodes: [node],
        columns: ['actions']
    })[0];
    const gotoComponentButton = render.getGotoComponentButton();
    const loadPMButton = render.getLoadPMButton();
    const loadExampleButton = render.getLoadExampleButton();

    const comp = node.data["name"];
    gotoComponentButton.disabled = false;
    const compNums = Object.keys(settings);
    for(let i = 0; i < compNums.length; ++i) {
        if(componentsDictionary[compNums[i]] === comp){
            loadPMButton.disabled = !settings[compNums[i] - 1].PM;
            loadExampleButton.disabled = !settings[compNums[i] - 1].example;
            break
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

let counter2;
let Views
let View;
let numOfView;
let currentObjAndType;

document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    counter2 = sessionStorage.getItem("counter2");
    Views = JSON.parse(sessionStorage.getItem("Views"));
    console.log(Views);
    View = Views[counter2];
    numOfView = View.number;
    sessionStorage.setItem("currentView", JSON.stringify(View));
    currentObjAndType = JSON.parse(sessionStorage.getItem("currentObjAndType"));
    document.getElementById("objectName").textContent = currentObjAndType.Object;
    document.getElementById("objectType").textContent = currentObjAndType.Type;
    settings = loadSettings(numOfView - 1); 
    View.components.forEach(component => componentsDictionary[component.number] = component.name);
    GrdOptions = createGridOptions(View);

    
    gridApi = agGrid.createGrid(document.getElementById("myGrid"), GrdOptions);
    setupButtons();
    document.getElementById("mainFormName").textContent = View.header;
    document.getElementById("code").textContent = View.code;

    setTimeout(() => {
        gridApi.forEachNode(node => enableButtons(node));
    }, 0);
    
});

document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    if(counter2 === 0) {
        window.location.href = "specific-requrements.html";
    }
    else{
        --counter2;
        sessionStorage.setItem("counter2", counter2);
        let counter3 = Views[counter2].components.length - 1;
        let nextComp = Views[counter2].components[counter3];
        sessionStorage.setItem("counter3", counter3);
        sessionStorage.setItem("cellBtnPressed", false);
        sessionStorage.setItem("curComp", JSON.stringify(nextComp));
        window.location.href = "component.html";
    }
    
})

document.getElementById("nextBtn").addEventListener("click", (e) => {
    e.preventDefault();
    
    let counter3 = sessionStorage.getItem("counter3");
    ++counter3;
    let nextComp = View.components[counter3];
    sessionStorage.setItem("counter3", counter3);
    sessionStorage.setItem("curComp", JSON.stringify(nextComp));
    sessionStorage.setItem("cellBtnPressed", false);
    window.location.href = "component.html";
})

document.getElementById("exitBtn").addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
    window.location.href = "log-in.html";
})

// document.getElementById("toServerBtn").addEventListener("click", (e) => {
//     localSave();
//     let message = JSON.parse(sessionStorage.getItem("all-objects"));
//     message.forEach(row => {
//         if(row.Type === "(нет)"|| row.Type === ""){
//             row.Type = null;
//         }
//         else{
//             const typeNums = Object.keys(typesDictionary);
//             for(let i = 0; i < typeNums.length; ++i) {
//                 if(typesDictionary[typeNums[i]] === row.Type){
//                     row.Type = typeNums[i];
//                     break
//                 }
//             }

//         }
//     });
//     message = message.filter(row => (row.Object !== ""));
//     console.log(message);
//     showNotification(`Сохранено строк в модели: ${localSaveData.length}`);
// })