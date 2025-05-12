document.addEventListener('DOMContentLoaded', (e) => {
    let status = sessionStorage.getItem('GlobalLevel');
    if(status !== 'superAdmin') {
        e.preventDefault();
        window.location.href = "log-in.html";
    }

    enabeledPagesData = convertToEnabled(tempData());
    let gridOptions1 = createGridOptions1(enabeledPagesData);
    gridApi1 = agGrid.createGrid(document.querySelector("#myGrid1"), gridOptions1);
    setupButtons1();
    
    showSettingsOfEnabled(enabeledPagesData);

    const exitButton = document.createElement('button');
    exitButton.textContent = "Выйти";
    exitButton.classList.add('leave-btn');
    exitButton.addEventListener("click", (e) => {
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


// function showSettingsOfEnabled(enabledData) {
//     // Проверяем структуру данных
//     console.log('Enabled Data:', enabledData);
    
//     // Типы объектов (1-12)
//     for (let i = 1; i <= 12; i++) {
//         const container = document.getElementById(`objectTypeGrid${i}`);
//         if (container) {
//             const isEnabled = enabledData[i-1]?.enabled;
//             container.style.display = isEnabled ? 'block' : 'none';
//             console.log(`Тип объекта ${i}:`, isEnabled ? 'visible' : 'hidden');
//         }
//     }

//     // Представления (1-7) ой а так нельзя А КАК МОЖНО Я НИЧЕГО НЕ ПОНИМАЮ
//     for (let i = 1; i <= 7; i++) {
//         const container = document.getElementById(`representationGrid${i}`);
//         if (container) {
//             // Индексы представлений начинаются после 12 типов объектов
//             // Каждое представление имеет 1 + 5 элементов (само представление + 5 компонентов)
//             const viewIndex = 12 + (i-1)*6; // Первый элемент представления
//             const isEnabled = enabledData[viewIndex]?.enabled;
            
//             container.style.display = isEnabled ? 'block' : 'none';
//             console.log(`Представление ${i} (index ${viewIndex}):`, 
//                        isEnabled ? 'visible' : 'hidden');
//         }
//     }
// }
function showSettingsOfEnabled(enabledData) {
    // Проверяем структуру данных
    console.log('Enabled Data:', enabledData);
    
    // Типы объектов (1-12)
    for (let i = 1; i <= 12; i++) {
        const container = document.getElementById(`objectTypeGrid${i}`);
        if (container) {
            const isEnabled = enabledData[i-1]?.enabled;
            container.style.display = isEnabled ? 'block' : 'none';
            console.log(`Тип объекта ${i}:`, isEnabled ? 'visible' : 'hidden');
        }
    }

    // Представления (1-7) и их компоненты (1-5)
    for (let i = 1; i <= 7; i++) {
        const viewIndex = 12 + (i-1)*6; // Индекс представления в enabledData
        const isViewEnabled = enabledData[viewIndex]?.enabled;
        const viewContainer = document.getElementById(`representationGrid${i}`);
        
        // Управление видимостью представления
        if (viewContainer) {
            viewContainer.style.display = isViewEnabled ? 'block' : 'none';
            console.log(`Представление ${i}:`, isViewEnabled ? 'visible' : 'hidden');
        }

        // Управление видимостью компонентов представления
        for (let j = 1; j <= 5; j++) {
            const componentIndex = viewIndex + j; // Индекс компонента в enabledData
            const isComponentEnabled = enabledData[componentIndex]?.enabled;
            const componentContainer = document.getElementById(`componentGrid_${i}_${j}`);
            
            if (componentContainer) {
                // Компонент видим только если включено и представление, и сам компонент
                componentContainer.style.display = (isViewEnabled && isComponentEnabled) ? 'block' : 'none';
                console.log(`Компонент ${i}.${j}:`, 
                          (isViewEnabled && isComponentEnabled) ? 'visible' : 'hidden');
            }
        }
    }
}