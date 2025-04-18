document.addEventListener('DOMContentLoaded', (e) => {
    let status = sessionStorage.getItem('GlobalLevel');
    if(status !== 'superAdmin') {
        e.preventDefault();
        window.location.href = "log-in.html";
    }

    enabeledPagesData = convertToEnabled(tempData()); //данные о первой таблице
    let gridOptions1 = createGridOptions1(enabeledPagesData);
    TableData2 = loadData();//данные о второй таблице
    let gridOptions2 = createGridOptions2(TableData2);
    gridApi1 = agGrid.createGrid(document.querySelector("#myGrid1"), gridOptions1);
    gridApi2 = agGrid.createGrid(document.querySelector("#myGrid2"), gridOptions2);
    setupButtons1();
    setupButtons2();
    showSettingsOfEnabled(enabeledPagesData); //включить настройки таблиц, которые доступны пользователю

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
    


    document.body.appendChild(exitButton);
});