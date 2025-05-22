const form = document.getElementById('loginForm');
const login = document.getElementById('login-in');
const password = document.getElementById('password-in');
const error_div = document.getElementById('errorMessage');
//учимся делать новые ветки

document.addEventListener("DOMContentLoaded", (e) => {
    localStorage.clear();
    console.log(localStorage.getItem(`data-model`));
    fetch(ServerAdress+'/users/')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        localStorage.setItem("all-users", JSON.stringify(data));
        //console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
})

form.addEventListener('submit', (e) => {

    let pair = new Object();  //собрать данные для отправки
    pair.login = login.value;
    pair.password = password.value;
    let jsonstr = JSON.stringify(pair);

    //localStorage.clear();

    
    e.preventDefault();

    
    let jsonanswer = tempCheckLoginAndPassword(jsonstr);
    let answer = JSON.parse(jsonanswer); //ответ от сервера
    if(answer.status === 'Correct') { //если все хорошо
        sessionStorage.setItem('GlobalLogin', login.value);
        sessionStorage.setItem('GlobalLevel', answer.privilege);
        e.preventDefault();  
        if(answer.access){ 
            fetch(ServerAdress+`/data/${pair.login}/no`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); 
            })
            .then(model => {
                localStorage.setItem(`data-model`, JSON.stringify(model));

                fetch(ServerAdress+'/settings/')
                            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); 
            })
            .then(settings => {

                sessionStorage.setItem('JSONSettings1', JSON.stringify(settings.settings1));
                sessionStorage.setItem('JSONSettings2', JSON.stringify(settings.settings2));
                sessionStorage.setItem('JSONSettings3', JSON.stringify(settings.settings3));

                if(!answer.agreement) {
                    window.location.assign("rules-of-usage.html");
                }
                else{
                    window.location.assign("information-about-model.html");
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });  
        }
        else {
            error_div.innerText = "Доступ закончился";
            e.preventDefault();
        }

    }
    else if (answer.status === 'User not found'){
        error_div.innerText = "Неправильный логин";
        e.preventDefault();
    }
    else if (answer.status === 'Incorrect password'){
        error_div.innerText = "Неправильный пароль";
        e.preventDefault();
    }
    

})

const twoInputs = [login, password];

twoInputs.forEach(input => { //стереть сообщение об ошибке когда исправляют данные
    input.addEventListener('input', () => {
        error_div.innerText = '';
    })
})


function tempCheckLoginAndPassword(jsonstr){
    let input = JSON.parse(jsonstr);
    let obj = new Object();
    //console.log(localStorage.getItem("all-users"));
    // if(!localStorage.getItem("all-users")){
    //     localStorage.setItem("all-users", JSON.stringify([
    //     { id: 1, level: "superAdmin", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "111", password: "111", acsess: true,
    //       startDate: new Date("1970-02-03"), endDate: new Date("2095-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd", agreement: false}]));

    //     localStorage.setItem("data-111", JSON.stringify({specialFieldForModels_ddqasdawd: null, data_awdfasda: null})); //такое название поля чтобы точно не совпало с названиями модели
    // }

   
    const AllUsers = JSON.parse(localStorage.getItem("all-users"));
    let flag = true;
    for(let i = 0; i < AllUsers.length; ++i){
        if(AllUsers[i].login === input.login){
            flag = false;
            if(AllUsers[i].password === input.password){
                const currTime = new Date();
                if(AllUsers[i].access && (AllUsers[i].startDate ? new Date(AllUsers[i].startDate) <= currTime : true) && (AllUsers[i].endDate ? currTime <= new Date(AllUsers[i].endDate) : true)){
                    obj.status = 'Correct';
                    obj.privilege = AllUsers[i].level;
                    obj.agreement = AllUsers[i].agreement;
                    obj.access = true;
                }
                else{
                    obj.status = 'Correct';
                    obj.privilege = AllUsers[i].level;
                    obj.agreement = AllUsers[i].agreement;
                    obj.access = false;
                }
            }
            else{
                obj.status = 'Incorrect password';
                obj.privilege = 'user';
                obj.agreement = false;
                obj.access = false
            }
            break
        }
    }
    if(flag){
        obj.status = 'User not found';
        obj.privilege = 'user';
        obj.agreement = false;
        obj.access = false;
    }
    return JSON.stringify(obj);
    //return tempFunction(jsonstr);
}

function tempFunction(jsonstr) { // 123 123 - user без согласияб 321 321 - admin с согласием, 222 222 - доступ кончился по времени
    let temp = JSON.parse(jsonstr);
    let obj = new Object();
    if (temp.login === '123' && temp.password === '123') {
        obj.status = 'Correct';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'true';
    }
    else if (temp.login === '321' && temp.password === '321') {
        obj.status = 'Correct';
        obj.privilege = 'admin';
        obj.agreement = 'true';
        obj.access = 'true';
    }
    else if (temp.login === '222' && temp.password === '222'){
        obj.status = 'Correct';
        obj.privilege = 'user';
        obj.agreement = 'true';
        obj.access = 'false';
    }
    else if (temp.login === '111' && temp.password === '111'){
        obj.status = 'Correct';
        obj.privilege = 'superAdmin';
        obj.agreement = 'true';
        obj.access = 'true';
    }
    else if (temp.login !== '321' && temp.login !== '123' && temp.login !== '222' && temp.login !== '111'){
        obj.status = 'User not found';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'false';
    }

    else if (temp.password !== '321' && temp.password !== '123' && temp.password !== '222' && temp.password !== '111'){
        obj.status = 'Incorrect password';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'false';
    }

    return JSON.stringify(obj);
}
