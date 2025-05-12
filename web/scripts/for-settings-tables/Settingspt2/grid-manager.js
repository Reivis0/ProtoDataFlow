// grid-manager.js
class GridManager {
    constructor(containerId, gridOptions, getData) {
        this.containerId = containerId;
        this.gridOptions = gridOptions;
        this.gridApi = null;
        this.getData = getData; // Функция для получения данных для таблицы
        this.enabledData = null; // Здесь будем хранить данные о видимости
        this.init();
    }

    async init() {
        this.gridOptions.rowData = await this.getData(); //загрузка данных
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found.`);
            return;
        }

        // Создание элемента таблицы (ag-Grid)
        const gridDiv = document.createElement('div');
        gridDiv.id = `${this.containerId}-grid`;
        gridDiv.className = 'ag-theme-alpine';
        gridDiv.style.height = 'calc(100% - 50px)'; // Или как вам нужно
        container.appendChild(gridDiv);

        this.gridApi = agGrid.createGrid(gridDiv, this.gridOptions); // Инициализация ag-Grid
    }


    // Обновление видимости таблицы
    updateVisibility(enabled) {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.style.display = enabled ? 'block' : 'none';
        }
    }

    // Получение данных из другой таблицы (пример)
    setEnabledData(data) {
        this.enabledData = data;
    }

    // Утилитарные методы (можно добавить кнопки, обработку событий и т.д.)
    // Например, метод для получения выбранных строк
    getSelectedRows() {
        if (this.gridApi) {
            const selectedNodes = this.gridApi.getSelectedNodes();
            return selectedNodes.map(node => node.data);
        }
        return [];
    }
}