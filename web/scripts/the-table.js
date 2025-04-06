/*
document.addEventListener('DOMContentLoaded', (e) => {

  let login = sessionStorage.getItem("GlobalLogin");
  if(login === '' || login === null) {
    e.preventDefault();
    //window.location.assigsn("log-in.html");
    window.location.href = "log-in.html";
  }
});

*/


const tableBody = document.querySelector('#dataTable tbody');
const addRowBtn = document.getElementById('addRowBtn');

addRowBtn.addEventListener('click', addEmptyRow);

  //json2Table(GetFunction()); //Раскоментить эту строчку
  json2Table(receiveData());

new Sortable(tableBody, {
    animation: 150,
    handle: '.drag-handle',
    filter: '.action-buttons', // Ignore buttons during drag
    onEnd: () => checkLastRow()
});
  // Изменение по двойному щелчку
tableBody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD' && !e.target.classList.contains('drag-handle') && !e.target.closest('.action-buttons')) {
      e.target.contentEditable = true;
      e.target.focus();
  }
});

  // Save edits on Enter/Blur
tableBody.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.contentEditable = false;
    checkLastRow();
  }
});

tableBody.addEventListener('blur', (e) => {
  if (e.target.contentEditable === 'true') {
    e.target.contentEditable = false;
    checkLastRow();
  }
}, true);

  // Добавлять новую строку когда послдняя не пустая
function checkLastRow() {
  const rows = tableBody.querySelectorAll('tr');
  if (rows.length === 0) {
    addEmptyRow();
    return;
  }
  const lastRow = rows[rows.length - 1]; 
    const cells = lastRow.querySelectorAll('td:not(:first-child):not(:last-child)');
  let isEmpty = true;
  cells.forEach(cell => {
    if (cell.textContent.trim() !== '') isEmpty = false;
  });
  if (!isEmpty) addEmptyRow();
}

  // Добавление пустой строки
function addEmptyRow() {
  const newRow = createEmptyRow();
  tableBody.appendChild(newRow);
}

  // Создание пустой строки
function createEmptyRow() {
  const tr = document.createElement('tr');
    
    // чтобы двигать строки
  const dragCell = document.createElement('td');
  dragCell.innerHTML = '≡';
  dragCell.className = 'drag-handle';
  tr.appendChild(dragCell);

    // Ячейки
  for (let i = 0; i < 7; i++) {
    const td = document.createElement('td');
    td.textContent = '';
    tr.appendChild(td);
  }

    //  ячейка для удаления и добавления
  const buttonsCell = document.createElement('td');
  buttonsCell.className = 'action-buttons';
    
    // Удаление
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'X';
  deleteButton.title = 'Delete row';
  deleteButton.addEventListener('click', () => {
    tr.remove();
    checkLastRow();
  });
    
    // Добавление
  const addAboveButton = document.createElement('button');
  addAboveButton.innerHTML = '+';
  addAboveButton.title = 'Add row above';
  addAboveButton.addEventListener('click', () => {
    const newRow = createEmptyRow();
    tr.before(newRow); // Insert above current row
  });


  buttonsCell.appendChild(addAboveButton);
  buttonsCell.appendChild(deleteButton);
  tr.appendChild(buttonsCell);
  return tr;
}

function json2Table(jsonData) {
  alert(JSON.stringify(jsonData));
  //let data = JSON.parse(jsonData); 
  let data = jsonData;
  //alert(data);
  data.forEach(row => {
    const tr = createEmptyRow();
    const cells = tr.querySelectorAll('td:not(.drag-handle):not(.action-buttons)');
    cells[0].textContent = row.login;
    cells[1].textContent = row.password;
    cells[2].textContent = row.name;
    cells[3].textContent = row.surname;
    cells[4].textContent = row.patronymic;
    cells[5].textContent = row.agreement;
    cells[6].textContent = row.date;
    tableBody.appendChild(tr);
  });

  document.getElementById("tableHeader").innerHTML='Ваш уровень доступа: ' + sessionStorage.getItem("GlobalLevel");
  checkLastRow();
}

function receiveData() {
  let obj1 = new Object();
  obj1.login = "123"
  obj1.password = "123";
  obj1.name = "gff";
  obj1.surname = "reg";
  obj1.patronymic = "ytghgh";
  obj1.agreement = 'true';
  obj1.date = "21.03.2005";

  let obj2 = new Object();
  obj2.login = "321"
  obj2.password = "321";
  obj2.name = "gfdfd";
  obj2.surname = "aaad";
  obj2.patronymic = "yf";
  obj2.agreement = 'true';
  obj2.date = "12.05.2012";

  let obj3 = new Object();
  obj3.login = "12111"
  obj3.password = "12333";
  obj3.name = "gfyfbb";
  obj3.surname = "rffag";
  obj3.patronymic = "ykkkh";
  obj3.agreement = 'true';
  obj3.date = "21.13.2505";

  let obj4 = new Object();
  obj4.login = "qsss"
  obj4.password = "nnnn";
  obj4.name = "sfs";
  obj4.surname = "resf";
  obj4.patronymic = "ytsfcgh";
  obj4.agreement = 'true';
  obj4.date = "31.10.2012";

  return [obj1, obj2, obj3, obj4]
}

document.getElementById("back").addEventListener("click", (e) => {

  sessionStorage.clear();
  e.preventDefault();
   window.location.href = "log-in.html";
})

/*
tableBody.addEventListener('paste', (e) => {
  e.preventDefault();
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
      
    // Clean and parse the pasted data
  const rows = pastedText.split('\n')
    .map(row => {
        // Remove trailing tab if exists and trim the row
      const cleanRow = row.replace(/\t$/, '').trim();
      return cleanRow ? cleanRow.split('\t') : [];
    })
    .filter(row => row.length > 0); // Remove completely empty rows
    
  if (rows.length === 0) return;
    
      // Get starting position
  const startCell = e.target.closest('td');
  if (!startCell) return;
      
  const startRow = startCell.parentElement;
  const startRowIndex = Array.from(tableBody.children).indexOf(startRow);
  const startColIndex = Array.from(startRow.children).indexOf(startCell);
    
      // Calculate needed rows (for auto-expand)
  const totalRowsAfterPaste = startRowIndex + rows.length;
  const rowsToAdd = totalRowsAfterPaste - tableBody.children.length;
  for (let i = 0; i < rowsToAdd; i++) {
    addEmptyRow();
  }
    
      // Paste data with precise positioning
  for (let rowOffset = 0; rowOffset < rows.length; rowOffset++) {
    const targetRow = tableBody.children[startRowIndex + rowOffset];
    if (!targetRow) break;
    
    const cellsToPaste = rows[rowOffset];
    for (let colOffset = 0; colOffset < cellsToPaste.length; colOffset++) {
      const targetColIndex = startColIndex + colOffset;
        // Only paste into data cells (skip first and last columns)
      if (targetColIndex > 0 && targetColIndex < targetRow.children.length - 1) {
        const targetCell = targetRow.children[targetColIndex];
        if (targetCell) {
          targetCell.textContent = cellsToPaste[colOffset] || '';
        }
      }
    }
  }
   
  checkLastRow();
});
*/