let userData;
let GlobalLogin;
let TypesDict = {};
document.addEventListener("DOMContentLoaded", (e) => {

    let login = sessionStorage.getItem("GlobalLogin");
    if(login === '' || login === null) {
        e.preventDefault();
        //window.location.assigsn("log-in.html");
        window.location.href = "log-in.html";
    }
    GlobalLogin = login;
    userData = JSON.parse(localStorage.getItem(`data-model`));
    console.log(userData)
    document.getElementById("message").textContent = returnText();
    const currentModel = "Модель тест 1";
    // const currentModel = sessionStorage.getItem("currentModel");
    document.getElementById("toFile").addEventListener("click", (e) =>{
        showToast("Файл готов к скачиванию", "success");
        const wb = XLSX.utils.book_new();
        const info = userData.specialFieldForModels_ddqasdawd.find(el => el.name === currentModel);


        const ws1 = XLSX.utils.aoa_to_sheet(
            [
                ["Информация о модели"],
            ], { origin: "C1" }
        );
        

        XLSX.utils.sheet_add_aoa(ws1, [
            ["Автор", "Комментарии", "Характеристики модели", "Код", "Название", "Организация", "Сведения о системе"]
        ], { origin: "C3" });
        
        // Add data at A3
        XLSX.utils.sheet_add_json(ws1, [info.data], {
            skipHeader: true,
            origin: "C4"
        });
        

        ws1['!merges'] = [{s: {r:0, c:2}, e: {r:0, c:8}}];
        setColumnWidths(ws1, [20, 25, 30, 15, 25, 20, 30], 2);

        let temp = structuredClone(userData.data_awdfasda["initial-data"]);
        delete temp.lastSaved;
        const ws2 = XLSX.utils.aoa_to_sheet(
            [
                ["Начальные данные"]  
            ], { origin: "C1" }
        );
        
        XLSX.utils.sheet_add_aoa(ws2, [
            ["Допущения", "Основной замысел", "Условия работы", "Дополнительно"]
        ], { origin: "C3" });
        
        XLSX.utils.sheet_add_json(ws2, [temp], {
            skipHeader: true,
            origin: "C4"
        });
        
        ws2['!merges'] = [{s: {r:0, c:2}, e: {r:0, c:5}}];
        setColumnWidths(ws2, [30, 25, 25, 30], 2);


        const ws3 = XLSX.utils.aoa_to_sheet(
            [
                ["Начальные требования"]  
            ], { origin: "C1" }
        );
        
        XLSX.utils.sheet_add_aoa(ws3, [
            ["ID", "Флаг", "Источник требований", "Объект", "Требование", "Ед. изм.", "Количество 1", "Количество 2", "Код"]
        ], { origin: "C3" });
        
        XLSX.utils.sheet_add_json(ws3, userData.data_awdfasda["initial-requrements"], {
            skipHeader: true,
            origin: "C4"
        });
        
        ws3['!merges'] = [{s: {r:0, c:2}, e: {r:0, c:10}}];
        setColumnWidths(ws3, [10, 10, 25, 20, 30, 15, 15, 15, 10], 2);

        const ws4 = XLSX.utils.aoa_to_sheet(
            [
                ["Перечень моделируемых объектов"]  
            ], { origin: "C1" }
        );
        
        XLSX.utils.sheet_add_aoa(ws4, [
            ["Объект", "Тип"]
        ], { origin: "C3" });

        const tempObj = structuredClone(userData.data_awdfasda["all-objects"]);
        tempObj.forEach(element => {
            if(element.Type){
                element.Type = TypesDict[element.Type];
            }
            else{
                element.Type = "(нет)";
            }
        });
        XLSX.utils.sheet_add_json(ws4, tempObj, {
        //XLSX.utils.sheet_add_json(ws4, userData.data_awdfasda["all-objects"], {
            skipHeader: true,
            origin: "C4"
        });
        
        ws4['!merges'] = [{s: {r:0, c:2}, e: {r:0, c:3}}];
        setColumnWidths(ws4, [30, 20], 2); 


        XLSX.utils.book_append_sheet(wb, ws1, "Информация о модели");
        XLSX.utils.book_append_sheet(wb, ws2, "Начальные данные");
        XLSX.utils.book_append_sheet(wb, ws3, "Начальные требования");
        XLSX.utils.book_append_sheet(wb, ws4, "Моделируемые объекты");


        const forMatricies = userData.data_awdfasda["forMatricies"];
        console.log(forMatricies)
        let i = 1;
        let j = 1;
        let k = 1;
        Array.from(Object.keys(forMatricies)).forEach(object =>{

            const ws5 = XLSX.utils.aoa_to_sheet(
                [
                    [`Требования (спецификация) для объекта: ${object}`] 
                ], { origin: "C1" }
            );
            
            XLSX.utils.sheet_add_aoa(ws5, [
                ["ID", "Флаг", "Источник требований", "Категория требований", "Требование", "Ед. изм.", "Количество 1", "Количество 2", "Код"]
            ], { origin: "C3" });
            
            XLSX.utils.sheet_add_json(ws5, forMatricies[object]["specific-requrements"], {
                skipHeader: true,
                origin: "C4"
            });
            
            ws5['!merges'] = [{s: {r:0, c:2}, e: {r:0, c:10}}];
            setColumnWidths(ws5, [10, 10, 25, 20, 30, 15, 15, 15, 10], 2); 

            XLSX.utils.book_append_sheet(wb, ws5, `Требования объект ${k}`); 
            i = 1;
            Array.from(Object.keys(forMatricies[object]["views"])).forEach(view =>{
                j = 1;
                Array.from(Object.keys(forMatricies[object]["views"][view])).forEach(component =>{

                    const ws6 = XLSX.utils.aoa_to_sheet(
                        [
                            [`Компонент "${component}" представления "${view}" для объекта: ${object}`] 
                        ], { origin: "C1" }
                    );
                    
                    XLSX.utils.sheet_add_aoa(ws6, [
                        ["ID", "Флаг", "Столбик 1", "Столбик 2", "Столбик 3", "Столбик 4", "Столбик 5", "Столбик 6", "Столбик 7"]
                    ], { origin: "C3" });
                    
                    XLSX.utils.sheet_add_json(ws6, forMatricies[object]["views"][view][component], {
                        skipHeader: true,
                        origin: "C4"
                    });
                    
                    ws6['!merges'] = [{s: {r:0, c:2}, e: {r:0, c:10}}];
                    setColumnWidths(ws6, [10, 10, 25, 20, 30, 15, 15, 15, 10], 2); 

                    XLSX.utils.book_append_sheet(wb, ws6, `Компонент ${i}.${j} объект ${k}`);
                    ++j
                });
                ++i
            });
            ++k;
        });

        i = 1;
        const complianceMatricies = JSON.parse(sessionStorage.getItem("exel_compliance"));
        Array.from(Object.keys(complianceMatricies)).forEach(name => {
            const json = complianceMatricies[name];
            const ws7 = XLSX.utils.aoa_to_sheet(json.data);
            XLSX.utils.book_append_sheet(wb, ws7, `Матрица соответствия ${i}`);
            ++i;
        });

        i = 1;
        const traceabilityMatricies = JSON.parse(sessionStorage.getItem("exel_traceability"));
        Array.from(Object.keys(traceabilityMatricies)).forEach(name => {
            const json = traceabilityMatricies[name];
            const ws8 = XLSX.utils.aoa_to_sheet(json.data);
            XLSX.utils.book_append_sheet(wb, ws8, `Матрица трассировки ${i}`);
            ++i;
        });


        XLSX.writeFile(wb, `${info.data.modelCode}_${info.data.modelName}_${info.data.author}.xlsx`);
    })

    document.getElementById("equalsBtn").disabled = !IsComplianceEnabled();
    createComplianceButtons("last-page.html");
    document.getElementById("verificationBtn").disabled = !IsTraceabilityEnabled();
    createTraceabilityButtons("last-page.html");

    const forTypes = JSON.parse(sessionStorage.getItem("objTypes"));
    forTypes.Types.forEach(type => {
        TypesDict[type.num] = type.name;
    });

    const dropUps = Array.from(document.getElementsByClassName("dropUp"));

    for (let i = 0; i < dropUps.length; ++i) {
        dropUps[i].addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropUps[i].children[0].style.display === 'flex';
            dropUps[i].children[0].style.display = isOpen ? 'none' : 'flex';
        });

        dropUps[i].addEventListener('mouseleave', function() {
            setTimeout(() => {
            if (!dropUps[i].children[0].matches(':hover')) {
                dropUps[i].children[0].style.display = 'none';
            }
            }, 200);
        });
    }

})


document.getElementById("backBtn").addEventListener("click", (e) => {
    const navigationData = JSON.parse(sessionStorage.getItem("matrix-navigation"));
    sessionStorage.setItem("matrix-navigation", JSON.stringify({count: navigationData.count - 1, page:"last-page.html", name: sessionStorage.getItem("previousName"), flag: false}));
    window.location.href = "traceability-matrix.html";
});

document.getElementById("exitBtn").addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})



function returnText(){
    return "На этой странице вы можете скачать вашу модель в виде xlsx файла!"
}

function setColumnWidths(worksheet, widths, startCol = 0) {
    if (!worksheet['!cols']) worksheet['!cols'] = [];
    
    // Set widths starting from specified column index
    widths.forEach((width, index) => {
        const colIndex = startCol + index;
        worksheet['!cols'][colIndex] = { 
            wch: width,
            //alignment: { horizontal: 'center', vertical: 'center' } 
         };
    });
}
