function showNotification(message, type = 'success') { //показать уведомление пользователю
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '40px';
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

function loadData() {
    // Эмуляция запроса к серверу
    const mockData = [
        { isChosen: false, name: "Товар 1", quantity: 10, price: 100 },
        { isChosen: false, name: "Товар 2", quantity: 5, price: 200 },
        { isChosen: false, name: "Товар 3", quantity: 8, price: 150 },
        { isChosen: false, name: "Товар 4", quantity: 10, price: 100 },
        { isChosen: false, name: "Товар 5", quantity: 5, price: 200 },
    ];
    return mockData;
}

// class ActionsButtons {
//     init(params) {
//         this.params = params;
//         this.eGui = document.createElement("div");
//         this.eGui.style.display = "flex";
//         this.eGui.style.gap = "5px";
//         this.eGui.style.justifyContent = "center";
       
//         this.insertButton = document.createElement("button");
//         this.insertButton.textContent = 'Вставить строки';
//         this.insertButton.classList.add('ag-grid-insert-button');
//         this.insertButton.addEventListener('click', (e) => this.onInsert(e));
       
//         this.deleteButton = document.createElement("button");
//         this.deleteButton.textContent = 'Удалить';
//         this.deleteButton.classList.add('ag-grid-delete-button');
//         this.deleteButton.addEventListener('click', (e) => this.onDelete(e));
       
//         this.eGui.appendChild(this.insertButton);
//         this.eGui.appendChild(this.deleteButton);
//     }




//     onInsert(event) {
//         event.stopPropagation();
//         const api = this.params.api;
//         const clickedNode = this.params.node;
//         const selectedNodes = api.getSelectedNodes();
       
//         // Определяем, куда вставлять
//         const isBulkInsert = selectedNodes.length > 0 &&
//                            selectedNodes.some(node => node.id === clickedNode.id);
//         const nodesForInsert = isBulkInsert ? selectedNodes : [clickedNode];
       
//         const defaultCount = 1;
//         const question = isBulkInsert
//             ? "Сколько пустых строк вставить под каждую выбранную?"
//             : "Сколько пустых строк вставить?";
       
//         const input = prompt(question, defaultCount);
//         const count = parseInt(input) || defaultCount;
//         if (count <= 0) return;
       
//         // Получаем все данные
//         const allData = [];
//         api.forEachNode(node => allData.push(node.data));
       
//         // Подготавливаем вставку
//         const inserts = [];
//         if (nodesForInsert.length > 0) {
//             // Вставка под выбранные строки
//             nodesForInsert.forEach(node => {
//                 const rowIndex = allData.findIndex(row => row === node.data);
//                 if (rowIndex !== -1) {
//                     inserts.push({
//                         index: rowIndex + 1,
//                         rows: Array(count).fill().map(() => ({
//                             isChosen: false,
//                             name: "",
//                             quantity: 0,
//                             price: 0
//                         }))
//                     });
//                 }
//             });
//         } else {
//             // Вставка в конец таблицы
//             inserts.push({
//                 index: allData.length,
//                 rows: Array(count).fill().map(() => ({
//                     isChosen: false,
//                     name: "",
//                     quantity: 0,
//                     price: 0
//                 }))
//             });
//         }
       
//         // Сортировка и применение
//         inserts.sort((a, b) => b.index - a.index);
//         inserts.forEach(insert => {
//             allData.splice(insert.index, 0, ...insert.rows);
//         });
       
//         api.setGridOption('rowData', allData);
//         if (isBulkInsert) api.deselectAll();
//     }




//     onDelete(event) {
//         event.stopPropagation();
//         const api = this.params.api;
//         const clickedNode = this.params.node;
//         const selectedNodes = api.getSelectedNodes();
       
//         const isBulkDelete = selectedNodes.length > 0 &&
//                             selectedNodes.includes(clickedNode);
       
//         const nodesToRemove = isBulkDelete ? selectedNodes : [clickedNode];
       
//         if (!confirm(`Удалить ${nodesToRemove.length} строк(у)?`)) return;
       
//         api.applyTransaction({
//             remove: nodesToRemove.map(node => node.data)
//         });
       
//         api.deselectAll();
//     }




//     getGui() {
//         return this.eGui;
//     }




//     destroy() {
//         this.insertButton?.removeEventListener('click', this.onInsert);
//         this.deleteButton?.removeEventListener('click', this.onDelete);
//     }
// }

function showSettingsOfEnabled(enabledData){ //покакзывать таблички что включены
    divSettings2 = document.getElementById("gridContainer2");
    let display = enabledData[0].enabled ? "block" : "none";
    divSettings2.style.display = display;
}