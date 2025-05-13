    // Получаем все элементы формы
    const inputs = [
        document.getElementById("author"),
        document.getElementById("organization"),
        document.getElementById("modelName"),
        document.getElementById("modelCode"),
        document.getElementById("modelCharacteristics"),
        document.getElementById("systemInfo"),
        document.getElementById("comments")
    ]

        // Получаем все label элементы
    const labels = inputs.map(input => document.querySelector(`label[for="${input.id}"]`));

    // Инициализация модели
    let savedModels = [];
    let currentModelId = null;
    let GlobalLogin;
    let userData;

document.addEventListener("DOMContentLoaded", (e) => {

    let login = sessionStorage.getItem("GlobalLogin");
    if(login === '' || login === null) {
        e.preventDefault();
        //window.location.assigsn("log-in.html");
        window.location.href = "log-in.html";
    }

    GlobalLogin = login;
    userData = JSON.parse(localStorage.getItem(`data-model`));
    console.log(userData);
    

    // Получаем данные с сервера
    const serverData = receiveData();
    
    // Настраиваем форму
    configureForm(
        inputs.map(input => document.querySelector(`label[for="${input.id}"]`)),
        inputs,
        serverData
    );

    const status = sessionStorage.getItem('GlobalLevel');

    if(status === "admin"){
        const settings = document.getElementById("Settings");
        settings.style.display = "block";
        settings.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "settings.html";
        });
        document.getElementById("forCentring").style.flexGrow = "0.75";
    }
    else if (status === "superAdmin"){
        const addUsers = document.getElementById("AddUsers");
        addUsers.style.display = "block";
        addUsers.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "add-users.html";
        });
        const settings = document.getElementById("Settings");
        settings.style.display = "block";
        settings.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "settings.html";
        });

        document.getElementById("forCentring").style.flexGrow = "0.6";
    }
    let Views = loadViews();
    sessionStorage.setItem("Views", JSON.stringify(Views));
    // Инициализация
    const dataFromServer = receiveData();
    configureForm(labels, inputs, dataFromServer);    
    setupFormSubmit(inputs);
    setupActionButtons(inputs);
    addInputCounters(inputs);
    setupDropUpMenus();
    setupHeaderButtons();
    initModelLoader();
    loadSavedData(inputs);

});
// Основные функции
function validateRequiredFields(inputs) {
    const requiredFields = [0, 1, 2, 5]; // Индексы обязательных полей: author, organization, modelName, systemInfo
    let isValid = true;
    
    for (const index of requiredFields) {
        if (!inputs[index].value.trim()) {
            showToast(`Поле "${inputs[index].previousElementSibling.textContent}" обязательно для заполнения`, 'error');
            inputs[index].focus();
            isValid = false;
            break;
        }
    }
    
    return isValid;
}

function configureForm(labels, inputs, serverData) {
    // Устанавливаем заголовок формы
    document.getElementById('mainFormName').textContent = serverData.formTitle || 'Требования исходные';
    
    // Настраиваем поля формы
    serverData.fields.forEach((fieldData, i) => {
        if (labels[i] && fieldData.name) {
            labels[i].textContent = fieldData.name;
        }
        
        const defaultMaxLen = inputs[i].tagName === 'TEXTAREA' ? 2000 : 150;
        const maxLen = Number(fieldData.maxLength) || defaultMaxLen;
        inputs[i].maxLength = maxLen > 0 ? maxLen : defaultMaxLen;
        inputs[i].setAttribute('maxlength', inputs[i].maxLength);
    });
}

function receiveData() {
    return {
        formTitle: "Требования исходные", // Приходит)
        fields: [
            { name: "Автор модели", maxLength: 100 },
            { name: "Организация", maxLength: 150 },
            { name: "Название модели", maxLength: 120 },
            { name: "Код модели", maxLength: 10 },
            { name: "Характеристика модели", maxLength: 2000 },
            { name: "Сведения о системе", maxLength: 2000 },
            { name: "Комментарии", maxLength: 1000 }
        ]
    };
}

