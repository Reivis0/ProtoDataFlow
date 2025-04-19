//const { Component } = require("ag-grid-community");

window.gridApi1 = null; //настройки этой таблицы

window.enabeledPagesData = null; //данные этой таблицы


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


function setupButtons1() {

    document.getElementById("redoBtn1").addEventListener("click", (e) => {
      gridApi1.redoCellEditing();
    });

    document.getElementById("undoBtn1").addEventListener("click", (e) => {
      gridApi1.undoCellEditing();
    });

    // Сохранение всей таблицы
    document.getElementById('saveAllBtn1').addEventListener('click', () => {
        const allData = [];
        gridApi1.forEachNode(node => allData.push(node.data));
        enabeledPagesData = allData;

        message = {
          ObjectTypes: [],
          Views: []
        }

        for(let i = 0; i < 12; ++i){ //создание сообщения на сервер
          message.ObjectTypes.push({name: (allData[i].name === "тип объекта " + (i+1) ? null : allData[i].name), enabled: allData[i].enabled});
        }
        for(let i = 0; i < 7; ++i){
          message.Views.push({name: (allData[12+6*i].name === "Представление " + (i+1) ? null : allData[12+6*i].name), enabled: allData[12+6*i].enabled, Components: []});
          for(let j = 1; j < 6; ++j) {
            message.Views[i].Components.push({name: (allData[12+6*i+j].name === "Компонент " + (i+1) + "."+(j) ? null : allData[12+6*i+j].name), enabled: allData[12+6*i+j].enabled})
          }
        }
        console.log('Saving all:', message);
        showSettingsOfEnabled(allData);
        showNotification(`Сохранено строк: ${allData.length} (таблица доступных страниц)`);
    });
}

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

