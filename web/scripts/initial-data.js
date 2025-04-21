document.addEventListener("DOMContentLoaded", () => {
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
}

// Мок-данные
function receiveData() {
    return [
        { name: "Основной замысел", maxLength: 10 },
        { name: "Условия работы", maxLength: 1000 },
        { name: "Допущения", maxLength: 800 },
        { name: "Дополнительно", maxLength: 700 }
    ];
}

// Сохранение данных в localStorage
function saveDataLocally(inputs, callback) {
    const formData = {
        concept: inputs[0].value.trim(),
        conditions: inputs[1].value.trim(),
        assumptions: inputs[2].value.trim(),
        otherInfo: inputs[3].value.trim(),
        lastSaved: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('formData', JSON.stringify(formData));
        showToast('Данные сохранены!', 'success');
        if (callback) callback();
    } catch (e) {
        showToast(`Ошибка сохранения: ${e.message}`, 'error');
    }
}

// Загрузка сохранённых данных
function loadSavedData(inputs) {
    const savedData = localStorage.getItem('formData');
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
        saveDataLocally(inputs);
    });
}

// Настройка обработчиков кнопок footer
function setupActionButtons(inputs) {
    const navigateWithCheck = (url) => {
        const savedData = localStorage.getItem('formData');
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
        navigateWithCheck("log-in.html");
    });
    
    // Кнопка "Вперед"
    document.getElementById("nextBtn").addEventListener("click", (e) => {
        e.preventDefault();
        navigateWithCheck("../form2/form2.html");
    });
    
    // Кнопка "Добавить"
    document.getElementById('toServerBtn').addEventListener('click', () => {
       // saveDataLocally(inputs);
    });
    
    // Кнопка "Выйти"
    document.getElementById('exitBtn').addEventListener('click', () => {
        if (confirm('Удалить все сохранённые данные?')) {
            localStorage.removeItem('formData');
            document.getElementById('data-input').reset();
            showToast('Данные удалены!', 'info');
        }
    });
}

// Настройка кнопок header
function setupHeaderButtons() {
    document.getElementById("helpBtn").addEventListener("click", () => {
        showToast("Раздел помощи будет реализован позже", "info");
    });
    
    document.getElementById("settingsBtn").addEventListener("click", () => {
        showToast("Настройки будут доступны в следующей версии", "info");
    });
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
        menu.querySelectorAll('.dropUpBtn').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.textContent;
                showToast(`Выбрано: ${action}`, 'info');
                menu.style.display = 'none';
                
                // Логика для разных пунктов меню
                if (action.includes('соответствия')) {
                    // Действия для матрицы соответствия
                } else if (action.includes('верификации')) {
                    // Действия для матрицы верификации
                }
            });
        });
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
    sessionStorage.clear();
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