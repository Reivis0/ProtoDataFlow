document.addEventListener('DOMContentLoaded', (e) => {
    let status = sessionStorage.getItem('GlobalLevel');
    if(status !== 'superAdmin') {
        e.preventDefault();
        window.location.href = "log-in.html";
    }

    enabeledPagesData = convertToEnabled(tempData());
    let gridOptions1 = createGridOptions1(enabeledPagesData);
    TableData2 = loadData();
    let gridOptions2 = createGridOptions2(TableData2);
    gridApi1 = agGrid.createGrid(document.querySelector("#myGrid1"), gridOptions1);
    gridApi2 = agGrid.createGrid(document.querySelector("#myGrid2"), gridOptions2);
    setupButtons1();
    setupButtons2();
    showSettingsOfEnabled(enabeledPagesData);

    const exitButton = document.createElement('button');
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
    // exitButton.style.padding = '10px 20px';
    // exitButton.style.background = type === 'success' ? '#4CAF50' : '#f44336';
    // exitButton.style.color = 'white';
    // exitButton.style.borderRadius = '4px';
    // exitButton.style.zIndex = '1000';
    // exitButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    


    document.body.appendChild(exitButton);
});