function initModelLoader() {
    const loadBtn = document.getElementById('loadModelBtn');
    const createBtn = document.getElementById('createNewModelBtn');
    
    createBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        createNewModel();
        closeAllMenus();
    });

    loadSavedModels();
    
    if (savedModels.length === 0) {
        createNewModel();
    } else {
        currentModelId = savedModels[savedModels.length - 1].id;
        loadModel(currentModelId);
    }
}

function createNewModel() {
    const modelId = Date.now();
    const newModel = {
        id: modelId,
        name: `Модель  ${savedModels.length + 1}`,
        variant: `Вариант 1`,
        date: new Date(),
        data: getFormData()
    };
    
    savedModels.push(newModel);
    currentModelId = modelId;
    updateModelList(newModel);
    showToast(`Создана: ${newModel.name} - ${newModel.variant}`, 'success');
    
    userData["data_awdfasda"] = {"initial-data": {}, "initial-requrements": [], "all-objects": [], "forMatricies":{}, "traceability-matricies-data": {}, "compliance-matricies-data": {}};
    localStorage.setItem(`data-model`, JSON.stringify(userData));
    loadModel(modelId, false);


    fetch(ServerAdress+`/data/${GlobalLogin ? GlobalLogin : sessionStorage.getItem("GlobalLogin")}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key:  sessionStorage.getItem("currentModel"),
            value: userData
        })
    });

}

function getFormData() {
    return {
        author: "",
        organization: "",
        modelName: "",
        modelCode: "",
        modelCharacteristics: "",
        systemInfo: "",
        comments: ""
    };
}

function loadSavedModels() {
    let modelsData = userData.specialFieldForModels_ddqasdawd;
    //modelsData = null;
    if (modelsData) {
        savedModels = modelsData;
        //console.log(savedModels);

        //убрать когда будет сервер
        // Array.from(Object.keys(userData)).forEach(key => { // по идее не должно быть
        //     if(key !== "specialFieldForModels_ddqasdawd" && key !== "data_awdfasda" && savedModels.findIndex(model => model.name === key) === -1){
        //         delete userData[key];
        //         console.log(key);
        //     }
        // });
        savedModels.forEach(model => updateModelList(model));
        
    }
}

function saveModels() {
     userData.specialFieldForModels_ddqasdawd = savedModels;
     userData.specialFieldForModels_ddqasdawd.data = sessionStorage.getItem('formData1');
     localStorage.setItem(`data-model`, JSON.stringify(userData));
     console.log(JSON.parse(localStorage.getItem(`data-model`)));

}

function updateModelList(model) {
    const modelList = document.getElementById('modelList');
    // while (modelList.children.length > 1) {
    //     modelList.removeChild(modelList.lastChild);
    // }
    
    //savedModels.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(model => {
    const btn = document.createElement('button');
    btn.className = 'dropUpBtn model-item';
    btn.id = `${model.id}`;
    btn.innerHTML = `
        <div class="model-info"">
            <span class="model-name">${model.name}</span>
            <span class="model-details">${model.variant}</span>
        </div>
        <span class="model-date">${formatDate(model.date)}</span>
    `;
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadModel(model.id);
        closeAllMenus();
    });
        
    //modelList.appendChild(btn);
    if(modelList.children.length === 1){
        modelList.appendChild(btn);
    }
    else{
        modelList.insertBefore(btn, modelList.children[1]);
    }
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5);
}

function loadModel(modelId, flag = true) {
    const model = savedModels.find(m => m.id === modelId);
    if (!model) return;

    //const temp1 = curModel.data.modelName ? curModel.data.modelName : document.getElementById(curModel.id).children[0].children[0].textContent;

    //userData[temp1]["data_awdfasda"] = userData["data_awdfasda"];

    currentModelId = modelId;
    inputs[0].value = model.data.author || '';
    inputs[1].value = model.data.organization || '';
    inputs[2].value = model.data.modelName || '';
    inputs[3].value = model.data.modelCode || '';
    inputs[4].value = model.data.modelCharacteristics || '';
    inputs[5].value = model.data.systemInfo || '';
    inputs[6].value = model.data.comments || '';

    const temp = sessionStorage.getItem('formData1');
    //console.log(JSON.parse(temp));
    if(!temp){
        sessionStorage.setItem('formData1', JSON.stringify(model.data));
    }
    // Переносим модель в начало списка
    savedModels = savedModels.filter(m => m.id !== modelId);
    savedModels.push(model);
    let btn = document.getElementById(model.id);
    const modelList = document.getElementById('modelList');
    const index = Array.from(modelList.children).indexOf(btn);
    modelList.removeChild(btn);
    if(modelList.children.length === 1){
        modelList.appendChild(btn);
    }
    else{
        modelList.insertBefore(btn, modelList.children[1]);
    }
    //saveModels();
    sessionStorage.setItem("currentModel", model.name);
    //console.log(sessionStorage.getItem("currentModel"));
    //console.log(model)
    if(flag){
        console.log(ServerAdress+`/data/${GlobalLogin ? GlobalLogin : sessionStorage.getItem("GlobalLogin")}/${model.name}`)
        fetch(ServerAdress+`/data/${GlobalLogin ? GlobalLogin : sessionStorage.getItem("GlobalLogin")}/${model.name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(answer => {
            userData = answer;
            sessionStorage.setItem("for-matricies", JSON.stringify(userData["data_awdfasda"]["forMatricies"]));
        
            sessionStorage.setItem("compliance-matricies-data", JSON.stringify(userData["data_awdfasda"]["compliance-matricies-data"]));
        
            sessionStorage.setItem("traceability-matricies-data", JSON.stringify(userData["data_awdfasda"]["traceability-matricies-data"]));
        
            sessionStorage.setItem("all-objects", JSON.stringify(userData["data_awdfasda"]["all-objects"]));
        
            sessionStorage.setItem("initial-data", JSON.stringify(userData["data_awdfasda"]["initial-data"]));
        
            sessionStorage.setItem("initial-requrements-data", JSON.stringify(userData["data_awdfasda"]["initial-requrements"]));
        
            console.log(userData);

            showToast(`Загружена: ${model.name} - ${model.variant}`, 'success');
            createComplianceButtons("information-about-model.html");
            document.getElementById("equalsBtn").disabled = !IsComplianceEnabled();
            createComplianceButtons();
            document.getElementById("verificationBtn").disabled = !IsTraceabilityEnabled();
            createTraceabilityButtons("information-about-model.html");

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });  
    }
    else{
        sessionStorage.setItem("for-matricies", JSON.stringify(userData["data_awdfasda"]["forMatricies"]));
        
        sessionStorage.setItem("compliance-matricies-data", JSON.stringify(userData["data_awdfasda"]["compliance-matricies-data"]));
        
        sessionStorage.setItem("traceability-matricies-data", JSON.stringify(userData["data_awdfasda"]["traceability-matricies-data"]));
        
        sessionStorage.setItem("all-objects", JSON.stringify(userData["data_awdfasda"]["all-objects"]));
        
        sessionStorage.setItem("initial-data", JSON.stringify(userData["data_awdfasda"]["initial-data"]));
        
        sessionStorage.setItem("initial-requrements-data", JSON.stringify(userData["data_awdfasda"]["initial-requrements"]));
        
        console.log(userData);

        showToast(`Загружена: ${model.name} - ${model.variant}`, 'success');
        createComplianceButtons("information-about-model.html");
        document.getElementById("equalsBtn").disabled = !IsComplianceEnabled();
        createComplianceButtons();
        document.getElementById("verificationBtn").disabled = !IsTraceabilityEnabled();
        createTraceabilityButtons("information-about-model.html");
    }
    
    
}

function saveDataLocally(inputs, callback) {
    if (!currentModelId) return;

    const index = savedModels.findIndex(model => model.id === currentModelId);
    
    const model = savedModels[index];
    if (!model) return;
    
    model.data = {
        author: inputs[0].value.trim(),
        organization: inputs[1].value.trim(),
        modelName: inputs[2].value.trim(),
        modelCode: inputs[3].value.trim(),
        modelCharacteristics: inputs[4].value.trim(),
        systemInfo: inputs[5].value.trim(),
        comments: inputs[6].value.trim()
    };
    if(model.data.modelName === "specialFieldForModels_ddqasdawd" || model.data.modelName === "data_awdfasda") {
        showNotification("Некорректное название модели!", false)
        return;
    }
    for(let i = 0; i < savedModels.length; ++i){
        if(savedModels[i].name === model.data.modelName && savedModels[i].id !== model.id){
            showNotification("Модель с таким именем уже существует", false);
            return;

        }
    }
    
    if(savedModels[index].name !== model.data.modelName){


        sessionStorage.setItem("currentModel", model.data.modelName);
        //console.log(sessionStorage.getItem("currentModel"));
        document.getElementById(currentModelId).firstElementChild.firstElementChild.textContent = model.data.modelName;
        const oldName = structuredClone(model.name);
        const newName = model.data.modelName;
        model.name = model.data.modelName
        savedModels[index].name = newName;


        fetch(ServerAdress+`/data/${GlobalLogin ? GlobalLogin : sessionStorage.getItem("GlobalLogin")}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                old: oldName,
                new: newName,
                updatedInfo: savedModels
            })
        })

    }

    saveModels();
    
    try {
        sessionStorage.setItem('formData1', JSON.stringify(model.data));
        console.log(sessionStorage.getItem('formData1'));
        showToast('Данные сохранены!', 'success');
        if (callback) callback();
    } catch (e) {
        showToast(`Ошибка сохранения: ${e.message}`, 'error');
    }
}

function loadSavedData(inputs) {
    const savedData = sessionStorage.getItem('formData1');
    if (!savedData) return;

    try {
        const parsedData = JSON.parse(savedData);
        inputs[0].value = parsedData.author || '';
        inputs[1].value = parsedData.organization || '';
        inputs[2].value = parsedData.modelName || '';
        inputs[3].value = parsedData.modelCode || '';
        inputs[4].value = parsedData.modelCharacteristics || '';
        inputs[5].value = parsedData.systemInfo || '';
        inputs[6].value = parsedData.comments || '';
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
    }
}

function setupFormSubmit(inputs) {
    document.getElementById('submit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (validateForm(inputs)) {
            saveDataLocally(inputs);
            showNotification("Не забудьте добавить данные в модель!");
        }
    });
}

function validateForm(inputs) {
    const requiredFields = [0, 1, 2, 5]; // Индексы обязательных полей
    for (const index of requiredFields) {
        if (!inputs[index].value.trim()) {
            showToast(`Поле "${inputs[index].previousElementSibling.textContent}" обязательно для заполнения`, 'error');
            inputs[index].focus();
            return false;
        }
    }
    
    let isValid = true;
    inputs.forEach((input, i) => {
        if (input.value.length > input.maxLength * 0.9) {
            showToast(`Поле "${input.previousElementSibling.textContent}" близко к максимальной длине`, 'warning');
            isValid = false;
        }
    });
    
    return isValid;
}

function setupActionButtons(inputs) {
    const navigateWithCheck = (url) => {
        if (!hasUnsavedChanges(inputs)) {
            navigateTo(url);
            return;
        }
        
        const decision = confirm('У вас есть несохранённые изменения. Сохранить перед переходом?');
        if (decision) {
            saveDataLocally(inputs, () => navigateTo(url));
        } else {
            navigateTo(url);
        }
    };
    
    document.getElementById("backBtn").addEventListener("click", (e) => {
        e.preventDefault();
        if (!validateRequiredFields(inputs)) {
            document.getElementById('data-input').dispatchEvent(new Event('submit'));
            if(confirm(`Не все обязательные поля заполелны. Уйти без сохранения?`)){
                window.location.href = "log-in.html";
            }
        }
        else {
        navigateWithCheck("log-in.html");
        }
    });
    
    document.getElementById("nextBtn").addEventListener("click", (e) => {
        e.preventDefault();
        if (!validateRequiredFields(inputs)) {
            document.getElementById('data-input').dispatchEvent(new Event('submit'));
            return;
        }
        navigateWithCheck("initial-data.html");
        console.log(sessionStorage.getItem('formData1'));
    });
    
    document.getElementById('toServerBtn').addEventListener('click', () => {
        saveDataLocally(inputs);
        saveModels();
        toServerSave(); //к серверу
        showToast('Данные добавлены в модель!', 'success');
    });
    
    document.getElementById('exitBtn').addEventListener('click', () => {
        // if (confirm('Удалить все сохранённые данные?')) {
        //     sessionStorage.removeItem('formData1');
        //     document.getElementById('data-input').reset();
        //     showToast('Данные удалены!', 'info');
            
        // }
        sessionStorage.clear();
        window.location.href = "log-in.html";
    });
}

function hasUnsavedChanges(inputs) {
    const savedData = sessionStorage.getItem('formData1');
    if (!savedData) return inputs.some(input => input.value.trim() !== '');
    
    try {
        const parsedData = JSON.parse(savedData);
        return inputs.some((input, i) => {
            const fieldName = Object.keys(parsedData)[i];
            return input.value.trim() !== (parsedData[fieldName] || '');
        });
    } catch (e) {
        return true;
    }
}

function setupHeaderButtons() {
    document.getElementById("What2do").addEventListener("click", () => {
        showToast("Раздел помощи будет реализован позже", "info");
    });
    
    document.getElementById("How2do").addEventListener("click", () => {
        showToast("Раздел помощи будет реализован позже", "info");
    });
}

function setupDropUpMenus() {
    const dropUps = document.querySelectorAll('.dropUp');
    
    dropUps.forEach(dropUp => {
        const btn = dropUp.querySelector('.footer-btn');
        const menu = dropUp.querySelector('.dropUp-content');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.style.display === 'flex';
            closeAllMenus();
            menu.style.display = isOpen ? 'none' : 'flex';
        });
        
        // menu.querySelectorAll('.dropUpBtn').forEach(item => {
        //     item.addEventListener('click', function(e) {
        //         e.stopPropagation();
        //         const action = this.textContent;
        //         showToast(`Выбрано: ${action}`, 'info');
        //         menu.style.display = 'none';
        //     });
        // });
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropUp')) {
            closeAllMenus();
        }
    });
}

function closeAllMenus() {
    document.querySelectorAll('.dropUp-content').forEach(menu => {
        menu.style.display = 'none';
    });
}

function navigateTo(url) {
    // sessionStorage.clear();
    window.location.href = url;
}

function addInputCounters(inputs) {
    inputs.forEach(input => {
        const counter = document.createElement('div');
        counter.className = 'input-counter';
        input.parentNode.appendChild(counter);
        
        const updateCounter = () => {
            counter.textContent = `${input.value.length}/${input.maxLength}`;
            counter.style.color = input.value.length > input.maxLength * 0.9 ? 'red' : '#666';
        };
        
        input.addEventListener('input', updateCounter);
        updateCounter();
    });
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function showNotification(message, type = 'success') { //показать уведомление пользователю
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '75px';
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

function loadViews(){
    let views = [
        {
            "number": 1,
            "header": "Представление_1",
            "code": "SDFS-1",
            "components": [
                {
                    "number": 1,
                    "name": "Компонент_1",
                    "code": "fafa-53_"
                },
                {
                    "number": 2,
                    "name": "Компонент_2",
                    "code": "fafa-54"
                },
                {
                    "number": 3,
                    "name": "Компонент_3",
                    "code": "fafa-55"
                }
            ]
    
    
        },
        {
            "number": 2,
            "header": "Представление_2",
            "code": "SDFS-2",
            "components": [
                {
                    "number": 4,
                    "name": "Компонент_4",
                    "code": "fafa-56_"
                },
                {
                    "number": 5,
                    "name": "Компонент_5",
                    "code": "fafa-57"
                },
            ]
    
    
        },
        {
            "number": 5,
            "header": "Представление_5",
            "code": "SDFS-5",
            "components": [
                {
                    "number": 1,
                    "name": "Компонент_6",
                    "code": "fafa-58_"
                },
                {
                    "number": 2,
                    "name": "Компонент_7",
                    "code": "fafa-59"
                },
            ]
    
    
        }
    ]

    return views;
}
