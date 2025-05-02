const config = {
    dataFields: {
      rows: ["object", "code", "view", "component", "data"],
      cols: ["req_object", "req_code", "req_view", "req_component", "req_data"],
      val: "value"
    },
    displayNames: {
      rows: ["Объект", "Код", "Представление", "Компонент", "Элемент"],
      cols: ["Объект ", "Код ", "Представление ", "Компонент ", "Элемент "],
      val: "Значение"
    }
  };

  //TODO:
  //Сделать SessionStorage для всех матриц типа {имя1: [данные1], имя2: [данные2]}
  //Сделать проверку названия формы, что ее нет в ключах данных всех матриц
  //Сделать сохранение
  //Сделать счетчик - 12 шт
  //Сделать кнопки назад и вперед
  //Сделать проверку для включения кнопки создания
  //Сделать так, чтобы при нажатии на соответствующие кнопки открывались матрицы (придется переделать функцию загрузки стр)
  //Подумать над поиском в сохраненных данных при изменении выбранных кнопок (неоптимально)
  
  let traceabilityData = [];

    let transposed = false;

    let GlobalAllObjects;
    let GlobalForMatricies;
    let GlobalViews;
    let viewToCode = {};

   document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
     // let login = sessionStorage.getItem("GlobalLogin");
     // if(login === '' || login === null) {
     //     e.preventDefault();
     //     //window.location.assigsn("log-in.html");
     //     window.location.href = "log-in.html";
     // }
    
     forMatricies = JSON.parse(sessionStorage.getItem("for-matricies"));
     const allObjects = Array.from(Object.keys(forMatricies));
     GlobalAllObjects = allObjects;
     GlobalForMatricies = forMatricies;
     level1s =  Array.from(document.getElementsByClassName("level1"));
     for(let i = 0; i < level1s.length; ++i){
         allObjects.forEach(source => {
             const newSource = document.createElement("button");
             newSource.classList.add("dropdownBtn");
             newSource.classList.add(i === 0 ? "left" : "right");
             newSource.textContent = source;
             level1Pressed(newSource);
             level1s[i].appendChild(newSource);
         })
         level1s[i].children[0].textContent = "Все"
         level1Pressed(level1s[i].children[0])
     }
     const views = Array.from(Object.keys(forMatricies[allObjects[0]].views))
     level2s =  Array.from(document.getElementsByClassName("level2"));
     //console.log(views);
     for(let i = 0; i < level2s.length; ++i){
         views.forEach(source => {
             const newSource = document.createElement("button");
             newSource.classList.add("dropdownBtn");
             newSource.classList.add(i === 0 ? "left" : "right");
             newSource.textContent = source;
             level2Pressed(newSource);
             level2s[i].appendChild(newSource);
         });
         level2s[i].children[0].textContent = "Все"
         level2Pressed(level2s[i].children[0])
     }
     console.log(forMatricies);
     GlobalViews = JSON.parse(sessionStorage.getItem("Views"));
     GlobalViews.forEach(view => {
         viewToCode[view.header] = view.code;
     })
    updateTable();
    makeMatrix(transposed);
 
    makeTheTablePretty();
       
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

     setupButtons();

   });

   function level1Pressed(button){
    button.addEventListener("click", (e) => {
        let obj = button.textContent;
        e.target.parentElement.parentElement.children[1].textContent = obj;
        updateTable();
    })
   }

   function level2Pressed(button){
    button.addEventListener("click", (e) => {
        let view = button.textContent;
        e.target.parentElement.parentElement.children[1].textContent = view
        classList = e.target.classList
        let div = document.getElementsByClassName(`level3 ${classList[classList.length-1]}`)[0]
        div.querySelectorAll('button:not(:first-child)').forEach(button =>  button.remove() );
        if(view === "Все"){
            //взять данные по всем представлениям
        }else{
            let obj = document.getElementsByClassName(`level1 ${classList[classList.length-1]}`)[0].parentElement.children[1].textContent
            if(obj === "Все"){
                Array.from(Object.keys(GlobalForMatricies[GlobalAllObjects[0]]["views"][view])).forEach( comp => {
                    const newSource = document.createElement("button");
                    newSource.classList.add("dropdownBtn");
                    newSource.classList.add(classList[classList.length-1]);
                    newSource.textContent = comp;
                    level3Pressed(newSource);
                    div.appendChild(newSource);
                });
            }
            else{
            Array.from(Object.keys(GlobalForMatricies[obj]["views"][view])).forEach( comp => {
                const newSource = document.createElement("button");
                newSource.classList.add("dropdownBtn");
                newSource.classList.add(classList[classList.length-1]);
                newSource.textContent = comp;
                level3Pressed(newSource);
                div.appendChild(newSource);
            });
            
        }
        div.children[0].textContent = "Все"
        level3Pressed(div.children[0])
        }
        updateTable();
    })
   }

   function level3Pressed(button){
    button.addEventListener("click", (e) => {
        let obj = button.textContent;
        e.target.parentElement.parentElement.children[1].textContent = obj;
        updateTable();
    })
   }

   function updateTable() {
    const obj1 = document.getElementsByClassName(`level1 left`)[0].parentElement.children[1].textContent;
    const obj2 = document.getElementsByClassName(`level1 right`)[0].parentElement.children[1].textContent;
    const view1 = document.getElementsByClassName(`level2 left`)[0].parentElement.children[1].textContent;
    const view2 = document.getElementsByClassName(`level2 right`)[0].parentElement.children[1].textContent;
    const comp1 = document.getElementsByClassName(`level3 left`)[0].parentElement.children[1].textContent;
    const comp2 = document.getElementsByClassName(`level3 right`)[0].parentElement.children[1].textContent;
    let newTraceabilityData = []
    const obj1Array = obj1 === "Все" ? GlobalAllObjects : GlobalAllObjects.filter(el => el === obj1);
    const obj2Array = obj2 === "Все" ? GlobalAllObjects : GlobalAllObjects.filter(el => el === obj2);
    const view1Array = view1 === "Все" ? Array.from(Object.keys(GlobalForMatricies[GlobalAllObjects[0]].views)) : Array.from(Object.keys(GlobalForMatricies[GlobalAllObjects[0]].views)).filter(el => el === view1); 
    const view2Array = view2 === "Все" ? Array.from(Object.keys(GlobalForMatricies[GlobalAllObjects[0]].views)) : Array.from(Object.keys(GlobalForMatricies[GlobalAllObjects[0]].views)).filter(el => el === view2); 

    let struct1 = {};
    obj1Array.forEach(object1 => {
        let element1Array = {};
         view1Array.forEach(v1 => {
             element1Array[v1] = {};
             if(comp1 === "Все") {
                 Array.from(Object.keys(GlobalForMatricies[object1]["views"][v1])).forEach(el => {
                     element1Array[v1][el] = GlobalForMatricies[object1]["views"][v1][el];
                 });
             }else{
                 element1Array[v1][el] = GlobalForMatricies[object1]["views"][v1][comp1];
             }
        });
        struct1[object1] = element1Array;
    });
    let struct2 = {};
    obj2Array.forEach(object2 => {
        let element2Array = {};
        view2Array.forEach(v2 =>{
            element2Array[v2] = {};
            if(comp2 === "Все") {
                Array.from(Object.keys(GlobalForMatricies[object2]["views"][v2])).forEach(el => {
                    element2Array[v2][el] = GlobalForMatricies[object2]["views"][v2][el];
                });
            }else{
                element2Array[v2][comp2] = GlobalForMatricies[object2]["views"][v2][comp2];
            }
        });
        struct2[object2] = element2Array;
    });

    console.log(struct1, struct2);
    Array.from(Object.keys(struct1)).forEach(object1 => {
        Array.from(Object.keys(struct1[object1])).forEach(view1 => {
            Array.from(Object.keys(struct1[object1][view1])).forEach(component1 => {
                struct1[object1][view1][component1].forEach(element1 => {
                    Array.from(Object.keys(struct2)).forEach(object2 => {
                        Array.from(Object.keys(struct2[object2])).forEach(view2 => {
                            Array.from(Object.keys(struct2[object2][view2])).forEach(component2 => {
                                struct2[object2][view2][component2].forEach(element2 => {
                                    let index = traceabilityData.findIndex(cell => {
                                        const {value, ...data} = cell; //тут то же, что и в config.val
                                        //console.log(data);
                                        return JSON.stringify(data) === JSON.stringify({object: object1, code: viewToCode[view1], view: view1, component: component1, data: element1.column3, 
                                            req_object: object2, req_code: viewToCode[view2], req_view: view2, req_component: component2, req_data: element2.column3});
                                    });
                                    if(index > -1){
                                        newTraceabilityData.push(traceabilityData[index]);
                                    }else{
                                        newTraceabilityData.push(
                                            {object: object1, code: viewToCode[view1], view: view1, component: component1, data: element1.column3, 
                                                req_object: object2, req_code: viewToCode[view2], req_view: view2, req_component: component2, req_data: element2.column3, value: 0.0}
                                        );
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    
    traceabilityData = JSON.parse(JSON.stringify(newTraceabilityData));
    // console.log(traceabilityData)
    $("#pivotContainer").empty();
    makeMatrix(transposed);
    makeTheTablePretty();


    
}

function makeTheTablePretty() {
    setTimeout(() => {
        const columnHeadersContainer = document.querySelector("thead").children;
        for(let i = 0; i < columnHeadersContainer.length - 1; ++i) {
          columnHeadersContainer[i].children[i===0?1:0].style.backgroundColor = "#53e153";
        }
      
        const rowHeaders = document.querySelector("thead").lastChild.children;
        for(let i = 0; i < rowHeaders.length - 1; ++i) {
          rowHeaders[i].style.backgroundColor = "#49d0d0";
        }
      
        const bigTable = document.getElementsByClassName("pvtUi")[0].children;
        bigTable[0].style.display = "none";
        bigTable[1].children[0].style.display = "none";
        bigTable[1].children[1].style.display = "none";
      
      
        const totals = document.getElementsByClassName("pvtTotalLabel");
        totals[0].textContent = "Итого";
        totals[1].textContent = "Итого";
      
        $('.pvtTable td.pvtTotal, .pvtTable td.pvtGrandTotal').each(function() {
          var value = parseFloat($(this).attr("data-value")) || 0;
          if (value === 0) {
            $(this).addClass('zero-total');
          }
        });
      
      }, 25);
}

  function transformData(data) {
  return data.map(item => {
      const newItem = {};
      config.dataFields.rows.forEach((field, i) => newItem[config.displayNames.rows[i]] = item[field]);
      config.dataFields.cols.forEach((field, i) => newItem[config.displayNames.cols[i]] = item[field]);
      newItem[config.displayNames.val] = item[config.dataFields.val];
      return newItem;
    });
  }
  
  // Global variable to track active input
  var activePivotInfo = null;
  
  $(document).on('click', function(event) {
      if (activePivotInfo && !$(event.target).closest('.pvtVal').length) {
          let td = activePivotInfo.input.parentElement;
          saveAndRemoveInput(activePivotInfo.input);
        
  
          let index = traceabilityData.findIndex(row => {
            let flag = true;
            for(let i = 0; i < config.dataFields.rows.length; ++i) {
              flag = row[config.dataFields.rows[i]] === activePivotInfo.filters[config.displayNames.rows[i]];
              if(!flag){
                break;
              }
            }
  
            if(flag){
              for(let i = 0; i < config.dataFields.cols.length; ++i) {
                flag = row[config.dataFields.cols[i]] === activePivotInfo.filters[config.displayNames.cols[i]];
                if(!flag){
                  break;
                }
              }
            }
  
            return flag;
  
          });
  
          let newValue = parseFloat($(activePivotInfo.input).val());
  
          if(newValue === null || newValue < 0){
            newValue = 0;
          }
          else if(newValue > 9.9) {
            newValue = 9.9
          }
          newValue.toFixed(1);
          
  
          traceabilityData[index].value = newValue;
  
          calculateRow(td);
          calculateColumn();
          
          activePivotInfo = null;
      }
  });
  
  $(document).on('keyup', function(e) {
      if (e.key === "Escape" && activePivotInfo) {
          $(activePivotInfo.input).remove();
          activePivotInfo = null;
      }
  });
  
  function saveAndRemoveInput(inputElement) {
      var cell = $(inputElement).parent();
      var value = $(inputElement).val();
      
      if (!isNaN(value) && value >= 0 && value <= 9.9) {
          var roundedValue = Math.round(parseFloat(value) * 10) / 10;
          cell.attr("data-value", roundedValue);
          cell.html(roundedValue.toFixed(1));
      }
      else if (isNaN(value) || value <= 0){
        var roundedValue = 0;
          cell.attr("data-value", roundedValue);
          cell.html(roundedValue.toFixed(1));
      }
      else{
        var roundedValue = 9.9;
          cell.attr("data-value", roundedValue);
          cell.html(roundedValue.toFixed(1));
      }
      $(inputElement).remove();
  }
  
  function makeMatrix(transposed) {
    $("#pivotContainer")
          .empty()
          .removeData()
          //.off();
      let data = transformData(traceabilityData);
      let newCols = transposed ? config.displayNames.rows : config.displayNames.cols;
      let newRows = transposed ? config.displayNames.cols : config.displayNames.rows;
      $("#pivotContainer").pivotUI(data, {
          rows: newRows,
          cols: newCols,
          vals: [config.displayNames.val],
          aggregatorName: "Sum",
          rendererName: "Table",
          rendererOptions: {
              table: {
                clickCallback: function (e, value, filters, pivotData) {
                  if (activePivotInfo) {
                    saveAndRemoveInput(activePivotInfo.input);
                    calculateRow(e.srcElement);
                    calculateColumn();
                  }
                  
                  var cs = 'editable_' + $(e.srcElement).attr('class').replace(' ', '_').replace(' ', '_');
                  // Get the current displayed value (formatted with 1 decimal)
                  var currentValue = $(e.srcElement).text().trim();
                  // If empty, use empty string, otherwise parse the number
                  var v = currentValue === '' ? '' : parseFloat(currentValue).toFixed(1);
                  
                  if (!$(e.srcElement).children().length > 0) {
                      $(e.srcElement).empty();
                      var input = $("<input class='" + cs + "' style='width: 90%;' type='number' min='0' max='9.9' step='0.1' value='" + v + "'/>");
                      $(e.srcElement).append(input);
                      activePivotInfo = {input: $(e.srcElement).find('input')[0], filters: filters};
                      
                      input.focus().select().keypress(function (event) {
                          var keycode = (event.keyCode ? event.keyCode : event.which);
                          if (keycode == '13') {
                            console.log(keycode);
                              var newValue = parseFloat(input.val());
                              
                              // Validate input
                              if (isNaN(newValue) || newValue < 0) {
                                newValue = 0;
                              }
                              if (newValue > 9.9) {
                                newValue = 9.9;
                              }
                              
                              // Round to one decimal place
                              newValue = Math.round(newValue * 10) / 10;
                              
                              $(e.srcElement).attr("data-value", newValue);
                              $(e.srcElement).html(newValue.toFixed(1)); // Format with 1 decimal
                              $(e.srcElement).remove('input');
  
                              let index = traceabilityData.findIndex(row => {
                                let flag = true;
                                for(let i = 0; i < config.dataFields.rows.length; ++i) {
                                  flag = row[config.dataFields.rows[i]] === filters[config.displayNames.rows[i]];
                                  if(!flag){
                                    break;
                                  }
                                }
  
                                if(flag){
                                  for(let i = 0; i < config.dataFields.cols.length; ++i) {
                                    flag = row[config.dataFields.cols[i]] === filters[config.displayNames.cols[i]];
                                    if(!flag){
                                      break;
                                    }
                                  }
                                }
  
                                return flag;
  
                              });
  
                              traceabilityData[index].value = newValue;
              
                              calculateRow(e.srcElement);
                              calculateColumn();
                          }
                      });
                  }
              }
              }
          },
          onRefresh: function(config) {
              // Format all numbers to 1 decimal place on render
              $(".pvtVal").each(function() {
                  var val = parseFloat($(this).attr("data-value"));
                  if (!isNaN(val)) {
                      $(this).html(val.toFixed(1));
                  }
              });
          }
      });
      
  };
  

  
  $(document).keydown(function (e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        $(".pvtTable tr td").each(function (i, v) {
            if ($(v).children().length > 0) {
                // Restore original value
                var originalValue = $(v).attr("data-value") || "0.0";
                $(v).html(parseFloat(originalValue).toFixed(1));
                $(v).remove('input');
            }
        });
    }
  });
  
  function calculateRow(td) {
    $tr = $(td).parent();
    $lastTd = $tr.find("td:last");
    var sum = 0;
    $tr.find('td').not(':last').each(function (i, v) {
        var data = ($(v).attr("data-value") == "null" ? 0 : $(v).attr("data-value"));
        sum +=  parseFloat(data);
    });
    $lastTd.attr("data-value");
    $lastTd.html(sum.toFixed(1));
  
    if (sum === 0) {
      $lastTd.addClass('zero-total');
    } else {
      $lastTd.removeClass('zero-total');
    }
  
  }
  
  function calculateColumn() {
  
    $(".pvtTable tbody tr:first td").each(function (index, val) {
        var total = 0;
        $(".pvtTable tbody tr").not(':last').each(function (i, v) {
            var value = $('td.pvtVal', this).eq(index).attr("data-value");
            var data = (value == "null" ? 0 : value);
            total += parseFloat(data);
        });
        let $totalCell = $('.pvtTable tbody tr td.colTotal').eq(index);
        $totalCell.attr("data-value", total);
        $totalCell.html(total.toFixed(1));
  
        if (total === 0) {
          $totalCell.addClass('zero-total');
        } else {
          $totalCell.removeClass('zero-total');
        }
        
    });
  
    var grandTotal = 0;
    $(".pvtTable tbody tr td.colTotal").each(function (i, v) {
        var d = ($(v).attr("data-value") == "null" ? 0 : $(v).attr("data-value"));
        grandTotal +=  parseFloat(d);
    });
    let $grandTotalCell = $("td.pvtGrandTotal");
    $grandTotalCell.attr("data-value", grandTotal);
    $grandTotalCell.html(grandTotal.toFixed(1));
  
    if (grandTotal === 0) {
      $grandTotalCell.addClass('zero-total');
    } else {
      $grandTotalCell.removeClass('zero-total');
    }
  }
  
  document.getElementById("transposeBtn").addEventListener("click", (e) => {
    const obj1 = document.getElementsByClassName(`level1 left`)[0].parentElement.children[1];
    const obj2 = document.getElementsByClassName(`level1 right`)[0].parentElement.children[1];
    const view1 = document.getElementsByClassName(`level2 left`)[0].parentElement.children[1];
    const view2 = document.getElementsByClassName(`level2 right`)[0].parentElement.children[1];
    const comp1 = document.getElementsByClassName(`level3 left`)[0].parentElement.children[1];
    const comp2 = document.getElementsByClassName(`level3 right`)[0].parentElement.children[1];
    let temp = obj1.textContent;
    obj1.textContent = obj2.textContent;
    obj2.textContent = temp;
    temp = view1.textContent;
    view1.textContent = view2.textContent;
    view2.textContent = temp;

    for(let i = 0; i < 2; ++i){
        let div = document.getElementsByClassName(`level3 ${i === 0 ? "left" : "right"}`)[0];
        div.querySelectorAll('button:not(:first-child)').forEach(button =>  button.remove() );
        let obj = (i === 0 ? obj1.textContent : obj2.textContent);
        let view = (i === 0 ? view1.textContent : view2.textContent);
        if(view === "Все"){

        }else{
            if(obj === "Все"){
                Array.from(Object.keys(GlobalForMatricies[GlobalAllObjects[0]]["views"][view])).forEach( comp => {
                    const newSource = document.createElement("button");
                    newSource.classList.add("dropdownBtn");
                    newSource.classList.add(i === 0 ? "left" : "right");
                    newSource.textContent = comp;
                    level3Pressed(newSource);
                    div.appendChild(newSource);
                });
            }
            else{
            Array.from(Object.keys(GlobalForMatricies[obj]["views"][view])).forEach( comp => {
                const newSource = document.createElement("button");
                newSource.classList.add("dropdownBtn");
                newSource.classList.add(i === 0 ? "left" : "right");
                newSource.textContent = comp;
                level3Pressed(newSource);
                div.appendChild(newSource);
            });
            }
        }
    }

    temp = comp1.textContent;
    comp1.textContent = comp2.textContent;
    comp2.textContent = temp;
    $("#pivotContainer").empty();
    updateTable();
    makeTheTablePretty();
    
  });

  document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
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
    //sessionStorage.setItem("initial-requrements-data", JSON.stringify(localSaveData));
    //window.location.href = "initial-data.html";
});

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

    //window.location.href = "all-objects.html";
});

document.getElementById("exitBtn").addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

document.getElementById("toServerBtn").addEventListener("click", (e) => {
    localSave();
    //let message = sessionStorage.getItem("initial-requrements-data");
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
});

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
