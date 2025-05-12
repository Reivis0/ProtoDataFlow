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
  //сделать undo redo через два циклических стека. undo - старое во второй стек, в первом указатель - 1, redo - старое в первый стек, второй указатель + 1; Если ячейка не найдена - ничего не делать   
  
  let traceabilityData = [];

    let transposed = false;

    let GlobalLogin;
    let GlobalAllObjects;
    let GlobalForMatricies;
    let GlobalViews;
    let viewToCode = {};
    let localSaveData = [];
    let complianceMatricies;
    let navigationData;
    let matrixName;
    let userData;
    const matrixNameInput = document.getElementById("matrixName");

   document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    let login = sessionStorage.getItem("GlobalLogin");
    if(login === '' || login === null) {
        e.preventDefault();
        //window.location.assigsn("log-in.html");
        window.location.href = "log-in.html";
    }
    
    GlobalLogin = login;
    userData = JSON.parse(localStorage.getItem(`data-${GlobalLogin ? GlobalLogin : sessionStorage.getItem("GlobalLogin")}`));

     //sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page:"component.html", name: null, flag: false}));

    complianceMatricies = JSON.parse(sessionStorage.getItem("compliance-matricies-data"));
    if(!Array.from(Object.keys(complianceMatricies)).length){
        complianceMatricies = userData["data_awdfasda"]['compliance-matricies-data'];
        //console.log(complianceMatricies);
    }
     navigationData = JSON.parse(sessionStorage.getItem("matrix-navigation"));

     if(navigationData.name){
        matrixName = navigationData.name;
        traceabilityData = complianceMatricies[navigationData.name]["data"];
        matrixNameInput.value = matrixName;
        document.getElementsByClassName(`level1 left`)[0].parentElement.children[1].textContent = complianceMatricies[navigationData.name]["buttons"][0]
        document.getElementsByClassName(`level1 right`)[0].parentElement.children[1].textContent = complianceMatricies[navigationData.name]["buttons"][1]
        document.getElementsByClassName(`level2 left`)[0].parentElement.children[1].textContent = complianceMatricies[navigationData.name]["buttons"][2]
        document.getElementsByClassName(`level2 right`)[0].parentElement.children[1].textContent = complianceMatricies[navigationData.name]["buttons"][3]
        document.getElementsByClassName(`level3 left`)[0].parentElement.children[1].textContent = complianceMatricies[navigationData.name]["buttons"][4]
        document.getElementsByClassName(`level3 right`)[0].parentElement.children[1].textContent = complianceMatricies[navigationData.name]["buttons"][5]
     }
    
     forMatricies = JSON.parse(sessionStorage.getItem("for-matricies"));
     if(!Array.from(Object.keys(forMatricies)).length){
        forMatricies = userData["data_awdfasda"]['forMatricies'];
    }
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

     level3s =  Array.from(document.getElementsByClassName("level3"));
     for(let i = 0; i < level2s.length; ++i){
        level3Pressed(level3s[i].children[0]);
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
     document.getElementById("equalsBtn").disabled = !IsComplianceEnabled();
     createComplianceButtons("compliance-matrix.html");
     document.getElementById("verificationBtn").disabled = !IsTraceabilityEnabled();
     createTraceabilityButtons("compliance-matrix.html");
     console.log(navigationData);
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
        div.children[0].textContent = "Все";
        //level3Pressed(div.children[0])
        }
        div.parentElement.children[1].textContent = "Все";
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

   function updateTable(transponded = false) {
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
                 element1Array[v1][comp1] = GlobalForMatricies[object1]["views"][v1][comp1];
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
    const tempobj = new Object();
    const forSearch = new Object();
    Array.from(Object.keys(struct1)).forEach(object1 => {
        tempobj[config.dataFields.rows[0]] = object1;
        if(transponded){forSearch[config.dataFields.cols[0]] = object1;}
        Array.from(Object.keys(struct1[object1])).forEach(view1 => {
            tempobj[config.dataFields.rows[1]] = viewToCode[view1];
            tempobj[config.dataFields.rows[2]] = view1;
            if(transponded){
                forSearch[config.dataFields.cols[1]] = viewToCode[view1];
                forSearch[config.dataFields.cols[2]] = view1;
            }
            Array.from(Object.keys(struct1[object1][view1])).forEach(component1 => {
                tempobj[config.dataFields.rows[3]] = component1;
                if(transponded){forSearch[config.dataFields.cols[3]] = component1;}

                if(struct1[object1][view1][component1].length){
                    struct1[object1][view1][component1].forEach(element1 => {

                        tempobj[config.dataFields.rows[4]] = element1.column3;
                        if(transponded){forSearch[config.dataFields.cols[4]] = element1.column3;}
                        
                        Array.from(Object.keys(struct2)).forEach(object2 => {
                            tempobj[config.dataFields.cols[0]] = object2;
                            if(transponded){forSearch[config.dataFields.rows[0]] = object2;}

                            Array.from(Object.keys(struct2[object2])).forEach(view2 => {
                                tempobj[config.dataFields.cols[1]] = viewToCode[view2];
                                tempobj[config.dataFields.cols[2]] = view2;
                                if(transponded){
                                    forSearch[config.dataFields.rows[1]] = viewToCode[view2];
                                    forSearch[config.dataFields.rows[2]] = view2;
                                }
                                
                                Array.from(Object.keys(struct2[object2][view2])).forEach(component2 => {
                                    tempobj[config.dataFields.cols[3]] = component2;
                                    if(transponded){forSearch[config.dataFields.rows[3]] = component2;}

                                    if(struct2[object2][view2][component2].length){
                                        struct2[object2][view2][component2].forEach(element2 => {

                                            tempobj[config.dataFields.cols[4]] = element2.column3;
                                            if(transponded){forSearch[config.dataFields.rows[4]] = element2.column3;}

                                            let forComparison = (transponded ? forSearch : tempobj);
                                            let index = traceabilityData.findIndex(cell => {
                                                const {value, ...data} = cell; //тут то же, что и в config.val
                                                let returnValue = config.dataFields.rows.every(el => data[el] === forComparison[el]);
                                                if(returnValue){
                                                    returnValue = config.dataFields.cols.every(el => data[el] === forComparison[el]);
                                                }
                                                return returnValue;
                                                //console.log(data);
                                            });
                                            if(index > -1){
                                                tempobj[config.dataFields.val] =  traceabilityData[index][config.dataFields.val];
                                            }else{
                                                index = localSaveData.findIndex(cell => {
                                                    const {value, ...data} = cell; //тут то же, что и в config.val
                                                    let returnValue = config.dataFields.rows.every(el => data[el] === forComparison[el]);
                                                    if(returnValue){
                                                        returnValue = config.dataFields.cols.every(el => data[el] === forComparison[el]);
                                                    }
                                                    return returnValue;
                                                });
                                                if(index > -1){
                                                    tempobj[config.dataFields.val] =  localSaveData[index][config.dataFields.val];
                                                }else{
                                                    //console.log(tempobj);
                                                    tempobj[config.dataFields.val] = 0.0;
                                                }
                                            }
                                            newTraceabilityData.push(JSON.parse(JSON.stringify(tempobj)));
                                        });
                                    } else{
                                        tempobj[config.dataFields.cols[4]] = " ";
                                        tempobj[config.dataFields.val] = undefined;
                                        newTraceabilityData.push(JSON.parse(JSON.stringify(tempobj)));
                                    }
                                });
                            });
                        });
                    });
                }
                else{
                    tempobj[config.dataFields.rows[4]] = " ";
                    tempobj[config.dataFields.val] = undefined;
                    Array.from(Object.keys(struct2)).forEach(object2 => {
                        tempobj[config.dataFields.cols[0]] = object2;

                        Array.from(Object.keys(struct2[object2])).forEach(view2 => {
                            tempobj[config.dataFields.cols[1]] = viewToCode[view2];
                            tempobj[config.dataFields.cols[2]] = view2;
                            
                            Array.from(Object.keys(struct2[object2][view2])).forEach(component2 => {
                                tempobj[config.dataFields.cols[3]] = component2;

                                if(struct2[object2][view2][component2].length){
                                    struct2[object2][view2][component2].forEach(element2 => {
                                        tempobj[config.dataFields.cols[4]] = element2.column3;

                                        newTraceabilityData.push(JSON.parse(JSON.stringify(tempobj)));
                                    });
                                }
                                else{
                                    tempobj[config.dataFields.cols[4]] = " ";
                                    newTraceabilityData.push(JSON.parse(JSON.stringify(tempobj)));
                                }
                            });
                        });
                    });
                }
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
      
      }, 50);
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
  
  // текущая клетка
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
                  var currentValue = $(e.srcElement).text().trim();
                  var v = currentValue === '' ? '' : parseFloat(currentValue).toFixed(1);
                  
                  if (!$(e.srcElement).children().length > 0) {
                      $(e.srcElement).empty();
                      var input = $("<input class='" + cs + "' style='width: 90%;' type='number' min='0' max='9.9' step='0.1' value='" + v + "'/>");
                      $(e.srcElement).append(input);
                      activePivotInfo = {input: $(e.srcElement).find('input')[0], filters: filters};
                      
                      input.focus().select().keypress(function (event) {
                          var keycode = (event.keyCode ? event.keyCode : event.which);
                          if (keycode == '13') {
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
    updateTable(true);
    makeTheTablePretty();
    
  });

  document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    if(traceabilityData.length !== localSaveData.length){
        if(confirm(`Сохранить данные в табице?`)){
            if(matrixNameInput.value === "" || matrixNameInput.value === null || matrixNameInput.value === undefined){
                showNotification("Введите название матрицы", false);
                matrixNameInput.focus();
                console.log("sdasd")
                return
            }
            localSave();
        }
    }
    else{
        for(let i = 0; i < traceabilityData.length; ++i){
            if(JSON.stringify(traceabilityData[i]) !== JSON.stringify(localSaveData[i])){
                
                if(confirm(`Сохранить данные в табице?`)){
                    if(matrixNameInput.value === "" || matrixNameInput.value === null || matrixNameInput.value === undefined){
                        showNotification("Введите название матрицы", false);
                        matrixNameInput.focus();
                        console.log("sdasd")
                        return
                    }
                    localSave();
                }
                break
            }
        }
    }

    const num = document.getElementById("matrixCompliance").children.length - 1;
    if(navigationData.flag){
        if(navigationData.page === "compliance-matrix.html" || navigationData.page === "traceability-matrix.html"){
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: num - 1, page:"compliance-matrix.html", name: sessionStorage.getItem("previousName"), flag: false}));
        }
        window.location.href = navigationData.page;
    }
    else{
        if(num === 0) {
            window.location.href = "component.html";
        }
        else{
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: num - 1, page:"compliance-matrix.html", name: sessionStorage.getItem("previousName"), flag: false}));
            window.location.href = "compliance-matrix.html";
        }
    }

    //window.location.href = "initial-data.html";
});

