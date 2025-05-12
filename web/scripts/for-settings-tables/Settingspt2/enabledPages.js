// settingsLoad.js (или enabledPages.js)
// Здесь будем хранить экземпляр GridManager для таблицы доступных страниц
window.enabledPagesGrid = null;
window.objectTypeGrids = {}; // Здесь будем хранить все экземпляры GridManager для таблиц типов объектов

// Импортируем GridManager
// function setupButtons1() {...}  // Убираем (перенесли в GridManager)

function convertToEnabled(jsonobj) { //переделать сообщение от сервера в таблицу
    let data = []

    for(let i = 0; i < jsonobj.ObjectTypes.length; ++i) {
        data.push({name: !(jsonobj.ObjectTypes[i].name === undefined || jsonobj.ObjectTypes[i].name === null || jsonobj.ObjectTypes[i].name === "") ?
            jsonobj.ObjectTypes[i].name : "тип объекта " + (i+1), enabled: jsonobj.ObjectTypes[i].enabled });
    }

    for(let i = 0; i < jsonobj.Views.length; ++i) {
        data.push({name: !(jsonobj.Views[i].name === undefined || jsonobj.Views[i].name === null || jsonobj.Views[i].name === "") ?
            jsonobj.Views[i].name : "Представление " + (i+1), enabled: jsonobj.Views[i].enabled });
        for(let j = 0; j < jsonobj.Views[i].Components.length; ++j) {
            data.push({name: !(jsonobj.Views[i].Components[j].name === undefined | jsonobj.Views[i].Components[j].name === null || jsonobj.Views[i].Components[j].name === "") ?
                jsonobj.Views[i].Components[j].name : "Компонент " + (i+1) + "."+(j+1), enabled: jsonobj.Views[i].Components[j].enabled });
        }
    }

    return data
}
function createObjectTypeTables() {
    console.log("createObjectTypeTables() called");
    const objectTypeContainer = document.getElementById('objectTypeContainer');
    if (!objectTypeContainer) {
        console.error("objectTypeContainer not found!");
        return; // Важно: выходим из функции, если контейнер не найден
    }

    for (let i = 1; i <= 12; i++) {
        console.log("Creating objectTypeGrid", i);
        const containerId = `objectTypeGrid${i}`;
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'gridContainer';
        container.innerHTML = `<h2>Тип объекта ${i}</h2>
                                 <div id="${containerId}-grid" class="ag-theme-alpine" style="height: 200px; width: 100%;"></div>`;

        try {
            objectTypeContainer.appendChild(container);
            console.log("Appended objectTypeGrid", i, "to objectTypeContainer");
        } catch (error) {
            console.error("Error appending objectTypeGrid", i, error);
        }

        console.log("Created objectTypeGrid", i, container);
        //setupObjectTypeTableButtons(i); // Здесь вызываем функцию для настройки кнопок
    }
}

function tempData() {
    let message = {
        "ObjectTypes": [
          {
            "name": null,
            "enabled" : true
          },
          {
            "name": null,
            "enabled" : true
          },
    
          {
            "name": null,
            "enabled" : false
          },
    
          {
            "name": null,
            "enabled" : true
          },
    
          {
            "name": null,
            "enabled" : false
          },
    
          {
            "name": null,
            "enabled" : true
          },
    
          {
            "name": null,
            "enabled" : false
          },
    
          {
            "name": null,
            "enabled" : true
          },
    
          {
            "name": null,
            "enabled" : false
          },
    
          {
            "name": null,
            "enabled" : true
          },
            
          {
            "name": null,
            "enabled" : false
          },
    
          {
            "name": null,
            "enabled" : true
          }
    
        ],
        "Views": [
          {
            "name": null,
            "enabled": true,
            "Components": [
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                }
    
              ]
          },
          {
            "name": null,
            "enabled": true,
            "Components": [
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                }
    
              ]
          },
          {
            "name": null,
            "enabled": true,
            "Components": [
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                }
    
              ]
          },
          {
            "name": null,
            "enabled": true,
            "Components": [
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                }
    
              ]
          },
          {
            "name": null,
            "enabled": true,
            "Components": [
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                }
    
              ]
          },
          {
            "name": null,
            "enabled": true,
            "Components": [
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                }
    
              ]
          },
          {
            "name": null,
            "enabled": true,
            "Components": [
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                },
    
                {
                  "name": null,
                  "enabled" : false
                }
    
              ]
          }
        ]
      };
      
      return message;
}

