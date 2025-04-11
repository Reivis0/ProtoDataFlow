const tableBody = document.querySelector('#dataTable tbody');
const addRowBtn = document.getElementById('addRowBtn');
const saveBtn = document.getElementById('save');
addRowBtn.addEventListener('click', addEmptyRow);


document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    let status = sessionStorage.getItem('GlobalLevel');
    //alert(status);
    if(status !== 'admin') {
        e.preventDefault();
        window.location.href = "log-in.html";
    }

    json2Table(receiveData());

    /*
    fetch("http://127.0.0.1:8080")
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); 
    })
    .then(data => {
        json2Table(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    */
})





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
    
    // Галочка для изменения
    const checkCell = document.createElement('td');
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkCell.className = 'for-checkbox';
    //checkBox.disabled = true;
  
    checkBox.addEventListener("click",  () => {
        let row = checkBox.parentElement.parentElement;

        row.querySelectorAll('td:not(.for-checkbox)').forEach(cell => {
            cell.addEventListener('click', function() {
                const originalContent = this.textContent;
                let inputType = 'text';
            
                if (this.classList.contains('date-cell')) {
                    inputType = 'date'; // or 'text' with pattern attribute
                } else if (this.classList.contains('phone-cell')) {
                    inputType = 'tel';
                } else if (this.classList.contains('email-cell')) {
                    inputType = 'email'
                }
                
                const input = document.createElement('input');
                input.className = "temp";
                input.type = inputType;
                input.value = originalContent;
                
                this.innerHTML = '';
                this.appendChild(input);
                input.focus();
                this.style.padding = 0;
                
                input.addEventListener('blur', function() {
                    cell.textContent = this.value;
                });

                if(input.type === 'tel') {

                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            cell.textContent = e.target.value;
                        } else if(!(('0' <= e.key) && (e.key <= '9'))) {
                            e.preventDefault();
                        }
                      });

                } else{
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        cell.textContent = e.target.value;
                        
                        
                    }
                  });
                }
          });
    });
    

    checkBox.disabled = true;
  });
  checkCell.appendChild(checkBox);
  tr.appendChild(checkCell);

    // Ячейки
  for (let i = 0; i < 10; i++) {
    const td = document.createElement('td');
    td.textContent = '';

    switch(i){
        case 5:
            td.className="date-cell";
            break;
        case 6:
            td.className="date-cell";
            break;
        case 7:
            td.className="email-cell";
            break;
        case 8:
            td.className="phone-cell";
            break
    }
    tr.appendChild(td);
  }

  return tr;
}

saveBtn.addEventListener("click", () => {
    const rows = tableBody.querySelectorAll("tr:not(:first-child)");
    let message = []
    rows.forEach(row => {
        const cols = row.querySelectorAll('td:not(.for-checkbox)');
        if(row.querySelector("td:first-child").querySelector("input").checked){
            let obj = new Object();
            obj.level = cols[0].textContent;
            obj.login = cols[1].textContent;
            obj.password = cols[2].textContent
            obj.nameAndPatronymic = cols[3].textContent;
            obj.surname = cols[4].textContent;
            obj.dateStart = cols[5].textContent;
            obj.dateEnd = cols[6].textContent;
            obj.mail = cols[7].textContent;
            obj.phone = cols[8].textContent;
            obj.comment = cols[9].textContent;
            message.push(obj);
        }
    });

    alert(JSON.stringify(message));
    fetch("http://127.0.0.1:8080",  {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'Content-Type': 'application/json',
            }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    }
    )
    .catch(error => console.log(error))
})

function json2Table(jsonData) {
    //alert(JSON.stringify(jsonData));
    let data = jsonData;
    data.forEach(row => {
        const tr = createEmptyRow();
        const text = [row.level, row.surname, row.nameAndPatronymic, row.login, row.password, row.dateStart, row.dateEnd, row.mail, row.phone, row.comment ]
        const cells = tr.querySelectorAll('td:not(.for-checkbox)');
        for(let i = 0; i < 10; i++) {
            cells[i].textContent = text[i];
        }
        tableBody.appendChild(tr);
    });
    checkLastRow();
  }
  
  function receiveData() {
    let obj1 = new Object();
    obj1.level = "user"
    obj1.login = "123"
    obj1.password = "123";
    obj1.nameAndPatronymic = "gff";
    obj1.surname = "reg";
    obj1.dateStart = '02.03.2005';
    obj1.dateEnd = "21.03.2005";
    obj1.mail = "dfdfsd@mail.com";
    obj1.phone = "98798";
    obj1.comment = "ffddfd";
  
    let obj2 = new Object();
    obj2.level = "admin"
    obj2.login = "321"
    obj2.password = "321";
    obj2.nameAndPatronymic = "gff";
    obj2.surname = "reg";
    obj2.dateStart = '02.03.2005';
    obj2.dateEnd = "21.03.2005";
    obj2.mail = "dfdfsd@mail.com";
    obj2.phone = "98798";
    obj2.comment = "ffddfd";
  
    let obj3 = new Object();
    obj3.level = "user"
    obj3.login = "222"
    obj3.password = "222";
    obj3.nameAndPatronymic = "gff";
    obj3.surname = "reg";
    obj3.dateStart = '02.03.2005';
    obj3.dateEnd = "21.03.2005";
    obj3.mail = "dfdfsd@mail.com";
    obj3.phone = "98798";
    obj3.comment = "ffddfd";
  
    return [obj1, obj2, obj3]
  }
  
  document.getElementById("back").addEventListener("click", (e) => {
  
    sessionStorage.clear();
    e.preventDefault();
     window.location.href = "log-in.html";
  })