document.getElementById("nextBtn").addEventListener("click", (e) => {
    e.preventDefault();

    if(traceabilityData.length !== localSaveData.length){
        if(confirm(`Сохранить данные в табице?`)){
            if(matrixNameInput.value === "" || matrixNameInput.value === null || matrixNameInput.value === undefined){
                showNotification("Введите название матрицы", false);
                matrixNameInput.focus();
                console.log("sdasd")
                return
            }
            localSave();
        }
    }
    else{
        for(let i = 0; i < traceabilityData.length; ++i){
            if(JSON.stringify(traceabilityData[i]) !== JSON.stringify(localSaveData[i])){
                
                if(confirm(`Сохранить данные в табице?`)){
                    if(matrixNameInput.value === "" || matrixNameInput.value === null || matrixNameInput.value === undefined){
                        showNotification("Введите название матрицы", false);
                        matrixNameInput.focus();
                        console.log("sdasd")
                        return
                    }
                    localSave();
                }
                break
            }
        }
    }

    const num = document.getElementById("matrixCompliance").children.length - 1;
    console.log(navigationData.flag);
    console.log(navigationData);
    if(navigationData.flag){
        if(navigationData.page === "compliance-matrix.html" || navigationData.page === "traceability-matrix.html"){
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: num + 1, page:"compliance-matrix.html", name: sessionStorage.getItem("previousName"), flag: false}));
        }
       window.location.href = navigationData.page;
    }
    else{
        sessionStorage.setItem("previousName", matrixName);
        console.log(sessionStorage.getItem("previousName"));
        if(num < 13) {
            const names = Array.from(Object.keys(complianceMatricies));
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: num + 1, page:"compliance-matrix.html", name: num >= names.length ? null : names[num+1], flag: false}));
            window.location.href = "compliance-matrix.html";
        }
        else{
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: num + 1, page:"compliance-matrix.html", name: null, flag: false}));
            window.location.href = "traceability-matrix.html";
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

