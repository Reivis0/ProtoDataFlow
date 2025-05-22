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
    // async load() {
    //     try {
    //         const response = await fetch('/api/settings/views');
    //         return response.ok ? await response.json() : this.defaultStructure;
    //     } catch {
    //         console.warn("Используются дефолтные данные");
    //         return this.defaultStructure;
    //     }
    // },
    async load() {
    try {
        // Если API недоступен, используем mock-данные
        const mockData = this.defaultStructure;
        console.log('Загружены mock-данные для компонентов:', mockData);
        return mockData;
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
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

// Add this to server-dataHelp.js
// function generateThirdJSON() {
//     // Get current data (either loaded or default)
//     const currentData = DataManager.data || DataManager.defaultStructure;
    
//     return currentData.views
//         .filter(view => view.enabled)
//         .map(view => ({
//             number: view.number,
//             header: view.header,
//             code: view.code,
//             components: view.components
//                 .filter(comp => comp.enabled)
//                 .map(comp => ({
//                     number: comp.number,
//                     name: comp.name,
//                     code: comp.code
//                 }))
//         }));
// }

function generateThirdJSON() {
    const enabledData = getEnabledPagesData();
    const representationsData = getRepresentationsData();
    const componentsData = getComponentsData();
    
    const result = [];
    
    // Process Views (same indexing as first JSON)
    for (let viewNum = 1; viewNum <= 7; viewNum++) {
        const viewIndex = 12 + (viewNum - 1) * 6;
        if (viewIndex >= enabledData.length) break;
        
        // Skip if view is not enabled
        if (!enabledData[viewIndex].enabled) continue;

        // Get view data from representation table
        const viewTableData = representationsData[`representation_${viewNum}`] || [];
        
        // Extract view name and code from fieldType column
        const viewNameRow = viewTableData.find(row => row.id === 'form_name');
        const viewCodeRow = viewTableData.find(row => row.id === 'form_code');
        
        const view = {
            number: viewNum,
            header: viewNameRow ? viewNameRow.fieldType : null,
            code: viewCodeRow ? viewCodeRow.fieldType : null,
            components: []
        };

        // Process Components (5 per view)
        for (let compNum = 1; compNum <= 5; compNum++) {
            const compIndex = viewIndex + compNum;
            if (compIndex >= enabledData.length) break;
            
            // Skip if component is not enabled
            if (!enabledData[compIndex].enabled) continue;

            const componentKey = `${viewNum}_${compNum}`;
            const componentTableData = componentsData[`component_${componentKey}`] || [];
            
            // Extract component name and code from fieldType column
            const compNameRow = componentTableData.find(row => row.id === 'component_name');
            const compCodeRow = componentTableData.find(row => row.id === 'component_code');
                        // Find headers data from component table
            const headers = componentTableData
                .filter(item => item.id.includes('column'))
                .map(item => ({
                    header: item.fieldType,
                    type: item.fieldType.toLowerCase().includes('число') ? 'num' : 'string',
                    maxSmth: item.size === '-' ? undefined : parseInt(item.size),
                    name: item.id,
                    enabled: item.flagEnabled
                }));
            view.components.push({
                number: compNum,
                name: compNameRow ? compNameRow.fieldType : null,
                code: compCodeRow ? compCodeRow.fieldType : null,
                headers: headers || null
            });
        }

        // Only add view if it has components or valid header/code
        if (view.components.length > 0 || view.header || view.code) {
            result.push(view);
        }
    }

    return result;
}