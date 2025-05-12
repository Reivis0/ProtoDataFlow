// settingsManager.js
window.SettingsManager = {
    async init() {
        this.data = await DataManager.load();
        this.renderTables();
        this.setupEventListeners();
    },

    renderTables() {
        // Очищаем контейнер
        const container = document.getElementById('settingsContainer');
        container.innerHTML = '';

        // Рендерим таблицы представлений
        this.data.views.forEach(view => {
            const viewTable = this.createViewTable(view);
            container.appendChild(viewTable);

            // Рендерим компоненты для представления
            view.components.forEach(comp => {
                const compTable = this.createComponentTable(view.number, comp);
                container.appendChild(compTable);
            });
        });
    },

    createViewTable(view) {
        const table = document.createElement('div');
        table.className = 'view-table';
        table.dataset.viewNumber = view.number;
        
        table.innerHTML = `
            <div class="header">
                <h3>Представление ${view.number}</h3>
                <label>
                    <input type="checkbox" ${view.enabled ? 'checked' : ''} 
                           data-target="view" data-number="${view.number}">
                    Активно
                </label>
            </div>
            <div class="form-group">
                <label>Название:</label>
                <input type="text" value="${view.header}" 
                       data-field="header" data-number="${view.number}">
            </div>
            <div class="form-group">
                <label>Код:</label>
                <input type="text" value="${view.code}" 
                       data-field="code" data-number="${view.number}">
            </div>
        `;
        
        return table;
    },

    createComponentTable(viewNumber, component) {
        const table = document.createElement('div');
        table.className = `component-table ${component.enabled ? '' : 'disabled'}`;
        table.dataset.viewNumber = viewNumber;
        table.dataset.componentNumber = component.number;
        
        table.innerHTML = `
            <div class="header">
                <h4>Компонент ${viewNumber}.${component.number}</h4>
                <label>
                    <input type="checkbox" ${component.enabled ? 'checked' : ''}
                           data-target="component" 
                           data-view="${viewNumber}" 
                           data-number="${component.number}">
                    Активно
                </label>
            </div>
            <div class="form-group">
                <label>Название:</label>
                <input type="text" value="${component.name}" 
                       data-field="name" 
                       data-view="${viewNumber}" 
                       data-number="${component.number}">
            </div>
            <div class="form-group">
                <label>Код:</label>
                <input type="text" value="${component.code}" 
                       data-field="code" 
                       data-view="${viewNumber}" 
                       data-number="${component.number}">
            </div>
        `;
        
        return table;
    },

    setupEventListeners() {
        document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());
        
        // Обработчики изменений
        document.addEventListener('change', (e) => {
            if (e.target.matches('[data-target="view"]')) {
                this.toggleView(
                    parseInt(e.target.dataset.number),
                    e.target.checked
                );
            }
            
            if (e.target.matches('[data-target="component"]')) {
                this.toggleComponent(
                    parseInt(e.target.dataset.view),
                    parseInt(e.target.dataset.number),
                    e.target.checked
                );
            }
        });

        // Обработчики редактирования
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-field]')) {
                this.updateField(e.target);
            }
        });
    },

    toggleView(viewNumber, enabled) {
        const view = this.data.views.find(v => v.number === viewNumber);
        if (view) {
            view.enabled = enabled;
            this.updateUI();
        }
    },

    toggleComponent(viewNumber, compNumber, enabled) {
        const view = this.data.views.find(v => v.number === viewNumber);
        if (view) {
            const comp = view.components.find(c => c.number === compNumber);
            if (comp) {
                comp.enabled = enabled;
                this.updateUI();
            }
        }
    },

    updateField(input) {
        const { field, number, view } = input.dataset;
        const value = input.value;
        
        if (field === 'header' || field === 'code') {
            // Обновление представления
            const viewObj = this.data.views.find(v => v.number === parseInt(number));
            if (viewObj) viewObj[field] = value;
        } else {
            // Обновление компонента
            const viewObj = this.data.views.find(v => v.number === parseInt(view));
            if (viewObj) {
                const comp = viewObj.components.find(c => c.number === parseInt(number));
                if (comp) comp[field] = value;
            }
        }
    },

    updateUI() {
        // Можно оптимизировать перерисовку только измененных элементов
        this.renderTables();
    },

    async saveSettings() {
        const outputData = DataManager.toOutputFormat(this.data);
        await DataManager.save(outputData);
        alert('Настройки сохранены!');
        console.log('Сохраненные данные:', outputData);
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => SettingsManager.init());