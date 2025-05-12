// dataManager.js
window.DataManager = {
    // Дефолтная структура
    defaultStructure: {
        views: Array(7).fill().map((_, i) => ({
            number: i+1,
            header: `Представление ${i+1}`,
            code: `VIEW-${i+1}`,
            enabled: true,
            components: Array(5).fill().map((_, j) => ({
                number: j+1,
                name: `Компонент ${i+1}.${j+1}`,
                code: `COMP-${i+1}.${j+1}`,
                enabled: j < 2 // Первые два включены
            }))
        }))
    },

    // Загрузка данных
    async load() {
        console.log("DataManager.load() called"); // <--- Добавили эту строку
        try {
            const response = await fetch('/api/settings/views');
            return response.ok ? await response.json() : this.defaultStructure;
        } catch {
            console.warn("Используются дефолтные данные");
            return this.defaultStructure;
        }
    },

    // Сохранение данных
    async save(data) {
        try {
            await fetch('/api/settings/views', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (e) {
            console.error("Ошибка сохранения:", e);
        }
    },

    // Преобразование в нужный формат
    toOutputFormat(data) {
        return data.views
            .filter(view => view.enabled)
            .map(view => ({
                number: view.number,
                header: view.header,
                code: view.code,
                components: view.components
                    .filter(comp => comp.enabled)
                    .map(comp => ({
                        number: comp.number,
                        name: comp.name,
                        code: comp.code
                    }))
            }));
    }
};

window.DataManager = DataManager;