function createGridOptions1(data) { //задание настроек таблицы
    gridOptions = {
        rowData: data,
        columnDefs: [
            {
                field: "name",
                headerName: "Название элемента",
                flex: 2,
                //rowDrag: true,
    
            },
            {
                field: "enabled",
                headerName: "Доступно",
                width: 50,
                editable: true,
                cellClass: 'ag-selection-checkbox',
                onCellValueChanged: params => {
                  let dataTemp = [];
                  params.api.forEachNode(node => dataTemp.push(node.data));
                  showSettingsOfEnabled(dataTemp);
                }
            }
        ],
        defaultColDef: {
            flex: 1,
            editable: false,
            sortable: true,
            filter: true,
            //enableCellChangeFlash: true
        },
        enableRangeSelection: true,
        cellSelection: true,
        enableRangeHandle: true,
        suppressMultiRangeSelection: false,
        //rowDragManaged: true,
        animateRows: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        undoRedoCellEditing: true,
        //onSelectionChanged: onSelectionChanged1,
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

function createEnabledPagesGrid(data) {
    const gridOptions = createGridOptions1(data);
    enabledPagesGrid = new GridManager('myGrid1', gridOptions, () => Promise.resolve(data)); // data загрузится сразу
    setupButtons1(); //перенесем кнопки в gridmanager
}

function setupButtons1() {
    if (!enabledPagesGrid) return;

    const gridApi = enabledPagesGrid.gridApi;

    document.getElementById("redoBtn1").addEventListener("click", (e) => {
        gridApi.redoCellEditing();
    });

    document.getElementById("undoBtn1").addEventListener("click", (e) => {
        gridApi.undoCellEditing();
    });

    // Сохранение всей таблицы
    document.getElementById('saveAllBtn1').addEventListener('click', () => {
        const allData = [];
        gridApi.forEachNode(node => allData.push(node.data));
        enabeledPagesData = allData;
        message = {
            ObjectTypes: [],
            Views: []
        }

        for (let i = 0; i < 12; ++i) { //создание сообщения на сервер
            message.ObjectTypes.push({ name: (allData[i].name === "тип объекта " + (i + 1) ? null : allData[i].name), enabled: allData[i].enabled });
        }
        for (let i = 0; i < 7; ++i) {
            message.Views.push({ name: (allData[12 + 6 * i].name === "Представление " + (i + 1) ? null : allData[12 + 6 * i].name), enabled: allData[12 + 6 * i].enabled, Components: [] });
            for (let j = 1; j < 6; ++j) {
                message.Views[i].Components.push({ name: (allData[12 + 6 * i + j].name === "Компонент " + (i + 1) + "." + (j) ? null : allData[12 + 6 * i + j].name), enabled: allData[12 + 6 * i + j].enabled })
            }
        }
        console.log('Saving all:', message);
        showSettingsOfEnabled(allData);
        showNotification(`Сохранено строк: ${allData.length} (таблица доступных страниц)`);
    });
}

function showSettingsOfEnabled(enabledData) {
    if (!objectTypeGrids) return;
    // Перебираем типы объектов
    for (let i = 1; i <= 12; i++) {
        const objectTypeContainerId = `objectTypeGrid${i}`;
        const objectTypeGrid = objectTypeGrids[i];
        if (!objectTypeGrid) continue; // Пропускаем, если таблица не инициализирована
        //const objectTypeGrid = objectTypeGrids[i];
        const enabled = enabledData && enabledData[i - 1] ? enabledData[i - 1].enabled : false;
        objectTypeGrid.updateVisibility(enabled);
    }

    // Перебираем представления (предполагая, что они идут после типов объектов)
    for (let i = 1; i <= 7; i++) {
      const representationContainerId = `representationGrid${i}`;
      const enabled = enabledData && enabledData[11 + i] ? enabledData[11 + i].enabled : false;
      const container = document.getElementById(representationContainerId);
      if (container) {
          container.style.display = enabled ? 'block' : 'none';
      }
  }
}

async function loadEnabledPagesData() {
    // Замените на ваш код для загрузки данных
    // Здесь будет загрузка из вашего DataManager или другого источника
    // Пример:
    const data = tempData(); // или await DataManager.loadEnabledPages();
    return convertToEnabled(data);
}

// Инициализация таблиц
async function initEnabledPages() {
    console.log("initEnabledPages() called"); // Добавлено
    const data = await loadEnabledPagesData();
    createEnabledPagesGrid(data);
    createObjectTypeTables(); // Инициализация таблиц типов объектов
}


document.addEventListener('DOMContentLoaded', initEnabledPages);