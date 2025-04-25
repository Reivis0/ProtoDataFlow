document.addEventListener('DOMContentLoaded', (e) => {
    let status = sessionStorage.getItem('GlobalLevel');
    if(status !== 'superAdmin') {
        e.preventDefault();
        window.location.href = "log-in.html";
    }

    fetch('http://127.0.0.1:8080/api/auth')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        enabeledPagesData = convertToEnabled(data); //данные о первой таблице
        let gridOptions1 = createGridOptions1(enabeledPagesData);
        gridApi1 = agGrid.createGrid(document.querySelector("#myGrid1"), gridOptions1);
        setupButtons1();
        showSettingsOfEnabled(enabeledPagesData); //включить настройки таблиц, которые доступны пользователю
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    // enabeledPagesData = convertToEnabled(tempData()); //данные о первой таблице
    // let gridOptions1 = createGridOptions1(enabeledPagesData);
    // gridApi1 = agGrid.createGrid(document.querySelector("#myGrid1"), gridOptions1);
    TableData2 = loadData();//данные о второй таблице
    let gridOptions2 = createGridOptions2(TableData2);
    gridApi2 = agGrid.createGrid(document.querySelector("#myGrid2"), gridOptions2);
    setupButtons2();
    
    const exitButton = document.createElement('button'); //кнопка выйти
    exitButton.textContent = "Выйти";
    exitButton.classList.add('leave-btn');
    exitButton.addEventListener("click", (e) => {
        //sessionStorage.clear();
        e.preventDefault();
        window.location.href = "log-in.html";
    });
    exitButton.style.position = 'fixed';
    exitButton.style.bottom = '20px';
    exitButton.style.right = '20px';
    exitButton.style.width = "9%";
    exitButton.style.backgroundColor = "white";
    exitButton.style.zIndex = "5";
    


    document.body.appendChild(exitButton);
});