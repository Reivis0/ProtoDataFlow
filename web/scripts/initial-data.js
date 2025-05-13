let userData;
let GlobalLogin;
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

    const inputs = [
        document.getElementById("concept"),
        document.getElementById("conditions"),
        document.getElementById("assumptions"),
        document.getElementById("other-info")
    ];
    
    const labels = Array.from({length: 4}, (_, i) => 
        document.getElementById(`label${i+1}`)
    );

    // 2. Загрузка начальных данных
    const dataFromServer = receiveData();
    configureForm(labels, inputs, dataFromServer);    
    loadSavedData(inputs);    
    setupFormSubmit(inputs);
    setupActionButtons(inputs);
    addInputCounters(inputs);
    setupDropUpMenus();
    setupHeaderButtons();
    document.getElementById("equalsBtn").disabled = !IsComplianceEnabled();
    createComplianceButtons("initial-data.html");
    document.getElementById("verificationBtn").disabled = !IsTraceabilityEnabled();
    createTraceabilityButtons("initial-data.html");
});

// Настройка формы на основе данных
function configureForm(labels, inputs, serverData) {
    labels.forEach((label, i) => {
        const fieldData = serverData[i] || {};
        label.textContent = fieldData.name || `Заголовок ${i+1}`;
        
        const maxLen = Number(fieldData.maxLength) || 100;
        inputs[i].maxLength = maxLen > 0 ? maxLen : 100;
        inputs[i].setAttribute('maxlength', inputs[i].maxLength);
    });
    const formData = {
        concept: inputs[0].value.trim(),
        conditions: inputs[1].value.trim(),
        assumptions: inputs[2].value.trim(),
        otherInfo: inputs[3].value.trim(),
        lastSaved: new Date().toISOString()
    };
    const temp = sessionStorage.getItem('initial-data');
    if(!temp){
        sessionStorage.setItem('initial-data', JSON.stringify(userData["data_awdfasda"]['initial-data']));
    }
    //sessionStorage.setItem('initial-data', JSON.stringify(formData));
}

// Мок-данные
function receiveData() { //тут должны быть еще заголовки
    return [
        { name: "Основной замысел", maxLength: 10 },
        { name: "Условия работы", maxLength: 1000 },
        { name: "Допущения", maxLength: 800 },
        { name: "Дополнительно", maxLength: 700 }
    ];
}

// Сохранение данных в sessionStorage
function saveDataLocally(inputs, callback) {
    const formData = {
        concept: inputs[0].value.trim(),
        conditions: inputs[1].value.trim(),
        assumptions: inputs[2].value.trim(),
        otherInfo: inputs[3].value.trim(),
        lastSaved: new Date().toISOString()
    };
    
    try {
        sessionStorage.setItem('initial-data', JSON.stringify(formData));
        showToast('Данные сохранены!', 'success');
        if (callback) callback();
    } catch (e) {
        showToast(`Ошибка сохранения: ${e.message}`, 'error');
    }
}