let tempFlag = false;

document.getElementById("toServerBtn").addEventListener("click", (e) => {
    localSave();
    if(tempFlag){
        userData["data_awdfasda"]['compliance-matricies-data'] = JSON.parse(sessionStorage.getItem("compliance-matricies-data"));
        localStorage.setItem(`data-${GlobalLogin ? GlobalLogin : sessionStorage.getItem("GlobalLogin")}`, JSON.stringify(userData));
        console.log(JSON.parse(localStorage.getItem(`data-${GlobalLogin ? GlobalLogin : sessionStorage.getItem("GlobalLogin")}`)));
        //toServerSave();
        showNotification(`Сохранено ячеек в модели: ${localSaveData.length}`);
    }
});

document.getElementById("saveAllBtn").addEventListener("click", localSave);

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

function localSave() {

    if(!matrixName){
        showNotification("Введите название матрицы", false);
        matrixNameInput.focus();
        tempFlag = false;
        return
    }
    
    const obj1 = document.getElementsByClassName(`level1 left`)[0].parentElement.children[1].textContent;
    const obj2 = document.getElementsByClassName(`level1 right`)[0].parentElement.children[1].textContent;
    const view1 = document.getElementsByClassName(`level2 left`)[0].parentElement.children[1].textContent;
    const view2 = document.getElementsByClassName(`level2 right`)[0].parentElement.children[1].textContent;
    const comp1 = document.getElementsByClassName(`level3 left`)[0].parentElement.children[1].textContent;
    const comp2 = document.getElementsByClassName(`level3 right`)[0].parentElement.children[1].textContent;
    localSaveData = JSON.parse(JSON.stringify(traceabilityData));
    complianceMatricies[matrixNameInput.value]["data"] = localSaveData;
    complianceMatricies[matrixNameInput.value]["buttons"] = [obj1, obj2, view1, view2, comp1, comp2]
    sessionStorage.setItem("compliance-matricies-data", JSON.stringify(complianceMatricies));
    //console.log('Saving all:', traceabilityData);
    showToast(`Сохранено ячеек: ${traceabilityData.length}`, 'success');
    showNotification("Не забудьте добавить данные в модель!");
    createComplianceButtons();
    tempFlag = true;
    
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

matrixNameInput.addEventListener("change", (e) => {
    const buttons = document.getElementById("matrixCompliance").children;
    const texts = [];
    for(let i = 1; i < buttons.length; ++i){
        texts.push(buttons[i].textContent);
    }
    if(texts.indexOf(e.target.value) !== -1){
        showNotification("Матрица с таким названием уже существует!!", false);
        e.target.value = "";
    }else{
        if(matrixName){
            let temp = complianceMatricies[matrixName];
            delete complianceMatricies[matrixName];
            complianceMatricies[e.target.value] = temp;
            sessionStorage.setItem("compliance-matricies-data", JSON.stringify(complianceMatricies));
        }
        else{
            complianceMatricies[`${e.target.value}`] = {};
        }
        matrixName = e.target.value;
        let temp = JSON.parse(sessionStorage.getItem("matrix-navigation"));
        temp.name = matrixName;
        sessionStorage.setItem("matrix-navigation", JSON.stringify(temp));
        console.log(complianceMatricies);
    }
});

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.style.bottom = '75px';
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}