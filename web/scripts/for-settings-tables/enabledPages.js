const { Component } = require("ag-grid-community");

window.gridApi1 = null;

window.enabeledPagesData = null;

{
const undo = document.getElementById("undoBtn1") ;

undo.addEventListener("click", (e) => {
    gridApi1.undoCellEditing();
})

const redo = document.getElementById("redoBtn1") ;

redo.addEventListener("click", (e) => {
    gridApi1.redoCellEditing();
})

}

function createGridOptions1(data) {
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





// function onSelectionChanged1() {
//     const selectedCount = gridApi1.getSelectedNodes().length;
//     const saveBtn = document.getElementById('saveSelectedBtn1');
//     saveBtn.disabled = selectedCount === 0;
//     document.getElementById('selectedCount1').textContent = selectedCount;
// }




function setupButtons1() {
    // Сохранение выделенного
    // document.getElementById('saveSelectedBtn1').addEventListener('click', () => {
    //     const selectedData = gridApi1.getSelectedNodes().map(node => node.data);
    //     if (selectedData.length === 0) {
    //         showNotification('Нет выбранных строк!', 'error');
    //         return;
    //     }
    //     console.log('Saving selected:', selectedData);
    //     showNotification(`Сохранено ${selectedData.length} выбранных строк`);
    // });




    // Сохранение всей таблицы
    document.getElementById('saveAllBtn1').addEventListener('click', () => {
        const allData = [];
        gridApi1.forEachNode(node => allData.push(node.data));
        enabeledPagesData = allData;

        message = {
          ObjectTypes: [],
          Views: []
        }

        for(let i = 0; i < 12; ++i){
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




    // Вставка строк (обновлённая версия)
    document.getElementById('insertRowsBtn1').addEventListener('click', (e) => {
       //alert("sdsd");
        if (e.processed) return; // Если событие уже обработано
        e.processed = true;
        const selectedNodes = gridApi1.getSelectedNodes();
        const defaultCount = 0;
       
        const question = selectedNodes.length > 0
            ? "Сколько пустых строк вставить под каждую выбранную?"
            : "Сколько пустых строк добавить в конец таблицы?";
       
        const input = prompt(question, defaultCount);
        const count = parseInt(input) || defaultCount;
        if (count <= 0) return;
       
        const allData = [];
        gridApi1.forEachNode(node => allData.push(node.data));
       
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
       
        gridApi1.setGridOption('rowData', allData);
        if (selectedNodes.length > 0) gridApi1.deselectAll();
    });




    // Удаление строк
    document.getElementById('deleteRowsBtn1').addEventListener('click', () => {
        const selectedNodes = gridApi1.getSelectedNodes();
        if (selectedNodes.length === 0) {
            showNotification('Нет выделенных строк для удаления!', 'error');
            return;
        }
       
        if (!confirm(`Удалить ${selectedNodes.length} строк(у)?`)) return;
       
        gridApi1.applyTransaction({
            remove: selectedNodes.map(node => node.data)
        });
       
        gridApi1.deselectAll();
    });
}

function convertToEnabled(jsonobj) {
    let data = []

    for(let i = 0; i < jsonobj.ObjectTypes.length; ++i) {
        data.push({name: !(jsonobj.ObjectTypes[i].name === undefined | jsonobj.ObjectTypes[i].name === null | jsonobj.ObjectTypes[i].name === "") ?
            jsonobj.ObjectTypes[i].name : "тип объекта " + (i+1), enabled: jsonobj.ObjectTypes[i].enabled });
    }

    for(let i = 0; i < jsonobj.Views.length; ++i) {
        data.push({name: !(jsonobj.Views[i].name === undefined | jsonobj.Views[i].name === null | jsonobj.Views[i].name === "") ?
            jsonobj.Views[i].name : "Представление " + (i+1), enabled: jsonobj.Views[i].enabled });
        for(let j = 0; j < jsonobj.Views[i].Components.length; ++j) {
            data.push({name: !(jsonobj.Views[i].Components[j].name === undefined | jsonobj.Views[i].Components[j].name === null | jsonobj.Views[i].Components[j].name === "") ?
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