function validateRequiredFields(inputs) {
    const requiredFields = [0]; // Индексы обязательных полей: АХХАХА ОНО ТУТ ОДНО ЛООЛ
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
// Загрузка сохранённых данных
function loadSavedData(inputs) {
    const savedData = sessionStorage.getItem('initial-data');
    if (!savedData) return;

    try {
        const parsedData = JSON.parse(savedData);
        inputs[0].value = parsedData.concept || '';
        inputs[1].value = parsedData.conditions || '';
        inputs[2].value = parsedData.assumptions || '';
        inputs[3].value = parsedData.otherInfo || '';
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
    }
}

// Настройка обработчика отправки формы
function setupFormSubmit(inputs) {
    document.getElementById('data-input').addEventListener('submit', (e) => {
        e.preventDefault();
         if (validateRequiredFields(inputs)) {
            saveDataLocally(inputs);
            showNotification("Не забудьте добавить данные в модель!");
        }
    });
}

// Настройка обработчиков кнопок footer
function setupActionButtons(inputs) {
    const navigateWithCheck = (url) => {
        const savedData = sessionStorage.getItem('initial-data');
        const currentData = {
            concept: inputs[0].value.trim(),
            conditions: inputs[1].value.trim(),
            assumptions: inputs[2].value.trim(),
            otherInfo: inputs[3].value.trim()
        };
        
        const isFormPristine = !savedData && Object.values(currentData).every(val => !val);
        
        if (isFormPristine || 
            (savedData && JSON.stringify({...JSON.parse(savedData), lastSaved: undefined}) === 
             JSON.stringify(currentData))) {
            navigateTo(url);
            return;
        }
        
        if (confirm('У вас есть несохранённые изменения. Сохранить перед переходом?')) {
            saveDataLocally(inputs, () => navigateTo(url));
        } else {
            navigateTo(url);
        }
    };
    
    // Кнопка "Назад"
    document.getElementById("backBtn").addEventListener("click", (e) => {
        e.preventDefault();
        if (!validateRequiredFields(inputs)) {
            //document.getElementById('data-input').dispatchEvent(new Event('submit'));
            if(confirm(`Не все обязательные поля заполелны. Уйти без сохранения?`)){
                window.location.href = "information-about-model.html";
            }
        }
        else{
            navigateWithCheck("information-about-model.html");
        }
        });
    
    // Кнопка "Вперед"
    document.getElementById("nextBtn").addEventListener("click", (e) => {
        e.preventDefault();
        if (!validateRequiredFields(inputs)) {
            document.getElementById('data-input').dispatchEvent(new Event('submit'));
            return;
        }
        navigateWithCheck("initial-requrements.html");
    });
    
    // Кнопка "Добавить"
    document.getElementById('toServerBtn').addEventListener('click', () => {
        saveDataLocally(inputs);
        saveToModel();
        toServerSave(); //к серверу
        showToast('Данные добавлены в модель!', 'success');
    });
    
    
    // Кнопка "Выйти"
    document.getElementById('exitBtn').addEventListener('click', () => {
        // if (confirm('Удалить все сохранённые данные?')) {
        //     sessionStorage.removeItem('initial-data');
        //     document.getElementById('data-input').reset();
        //     showToast('Данные удалены!', 'info');
        // }
        // navigateWithCheck("log-in.html");
        sessionStorage.clear();
        window.location.href = "log-in.html";
    });
}

// Настройка кнопок header
function setupHeaderButtons() {
    // document.getElementById("helpBtn").addEventListener("click", () => {
    //     showToast("Раздел помощи будет реализован позже", "info");
    // });
    
    // document.getElementById("settingsBtn").addEventListener("click", () => {
    //     showToast("Настройки будут доступны в следующей версии", "info");
    // });
}

// Настройка выпадающих меню
function setupDropUpMenus() {
    const dropUps = document.querySelectorAll('.dropUp');
    
    dropUps.forEach(dropUp => {
        const btn = dropUp.querySelector('.footer-btn');
        const menu = dropUp.querySelector('.dropUp-content');
        
        // Открытие/закрытие по клику
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.style.display === 'flex';
            closeAllMenus();
            menu.style.display = isOpen ? 'none' : 'flex';
        });
        
        // Обработчики для пунктов меню
        // menu.querySelectorAll('.dropUpBtn').forEach(item => {
        //     item.addEventListener('click', function(e) {
        //         e.stopPropagation();
        //         const action = this.textContent;
        //         showToast(`Выбрано: ${action}`, 'info');
        //         menu.style.display = 'none';
                
        //         // Логика для разных пунктов меню
        //         if (action.includes('соответствия')) {
        //             // Действия для матрицы соответствия
        //         } else if (action.includes('верификации')) {
        //             // Действия для матрицы верификации
        //         }
        //     });
        // });
    });
    
    // Закрытие всех меню при клике вне
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

// Функция перехода
function navigateTo(url) {
    // sessionStorage.clear();
    window.location.href = url;
}

// Добавление счетчиков символов
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

// Показать уведомление
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function saveToModel(){
    userData["data_awdfasda"]['initial-data'] = JSON.parse(sessionStorage.getItem('initial-data'));
    localStorage.setItem(`data-model`, JSON.stringify(userData));
     console.log(JSON.parse(localStorage.getItem(`data-model`)));
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