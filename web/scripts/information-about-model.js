document.addEventListener("DOMContentLoaded", () => {
    // Получаем все элементы формы
    const inputs = [
        document.getElementById("author"),
        document.getElementById("organization"),
        document.getElementById("modelName"),
        document.getElementById("modelCode"),
        document.getElementById("modelCharacteristics"),
        document.getElementById("systemInfo"),
        document.getElementById("comments")
    ];
    
    // Получаем все label элементы
    const labels = inputs.map(input => document.querySelector(`label[for="${input.id}"]`));

    // Инициализация модели
    let savedModels = [];
    let currentModelId = null;

    // Основные функции
    function configureForm(labels, inputs, serverData) {
        labels.forEach((label, i) => {
            const fieldData = serverData[i] || {};
            if (label && fieldData.name) {
                label.textContent = fieldData.name;
            }
            
            const defaultMaxLen = inputs[i].tagName === 'TEXTAREA' ? 2000 : 150;
            const maxLen = Number(fieldData.maxLength) || defaultMaxLen;
            inputs[i].maxLength = maxLen > 0 ? maxLen : defaultMaxLen;
            inputs[i].setAttribute('maxlength', inputs[i].maxLength);
        });
    }

    function receiveData() {
        return [
            { name: "Автор модели", maxLength: 100 },
            { name: "Организация", maxLength: 150 },
            { name: "Название модели", maxLength: 120 },
            { name: "Код модели", maxLength: 10 },
            { name: "Характеристика модели", maxLength: 2000 },
            { name: "Сведения о системе", maxLength: 2000 },
            { name: "Комментарии", maxLength: 1000 }
        ];
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
            currentModelId = savedModels[0].id;
            loadModel(currentModelId);
        }
    }

    function createNewModel() {
        const modelId = Date.now();
        const newModel = {
            id: modelId,
            name: `Модель ${savedModels.length + 1}`,
            variant: `Вариант 1`,
            date: new Date(),
            data: getFormData()
        };
        
        savedModels.unshift(newModel);
        currentModelId = modelId;
        saveModels();
        updateModelList();
        showToast(`Создана: ${newModel.name} - ${newModel.variant}`, 'success');
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
        const modelsData = localStorage.getItem('savedModels');
        if (modelsData) {
            savedModels = JSON.parse(modelsData);
            updateModelList();
        }
    }

    function saveModels() {
        localStorage.setItem('savedModels', JSON.stringify(savedModels));
    }

    function updateModelList() {
        const modelList = document.getElementById('modelList');
        while (modelList.children.length > 1) {
            modelList.removeChild(modelList.lastChild);
        }
        
        savedModels.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(model => {
            const btn = document.createElement('button');
            btn.className = 'dropUpBtn model-item';
            btn.innerHTML = `
                <div class="model-info">
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
            
            modelList.appendChild(btn);
        });
    }

    function formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5);
    }

    function loadModel(modelId) {
        const model = savedModels.find(m => m.id === modelId);
        if (!model) return;
        
        currentModelId = modelId;
        inputs[0].value = model.data.author || '';
        inputs[1].value = model.data.organization || '';
        inputs[2].value = model.data.modelName || '';
        inputs[3].value = model.data.modelCode || '';
        inputs[4].value = model.data.modelCharacteristics || '';
        inputs[5].value = model.data.systemInfo || '';
        inputs[6].value = model.data.comments || '';
        
        // Переносим модель в начало списка
        savedModels = savedModels.filter(m => m.id !== modelId);
        savedModels.unshift(model);
        saveModels();
        
        showToast(`Загружена: ${model.name} - ${model.variant}`, 'success');
    }

    function saveDataLocally(inputs, callback) {
        if (!currentModelId) return;
        
        const model = savedModels.find(m => m.id === currentModelId);
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
        model.date = new Date();
        
        saveModels();
        
        try {
            localStorage.setItem('formData', JSON.stringify(model.data));
            showToast('Данные сохранены!', 'success');
            if (callback) callback();
        } catch (e) {
            showToast(`Ошибка сохранения: ${e.message}`, 'error');
        }
    }

    function loadSavedData(inputs) {
        const savedData = localStorage.getItem('formData');
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
        document.getElementById('data-input').addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(inputs)) {
                saveDataLocally(inputs);
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
            navigateWithCheck("../form/form1.html");
        });
        
        document.getElementById("nextBtn").addEventListener("click", (e) => {
            e.preventDefault();
            navigateWithCheck("smth.html");
        });
        
        document.getElementById('toServerBtn').addEventListener('click', () => {
            saveDataLocally(inputs);
        });
        
        document.getElementById('exitBtn').addEventListener('click', () => {
            if (confirm('Удалить все сохранённые данные?')) {
                localStorage.removeItem('formData');
                document.getElementById('data-input').reset();
                showToast('Данные удалены!', 'info');
            }
        });
    }

    function hasUnsavedChanges(inputs) {
        const savedData = localStorage.getItem('formData');
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
        document.getElementById("helpBtn").addEventListener("click", () => {
            showToast("Раздел помощи будет реализован позже", "info");
        });
        
        document.getElementById("settingsBtn").addEventListener("click", () => {
            showToast("Настройки будут доступны в следующей версии", "info");
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
            
            menu.querySelectorAll('.dropUpBtn').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const action = this.textContent;
                    showToast(`Выбрано: ${action}`, 'info');
                    menu.style.display = 'none';
                });
            });
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
        sessionStorage.clear();
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

    // Инициализация
    const dataFromServer = receiveData();
    configureForm(labels, inputs, dataFromServer);    
    loadSavedData(inputs);    
    setupFormSubmit(inputs);
    setupActionButtons(inputs);
    addInputCounters(inputs);
    setupDropUpMenus();
    setupHeaderButtons();
    initModelLoader();
});